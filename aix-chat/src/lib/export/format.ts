import type { Chat } from '@/lib/chat/chat'

export function chatToJson(chat: Chat): string {
  return JSON.stringify(chat, null, 2)
}

export function chatToMarkdown(chat: Chat): string {
  const header = `# ${chat.title || 'Chat'}\n\nCreated: ${chat.createdAt}\n\n`
  const lines = chat.messages.map((m) => `## ${m.role}\n\n${m.content}\n`)
  return header + lines.join('\n')
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function importChatFromFile(file: File): Promise<Chat> {
  const content = await file.text()
  const parsed = JSON.parse(content)
  return parsed as Chat
}


