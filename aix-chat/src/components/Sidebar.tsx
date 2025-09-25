'use client'

import React from 'react'
import ChatSidebar from '@/components/ChatSidebar'
import type { ChatStore } from '@/lib/store/useChatStore'

export default function Sidebar({ store }: { store: ChatStore }) {
  return (
    <aside className="w-[250px] shrink-0 bg-gray-100 dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 h-full">
      <ChatSidebar store={store} />
    </aside>
  )
}


