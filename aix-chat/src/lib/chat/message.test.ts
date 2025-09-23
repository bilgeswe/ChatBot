import { describe, it, expect } from 'vitest'
import { createChatMessage, type ChatMessage } from './message'

describe('createChatMessage', () => {
  it('creates a message with trimmed content and ISO timestamp', () => {
    const fixed = new Date('2024-01-02T03:04:05.678Z')
    const msg = createChatMessage('user', '  hello world  ', { now: fixed, idPrefix: 'msg' })
    expect(msg.role).toBe('user')
    expect(msg.content).toBe('hello world')
    expect(msg.createdAt).toBe('2024-01-02T03:04:05.678Z')
    expect(msg.id.startsWith('msg_')).toBe(true)
  })


  it('rejects invalid role', () => {
    // @ts-expect-error invalid role at runtime
    expect(() => createChatMessage('bad', 'hi')).toThrow('Invalid role: bad')
  })

  it('generates unique-ish ids without crypto', () => {
    const a: ChatMessage = createChatMessage('assistant', 'hi')
    const b: ChatMessage = createChatMessage('assistant', 'hi')
    expect(a.id).not.toBe(b.id)
  })
})


