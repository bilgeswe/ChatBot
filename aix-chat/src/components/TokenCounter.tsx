'use client'

import React, { useMemo } from 'react'
import { useChatStore } from '@/lib/store/useChatStore'

export default function TokenCounter() {
  const { currentChat } = useChatStore()

  const approxTokens = useMemo(() => {
    if (!currentChat) return 0
    const chars = currentChat.messages.reduce((sum, m) => sum + (m.content?.length || 0), 0)
    return Math.ceil(chars / 4)
  }, [currentChat])

  return <span className="tabular-nums">tokens: ~{approxTokens}</span>
}


