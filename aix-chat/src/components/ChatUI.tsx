'use client'

import { useCallback, useRef, useState } from 'react'
import { useChatStore } from '@/lib/store/useChatStore'

export default function ChatUI() {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const { currentChat, sendUserMessage, startAssistant, updateAssistant, finalizeAssistant, isStreaming, newChat, currentChatId } = useChatStore()

  const sendMessage = useCallback(async () => {
    const prompt = input.trim()
    if (!prompt || isStreaming) return

    setError(null)
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    // Ensure we have a current chat, create one if needed
    let targetChatId = currentChatId
    if (!targetChatId) {
      const newChatObj = newChat('New Chat')
      targetChatId = newChatObj.id
    }

    // Add user message to store and get the message object
    const userMessage = sendUserMessage(prompt, targetChatId)
    
    // Check if user message was created successfully
    if (!userMessage) {
      setError('Failed to create user message - no current chat')
      return
    }
    
    setInput('')

    // Start assistant message
    startAssistant()

    // Get all messages including the one we just added
    const allMessages = currentChat?.messages || []
    const messagesForApi = userMessage ? [...allMessages, userMessage] : allMessages
    
    // Ensure we have at least one message
    if (messagesForApi.length === 0) {
      setError('No messages to send')
      return
    }
    
    // Create the payload with all messages
    const payload = {
      messages: messagesForApi.map((m) => ({ role: m.role, content: m.content })),
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        let message = 'Failed to fetch response'
        try {
          const data = await res.json()
          message = (data as { error?: string })?.error || message
        } catch {}
        throw new Error(message)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      // stream chunks to the assistant message
      if (reader) {
        let accumulatedContent = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          if (!chunk) continue
          accumulatedContent += chunk
          console.log('Streaming chunk:', chunk)
          console.log('Accumulated content:', accumulatedContent)
          updateAssistant(accumulatedContent)
        }
      } else {
        // fallback non-streaming
        const text = await res.text()
        console.log('Non-streaming response:', text)
        updateAssistant(text)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      // Remove empty assistant message if error occurred
      finalizeAssistant()
    } finally {
      finalizeAssistant()
    }
  }, [input, isStreaming, currentChat, sendUserMessage, startAssistant, updateAssistant, finalizeAssistant, newChat, currentChatId])

  const messages = currentChat?.messages || []
  
  // Debug logging
  console.log('ChatUI render - currentChat:', currentChat)
  console.log('ChatUI render - messages:', messages)

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div
            key={m.id || i}
            className={
              'p-3 rounded-xl whitespace-pre-wrap break-words ' +
              (m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left')
            }
          >
            {m.content || (m.role === 'assistant' && isStreaming ? 'Loading...' : '')}
          </div>
        ))}
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="flex space-x-2">
        <input
          className="flex-1 border rounded-xl p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          disabled={isStreaming || !input.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl disabled:opacity-50"
        >
          {isStreaming ? 'Loading...' : 'Send'}
        </button>
      </div>
    </div>
  )
}


