export type ChatRole = 'user' | 'assistant' | 'system'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  createdAt: string // ISO string
}

export type CreateMessageOptions = {
  now?: Date
  idPrefix?: string
}

function generateId(prefix?: string): string {
  // Prefer crypto.randomUUID when available
  const uuid = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto?.randomUUID?.()
  const base = uuid ?? Math.random().toString(36).slice(2) + Date.now().toString(36)
  return prefix ? `${prefix}_${base}` : base
}

/**
 * Creates a standardized chat message with id and ISO timestamp.
 * - Trims content and validates role
 * - Allows deterministic timestamp via opts.now for tests
 */
export function createChatMessage(
  role: ChatRole,
  content: string,
  opts: CreateMessageOptions = {}
): ChatMessage {
  const allowedRoles: ChatRole[] = ['user', 'assistant', 'system']
  if (!allowedRoles.includes(role)) {
    throw new Error(`Invalid role: ${role}`)
  }

  const trimmed = (content ?? '').trim()
  if (trimmed.length === 0) {
    throw new Error('Content must be a non-empty string')
  }

  const now = opts.now ?? new Date()

  return {
    id: generateId(opts.idPrefix),
    role,
    content: trimmed,
    createdAt: now.toISOString(),
  }
}


