'use client'

import React, { useState } from 'react'
import type { ChatStore } from '@/lib/store/useChatStore'
import { streamAssistantReply } from '@/lib/ai/streamAssistantReply'

export default function ChatInput({ store }: { store: ChatStore }) {
  const { sendUserMessage, currentChatId, newChat, currentChat, startAssistant, updateAssistant, finalizeAssistant } = store
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [controller, setController] = useState<AbortController | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    // Determine target chat id (create if needed)
    let targetChatId = currentChatId
    if (!targetChatId) {
      const chat = newChat('New Chat')
      targetChatId = chat.id
    }
    // Append the user message to target chat and keep a reference
    const sent = sendUserMessage(value, targetChatId)
    if (!sent) return
    setValue('')

    // incremental streaming consumption with in-progress assistant message
    ;(async () => {
      try {
        setLoading(true)
        const ctrl = new AbortController()
        setController(ctrl)
        // Build messages array including the one we just sent to avoid state timing issues
        const baseMessages = currentChat && currentChat.id === targetChatId ? currentChat.messages : []
        const messagesForApi = [...baseMessages, sent]
        const res = await streamAssistantReply(messagesForApi, { signal: ctrl.signal })
        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`)
        }
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        // start in-progress assistant message in the store
        const placeholder = startAssistant()
        let accumulated = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          if (placeholder) updateAssistant(accumulated, placeholder.id)
        }
        finalizeAssistant()
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // user cancelled — finalize silently
          finalizeAssistant()
        } else {
          setError('Streaming failed. Please try again.')
          finalizeAssistant()
        }
      } finally {
        setLoading(false)
        setController(null)
      }
    })()
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-neutral-800 flex gap-2 items-start">
      <input
        className="flex-1 rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm outline-none"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Thinking…' : 'Send'}
      </button>
      {loading && (
        <button
          type="button"
          className="rounded-md border border-gray-300 dark:border-neutral-700 px-3 py-2 text-xs"
          onClick={() => controller?.abort()}
        >
          Stop
        </button>
      )}
      <button
        type="button"
        onClick={() => setValue('Summarize this file in 5 bullet points.')}
        className="rounded-md border border-gray-300 dark:border-neutral-700 px-3 py-2 text-xs"
      >
        Summarize
      </button>
      <button
        type="button"
        onClick={() => setValue('Answer a question about the uploaded file: ')}
        className="rounded-md border border-gray-300 dark:border-neutral-700 px-3 py-2 text-xs"
      >
        Ask about file
      </button>
      {error && (
        <div className="text-xs text-red-600 mt-2">{error}</div>
      )}
    </form>

  )
}


