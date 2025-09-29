'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createEmptyChat, type Chat } from '@/lib/chat/chat'
import { createChatMessage, type ChatMessage } from '@/lib/chat/message'
import { appendMessageToChat, updateMessageInChat } from '@/lib/chat/ops'
import { loadChatsFromLocalStorage, saveChatsToLocalStorage } from '@/lib/store/local'

const STORAGE_KEY = 'aix.chats'

export type ChatStore = {
  chats: Chat[]
  currentChatId: string | null
  currentChat: Chat | undefined
  isStreaming: boolean
  // actions
  load: () => void
  newChat: (title?: string) => Chat
  selectChat: (chatId: string) => void
  importChat: (chat: Chat) => void
  renameChat: (chatId: string, title: string) => void
  deleteChat: (chatId: string) => void
  sendUserMessage: (text: string, chatIdOverride?: string) => ChatMessage | null
  appendAssistantMessage: (text: string) => ChatMessage | null
  startAssistant: () => ChatMessage | null
  updateAssistant: (content: string, messageId?: string) => void
  finalizeAssistant: () => void
}

/**
 * Minimal client-side chat store backed by localStorage.
 * - Loads once on mount
 * - Persists after each state change
 */
export function useChatStore(): ChatStore {
  console.log('useChatStore called')
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const isHydrated = useRef(false)
  const lastAssistantMessageIdRef = useRef<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  // Derive current chat
  const currentChat = useMemo(
    () => {
      const found = chats.find((c) => c.id === currentChatId)
      console.log('Deriving currentChat:', { chats, currentChatId, found })
      return found
    },
    [chats, currentChatId]
  )

  // Load from localStorage once on mount
  const load = useCallback(() => {
    console.log('Loading chats from localStorage...')
    const loaded = loadChatsFromLocalStorage(STORAGE_KEY)
    console.log('Loaded chats:', loaded)
    setChats(Array.isArray(loaded) ? loaded : [])
    if (Array.isArray(loaded) && loaded.length > 0) {
      // Select first chat if no current selection
      const selectedId = loaded[0].id
      console.log('Setting currentChatId to:', selectedId)
      setCurrentChatId(selectedId)
    } else {
      console.log('No chats found, setting currentChatId to null')
      setCurrentChatId(null)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated.current) {
      console.log('Store initialization - calling load()')
      load()
      isHydrated.current = true
    }
  }, [load])

  // Persist whenever chats change
  useEffect(() => {
    saveChatsToLocalStorage(chats, STORAGE_KEY)
  }, [chats])

  const newChat = useCallback((title?: string): Chat => {
    console.log('Creating new chat with title:', title)
    const chat = createEmptyChat({ title, idPrefix: 'chat' })
    console.log('Created chat:', chat)
    setChats((prev) => {
      const updated = [chat, ...prev]
      console.log('Updated chats array:', updated)
      return updated
    })
    console.log('Setting currentChatId to:', chat.id)
    setCurrentChatId(chat.id)
    return chat
  }, [])

  const selectChat = useCallback((chatId: string) => {
    console.log('Selecting chat with ID:', chatId)
    setCurrentChatId(chatId)
  }, [])

  const importChat = useCallback((chat: Chat) => {
    // Ensure minimal fields
    const safe: Chat = {
      id: chat.id || createEmptyChat({}).id,
      title: chat.title?.trim() || 'Imported Chat',
      createdAt: chat.createdAt || new Date().toISOString(),
      messages: Array.isArray(chat.messages) ? chat.messages : [],
    }
    setChats((prev) => [safe, ...prev])
    setCurrentChatId(safe.id)
  }, [])

  const renameChat = useCallback((chatId: string, title: string) => {
    const trimmed = title.trim()
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, title: trimmed || c.title } : c))
    )
  }, [])

  const deleteChat = useCallback((chatId: string) => {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== chatId)
      setCurrentChatId((cur) => {
        if (cur !== chatId) return cur
        return next.length ? next[0].id : null
      })
      return next
    })
  }, [])

  const sendUserMessage = useCallback(
    (text: string, chatIdOverride?: string): ChatMessage | null => {
      const trimmed = (text ?? '').trim()
      const targetId = chatIdOverride ?? currentChatId
      if (!targetId || trimmed.length === 0) return null
      const msg = createChatMessage('user', trimmed, { idPrefix: 'msg' })
      setChats((prev) => appendMessageToChat(prev, targetId, msg).updatedChats)
      return msg
    },
    [currentChatId]
  )

  const appendAssistantMessage = useCallback(
    (text: string): ChatMessage | null => {
      const trimmed = (text ?? '').trim()
      if (!currentChatId || trimmed.length === 0) return null
      const msg = createChatMessage('assistant', trimmed, { idPrefix: 'msg' })
      setChats((prev) => appendMessageToChat(prev, currentChatId, msg).updatedChats)
      return msg
    },
    [currentChatId]
  )

  const startAssistant = useCallback((): ChatMessage | null => {
    if (!currentChatId) return null
    const placeholder = createChatMessage('assistant', '...', { idPrefix: 'msg' })
    lastAssistantMessageIdRef.current = placeholder.id
    setChats((prev) => appendMessageToChat(prev, currentChatId, placeholder).updatedChats)
    setIsStreaming(true)
    return placeholder
  }, [currentChatId])

  const updateAssistant = useCallback(
    (content: string, messageId?: string) => {
      console.log('updateAssistant called with:', { content, messageId, currentChatId })
      if (!currentChatId) {
        console.log('No currentChatId, returning')
        return
      }
      const targetId = messageId ?? lastAssistantMessageIdRef.current
      console.log('Target message ID:', targetId)
      if (!targetId) {
        console.log('No target message ID, returning')
        return
      }
      setChats((prev) => {
        const result = updateMessageInChat(prev, currentChatId, targetId, (m) => ({ ...m, content }))
        console.log('Updated chats:', result.updatedChats)
        return result.updatedChats
      })
    },
    [currentChatId]
  )

  const finalizeAssistant = useCallback(() => {
    lastAssistantMessageIdRef.current = null
    setIsStreaming(false)
  }, [])

  return {
    chats,
    currentChatId,
    currentChat,
    isStreaming,
    load,
    newChat,
    selectChat,
    importChat,
    renameChat,
    deleteChat,
    sendUserMessage,
    appendAssistantMessage,
    startAssistant,
    updateAssistant,
    finalizeAssistant,
  }
}


