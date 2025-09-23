import type { ChatMessage } from '@/lib/chat/message'

export type StreamOptions = {
  endpoint?: string
  signal?: AbortSignal
}

/**
 * Post chat messages to the server and return the streaming Response.
 * Consumers should read the body via ReadableStream to incrementally render tokens.
 */
export async function streamAssistantReply(
  messages: ChatMessage[],
  options: StreamOptions = {}
): Promise<Response> {
  const endpoint = options.endpoint ?? '/api/chat'
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal: options.signal,
  })
}


