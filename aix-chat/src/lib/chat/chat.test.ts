import { describe, it, expect } from 'vitest'
import { createEmptyChat } from './chat'

describe('createEmptyChat', () => {
  it('creates a chat with default title and ISO timestamp', () => {
    const fixed = new Date('2024-06-01T10:00:00.000Z')
    const chat = createEmptyChat({ now: fixed, idPrefix: 'chat' })
    expect(chat.id.startsWith('chat_')).toBe(true)
    expect(chat.title).toBe('New Chat')
    expect(chat.createdAt).toBe('2024-06-01T10:00:00.000Z')
    expect(Array.isArray(chat.messages)).toBe(true)
    expect(chat.messages.length).toBe(0)
  })

  it('uses provided non-empty trimmed title', () => {
    const chat = createEmptyChat({ title: '  My Session  ' })
    expect(chat.title).toBe('My Session')
  })
})


