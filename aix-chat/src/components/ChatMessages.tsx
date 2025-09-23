'use client'

import React from 'react'
import type { ChatStore } from '@/lib/store/useChatStore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import CodeBlock from '@/components/CodeBlock'

export default function ChatMessages({ store }: { store: ChatStore }) {
  const { currentChat, isStreaming } = store

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {!currentChat || currentChat.messages.length === 0 ? (
        <div className="text-sm text-gray-500">No messages yet. Say hello!</div>
      ) : (
        currentChat.messages.map((m) => (
          <div key={m.id} className="text-sm leading-6">
            <div className="mb-1 text-[11px] uppercase tracking-wide text-neutral-500">
              {m.role}
            </div>
            <div
              className={
                'rounded-lg px-4 py-3 ' +
                (m.role === 'assistant'
                  ? 'bg-gray-100 dark:bg-neutral-800'
                  : 'bg-white border border-gray-200 dark:bg-neutral-900 dark:border-neutral-800')
              }
            >
              {m.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code: (props) => <CodeBlock {...props} />,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
              <div className="whitespace-pre-wrap relative">
                <button
                  type="button"
                  className="absolute right-2 top-2 text-[11px] rounded border px-1 py-0.5 opacity-0 hover:opacity-100"
                  onClick={async () => {
                    try { await navigator.clipboard.writeText(m.content) } catch {}
                  }}
                >
                  Copy
                </button>
                {m.content}
              </div>
              )}
            </div>
          </div>
        ))
      )}
      {isStreaming && (
        <div className="text-xs text-neutral-500">Assistant is typing…</div>
      )}
    </div>
  )
}


