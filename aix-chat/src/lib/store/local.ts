import type { Chat } from '@/lib/chat/chat'

const DEFAULT_KEY = 'aix.chats'

/**
 * Reads chats from localStorage and returns a safe array.
 * - Returns [] if the key is missing, malformed, or not an array
 * - Silently guards against JSON parse errors
 */
export function loadChatsFromLocalStorage(key: string = DEFAULT_KEY): Chat[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [] // not in a browser environment
  }

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    // Ensure we only return arrays. Further validation can be added later.
    if (!Array.isArray(parsed)) return []
    return parsed as Chat[]
  } catch {
    // Malformed JSON or access error → return empty
    return []
  }
}

/**
 * Saves chats to localStorage safely.
 * - Returns false on SSR or any storage/stringify error
 */
export function saveChatsToLocalStorage(chats: Chat[], key: string = DEFAULT_KEY): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false
  }
  try {
    const payload = JSON.stringify(chats ?? [])
    window.localStorage.setItem(key, payload)
    return true
  } catch {
    return false
  }
}


