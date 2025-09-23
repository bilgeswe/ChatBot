'use client'

import React from 'react'
import ChatSidebar from '@/components/ChatSidebar'
import ChatMessages from '@/components/ChatMessages'
import ChatInput from '@/components/ChatInput'
import { useChatStore } from '@/lib/store/useChatStore'
import FileUpload from '@/components/FileUpload'
import { chatToJson, chatToMarkdown, downloadText, importChatFromFile } from '@/lib/export/format'

export default function ChatApp() {
  const store = useChatStore()
  const { currentChat, newChat, importChat, renameChat, deleteChat } = store
  return (
    <div className="h-[calc(100vh-96px)] grid grid-cols-1 md:grid-cols-[256px_1fr]">
      <ChatSidebar store={store} />
      <div className="flex flex-col min-h-0">
        <div className="h-12 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between px-4 text-sm gap-3">
          <div className="truncate" title={currentChat?.title || 'New Chat'}>
            {currentChat?.title || 'New Chat'}
          </div>
          <div className="flex items-center gap-3">
            <FileUpload />
            {currentChat && (
              <>
                <a
                  href="#"
                  className="text-xs text-neutral-600 dark:text-neutral-300 hover:underline"
                  onClick={(e) => {
                    e.preventDefault()
                    const next = prompt('Rename chat', currentChat.title)
                    if (typeof next === 'string') renameChat(currentChat.id, next)
                  }}
                >
                  Rename
                </a>
                <a
                  href="#"
                  className="text-xs text-red-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault()
                    if (confirm('Delete this chat?')) deleteChat(currentChat.id)
                  }}
                >
                  Delete
                </a>
              </>
            )}
            <label className="text-xs cursor-pointer">
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  try {
                    const chat = await importChatFromFile(file)
                    importChat(chat)
                  } finally {
                    e.currentTarget.value = ''
                  }
                }}
              />
              Import JSON
            </label>
            <a
              href="#"
              className="text-xs text-neutral-600 dark:text-neutral-300 hover:underline"
              onClick={(e) => {
                e.preventDefault()
                if (!currentChat) return
                downloadText(`${currentChat.title || 'chat'}.json`, chatToJson(currentChat))
              }}
            >
              Export JSON
            </a>
            <a
              href="#"
              className="text-xs text-neutral-600 dark:text-neutral-300 hover:underline"
              onClick={(e) => {
                e.preventDefault()
                if (!currentChat) return
                downloadText(`${currentChat.title || 'chat'}.md`, chatToMarkdown(currentChat))
              }}
            >
              Export MD
            </a>
            <a
              href="#"
              className="text-blue-600 hover:underline whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault()
                newChat('New Chat')
              }}
            >
              New Chat
            </a>
          </div>
        </div>
        <ChatMessages store={store} />
        <ChatInput store={store} />
      </div>
    </div>
  )
}


