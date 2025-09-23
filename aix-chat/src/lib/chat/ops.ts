import type { Chat } from '@/lib/chat/chat'
import type { ChatMessage } from '@/lib/chat/message'

export type AppendResult = {
  updatedChats: Chat[]
  updatedChat?: Chat
}

/**
 * Appends a message to the chat with the given id, returning a new chats array.
 * - Pure/immutable: never mutates inputs
 * - If chat not found or chatId is empty → returns original chats unchanged
 */
export function appendMessageToChat(
  chats: Chat[],
  chatId: string,
  message: ChatMessage
): AppendResult {
  if (!Array.isArray(chats) || !chatId) {
    return { updatedChats: chats }
  }

  let found = false
  const next = chats.map((chat) => {
    if (chat.id !== chatId) return chat
    found = true
    const updated: Chat = {
      ...chat,
      messages: [...chat.messages, message],
    }
    return updated
  })

  if (!found) {
    return { updatedChats: chats }
  }

  const updatedChat = next.find((c) => c.id === chatId)
  return { updatedChats: next, updatedChat }
}

/**
 * Updates a specific message within a chat using an updater function.
 */
export function updateMessageInChat(
  chats: Chat[],
  chatId: string,
  messageId: string,
  updater: (prev: ChatMessage) => ChatMessage
): { updatedChats: Chat[]; updatedChat?: Chat } {
  if (!Array.isArray(chats) || !chatId || !messageId) {
    return { updatedChats: chats }
  }

  let foundChat = false
  let foundMessage = false

  const next = chats.map((chat) => {
    if (chat.id !== chatId) return chat
    foundChat = true
    const updatedMessages = chat.messages.map((m) => {
      if (m.id !== messageId) return m
      foundMessage = true
      return updater(m)
    })
    return { ...chat, messages: updatedMessages }
  })

  if (!foundChat || !foundMessage) {
    return { updatedChats: chats }
  }
  const updatedChat = next.find((c) => c.id === chatId)
  return { updatedChats: next, updatedChat }
}


