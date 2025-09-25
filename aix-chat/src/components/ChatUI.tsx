'use client'

import { useCallback, useRef, useState } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function ChatUI() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async () => {
    const prompt = input.trim()
    if (!prompt || loading) return

    setLoading(true)
    setError(null)
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    // add user message and assistant placeholder
    const userMsg: Msg = { role: 'user', content: prompt }
    const assistantPlaceholder: Msg = { role: 'assistant', content: '' }
    setMessages((prev) => [...prev, userMsg, assistantPlaceholder])
    setInput('')

    // backend expects messages: {role, content}[]
    const payload = {
      messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
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
          message = (data as any)?.error || message
        } catch {}
        throw new Error(message)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      // stream chunks to the last assistant message
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          if (!chunk) continue
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last && last.role === 'assistant') {
              next[next.length - 1] = { ...last, content: last.content + chunk }
            }
            return next
          })
        }
      } else {
        // fallback non-streaming
        const text = await res.text()
        setMessages((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last && last.role === 'assistant') {
            next[next.length - 1] = { ...last, content: text }
          }
          return next
        })
      }
    } catch (e: any) {
      setError(e?.message || 'Unknown error')
      // remove empty assistant placeholder if nothing streamed
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === 'assistant' && last.content.length === 0) next.pop()
        return next
      })
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              'p-3 rounded-xl whitespace-pre-wrap break-words ' +
              (m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left')
            }
          >
            {m.content || (m.role === 'assistant' && loading ? 'Loading...' : '')}
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
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </div>
    </div>
  )
}


