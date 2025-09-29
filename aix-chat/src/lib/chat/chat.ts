import { type ChatMessage } from './message'

export type Chat = {
  id: string
  title: string
  createdAt: string // ISO string
  messages: ChatMessage[]
}

export type CreateChatOptions = {
  now?: Date
  idPrefix?: string
  title?: string
}

function generateId(prefix?: string): string {
  const uuid = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto?.randomUUID?.()
  const base = uuid ?? Math.random().toString(36).slice(2) + Date.now().toString(36)
  return prefix ? `${prefix}_${base}` : base
}

/**
 * Creates an empty chat object with metadata and no messages.
 */
export function createEmptyChat(opts: CreateChatOptions = {}): Chat {
  const now = opts.now ?? new Date()
  const title = (opts.title ?? 'New Chat').trim() || 'New Chat'

  return {
    id: generateId(opts.idPrefix),
    title,
    createdAt: now.toISOString(),
    messages: [],
  }
}


