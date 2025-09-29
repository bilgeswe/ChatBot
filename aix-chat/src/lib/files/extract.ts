// Basic client-side file text extraction for PDF/DOCX/XLSX/JPG.
// Keep it lightweight; for production, consider server-side processing for large files.

import * as XLSX from 'xlsx'

export type ExtractProgress = (p: number) => void

export async function extractTextFromFile(file: File, onProgress?: ExtractProgress): Promise<string> {
  const type = (file.type || '').toLowerCase()
  const name = file.name.toLowerCase()

  if (type.includes('pdf') || name.endsWith('.pdf')) {
    return extractPdf(file, onProgress)
  }
  if (type.includes('officedocument.wordprocessingml') || name.endsWith('.docx')) {
    return extractDocx(file)
  }
  if (
    type.includes('spreadsheet') ||
    name.endsWith('.xlsx') ||
    name.endsWith('.xls')
  ) {
    return extractXlsx(file)
  }
  if (type.startsWith('image/') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png')) {
    return extractImageOcr(file, onProgress)
  }
  // Fallback: read as text
  return await file.text()
}

async function extractPdf(file: File, onProgress?: ExtractProgress): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  // @ts-expect-error worker entry handled by pdfjs-dist
  const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs')
  ;(pdfjsLib as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc = worker.default || worker

  const arrayBuffer = await file.arrayBuffer()
  const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((it) => 'str' in it ? it.str || '' : '').join(' ') + '\n'
    if (onProgress) onProgress(i / doc.numPages)
  }
  return text.trim()
}

async function extractDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const res = await (mammoth as { extractRawText: (options: { arrayBuffer: ArrayBuffer }) => Promise<{ value?: string }> }).extractRawText({ arrayBuffer })
  return String(res?.value ?? '').trim()
}

async function extractXlsx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const wb = XLSX.read(arrayBuffer, { type: 'array' })
  const parts: string[] = []
  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 }) as string[][]
    parts.push(`# ${sheetName}`)
    for (const row of rows) {
      parts.push((row ?? []).join('\t'))
    }
  }
  return parts.join('\n').trim()
}

async function extractImageOcr(file: File, onProgress?: ExtractProgress): Promise<string> {
  try {
    const Tesseract = await import('tesseract.js')
    const url = URL.createObjectURL(file)
    const res = await (Tesseract as { recognize: (image: string, lang: string, options: { logger: (m: { progress?: number }) => void }) => Promise<{ data?: { text?: string } }> }).recognize(url, 'eng', {
      logger: (m: { progress?: number }) => {
        if (onProgress && typeof m?.progress === 'number') onProgress(m.progress)
      },
    })
    URL.revokeObjectURL(url)
    const text = String(res?.data?.text ?? '').trim()
    if (text) return text
  } catch {
    // fall through to metadata
  }
  return `Image file: ${file.name} (${Math.round(file.size / 1024)} KB)`
}


