'use client'

import React from 'react'
import type { ChatStore } from '@/lib/store/useChatStore'

export default function ChatSidebar({ store }: { store: ChatStore }) {
  const { chats, currentChatId, newChat, selectChat } = store

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
        <button
          type="button"
          className="w-full rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-2 text-sm font-medium hover:opacity-90"
          onClick={() => newChat('New Chat')}
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-3 text-sm text-gray-500">No chats yet. Create your first chat.</div>
        ) : (
          <ul className="py-2">
            {chats.map((chat) => {
              const isActive = chat.id === currentChatId
              return (
                <li key={chat.id}>
                  <button
                    type="button"
                    onClick={() => selectChat(chat.id)}
                    className={
                      'w-full text-left px-3 py-2 text-sm transition-colors truncate ' +
                      (isActive
                        ? 'bg-gray-100 dark:bg-neutral-800 font-semibold'
                        : 'hover:bg-gray-50 dark:hover:bg-neutral-800/60')
                    }
                    title={chat.title}
                  >
                    {chat.title || 'Untitled chat'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}


