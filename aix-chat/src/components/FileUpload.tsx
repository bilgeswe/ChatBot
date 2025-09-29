'use client'

import React, { useRef, useState } from 'react'
import { extractTextFromFile } from '@/lib/files/extract'
import { useChatStore } from '@/lib/store/useChatStore'

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { currentChatId, newChat, sendUserMessage } = useChatStore()

  function openPicker() {
    inputRef.current?.click()
  }

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    // enforce type and size limits (10 MB)
    const okType = /pdf|doc|docx|sheet|excel|image\//i.test(file.type) || /\.(pdf|docx?|xlsx?|jpe?g|png)$/i.test(file.name)
    const maxBytes = 10 * 1024 * 1024
    if (!okType) {
      setError('Unsupported file type.')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    if (file.size > maxBytes) {
      setError('File too large (max 10 MB).')
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    setBusy(true)
    setProgress(0)
    try {
      const text = await extractTextFromFile(file, (p) => setProgress(Math.round(p * 100)))
      if (!currentChatId) newChat(file.name)
      
      // Add file context to the conversation
      const fileContext = `📄 **File uploaded: ${file.name}**\n\n${text.slice(0, 8000)}`
      await Promise.resolve(sendUserMessage(fileContext))
    } finally {
      setBusy(false)
      setProgress(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function summarizeFile() {
    const file = inputRef.current?.files?.[0]
    if (!file) return
    
    setError(null)
    setBusy(true)
    setProgress(0)
    
    try {
      const text = await extractTextFromFile(file, (p) => setProgress(Math.round(p * 100)))
      if (!currentChatId) newChat(`Summary of ${file.name}`)
      
      // Request a summary of the file
      const summaryPrompt = `Please provide a comprehensive summary of this file content:\n\n${text.slice(0, 8000)}`
      await Promise.resolve(sendUserMessage(summaryPrompt))
    } catch {
      setError('Failed to process file for summary')
    } finally {
      setBusy(false)
      setProgress(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xlsx,.xls,image/*"
        className="hidden"
        onChange={onChange}
      />
      <button
        type="button"
        className="rounded border border-gray-300 dark:border-neutral-700 px-2 py-1 text-xs disabled:opacity-60"
        onClick={openPicker}
        disabled={busy}
      >
        {busy ? 'Processing…' : 'Upload File'}
      </button>
      <button
        type="button"
        className="rounded border border-gray-300 dark:border-neutral-700 px-2 py-1 text-xs disabled:opacity-60"
        onClick={summarizeFile}
        disabled={busy || !inputRef.current?.files?.[0]}
      >
        {busy ? 'Summarizing…' : 'Summarize'}
      </button>
      {typeof progress === 'number' && (
        <span className="ml-2 inline-block h-2 w-24 rounded bg-gray-200 dark:bg-neutral-800 overflow-hidden align-middle">
          <span
            className="block h-2 bg-blue-600 dark:bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </span>
      )}
      {error && (
        <span className="text-xs text-red-600 ml-2">{error}</span>
      )}
    </div>
  )
}


