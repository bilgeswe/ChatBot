# Architecture Overview

This document provides a comprehensive overview of AIX Chat's technical architecture, design patterns, and system components.

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (API Routes)   │◄──►│   Services      │
│                 │    │                 │    │   (OpenAI)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   File          │
│   Storage       │    │   Processing    │
│   (localStorage)│    │   (Client-side) │
└─────────────────┘    └─────────────────┘
```

## 🎯 Core Components

### Frontend Architecture

#### Next.js App Router Structure
```
src/app/
├── layout.tsx              # Root layout component
├── page.tsx                # Home page
├── globals.css             # Global styles
└── api/
    └── chat/
        └── route.ts        # Chat API endpoint
```

#### Component Hierarchy
```
ChatApp (Root)
├── Sidebar
│   └── ChatSidebar
├── ChatUI
│   ├── ChatMessages
│   └── ChatInput
└── FileUpload
```

### State Management

#### Store Architecture
```typescript
useChatStore()
├── chats: Chat[]           # Array of all chats
├── currentChatId: string   # Currently active chat
├── currentChat: Chat       # Derived current chat
├── isStreaming: boolean    # Streaming state
└── Actions
    ├── newChat()
    ├── selectChat()
    ├── sendUserMessage()
    ├── updateAssistant()
    └── deleteChat()
```

#### Data Flow
```
User Action → Store Update → Component Re-render → UI Update
     ↓
localStorage Persistence
```

## 🔧 Technical Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.3 | React framework with SSR/SSG |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling framework |
| **Turbopack** | - | Build tool |

### AI Integration

| Library | Purpose |
|---------|---------|
| **@ai-sdk/openai** | OpenAI API integration |
| **ai** | AI SDK for streaming |
| **streamText** | Real-time response streaming |

### File Processing

| Library | Purpose | File Types |
|---------|---------|------------|
| **pdfjs-dist** | PDF text extraction | PDF |
| **mammoth** | Word document processing | DOCX |
| **xlsx** | Excel spreadsheet processing | XLSX, XLS |
| **tesseract.js** | OCR for images | JPG, PNG |

## 📊 Data Models

### Chat Model
```typescript
interface Chat {
  id: string              // Unique identifier
  title: string          // Display name
  createdAt: string      // ISO timestamp
  messages: ChatMessage[] // Array of messages
}
```

### Message Model
```typescript
interface ChatMessage {
  id: string             // Unique identifier
  role: 'user' | 'assistant' // Message sender
  content: string        // Message text
  createdAt: string      // ISO timestamp
}
```

### Store State
```typescript
interface ChatStore {
  chats: Chat[]                    // All chats
  currentChatId: string | null     // Active chat ID
  currentChat: Chat | undefined    // Active chat object
  isStreaming: boolean            // Streaming state
  // ... actions
}
```

## 🔄 Data Flow

### Message Sending Flow
```
1. User types message
2. sendUserMessage() called
3. Message added to store
4. API request to /api/chat
5. OpenAI processes request
6. Stream response back
7. updateAssistant() called
8. UI updates in real-time
```

### File Upload Flow
```
1. User selects file
2. File validation (size, type)
3. Text extraction (PDF.js, Mammoth, etc.)
4. Content added to chat context
5. User can ask questions
```

### Persistence Flow
```
1. Store state changes
2. useEffect triggers
3. saveChatsToLocalStorage()
4. Data saved to browser localStorage
5. Data persists across sessions
```

## 🎨 Component Architecture

### Design Patterns

#### Custom Hooks Pattern
```typescript
// useChatStore.ts
export function useChatStore(): ChatStore {
  // State management logic
  return { chats, currentChat, actions... }
}
```

#### Compound Components
```typescript
// ChatApp.tsx
<ChatApp>
  <Sidebar />
  <ChatUI />
  <FileUpload />
</ChatApp>
```

#### Render Props Pattern
```typescript
// ChatMessages.tsx
<ChatMessages store={store} />
```

### Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| **ChatApp** | Root layout and store provider |
| **ChatUI** | Main chat interface |
| **ChatSidebar** | Chat list and navigation |
| **FileUpload** | File processing and upload |
| **CodeBlock** | Syntax highlighting |

## 🔌 API Architecture

### API Routes

#### Chat Endpoint (`/api/chat`)
```typescript
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ]
}
```

#### Response Format
```typescript
// Streaming response
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked

"Hello! How can I help you today?"
```

### Error Handling

#### API Error Responses
```typescript
// Error response
{
  "error": "messages array is empty or invalid"
}
```

#### Client Error Handling
```typescript
try {
  const response = await fetch('/api/chat', options)
  if (!response.ok) {
    throw new Error('API request failed')
  }
  // Process response
} catch (error) {
  setError(error.message)
}
```

## 💾 Storage Architecture

### localStorage Structure
```typescript
// Storage key: 'aix.chats'
[
  {
    "id": "chat_123",
    "title": "My Chat",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "messages": [...]
  }
]
```

### Persistence Strategy
- **Automatic**: Save on every state change
- **Optimistic**: Update UI immediately
- **Fallback**: Handle storage errors gracefully
- **Migration**: Handle schema changes

## 🚀 Performance Considerations

### Optimization Strategies

#### Code Splitting
```typescript
// Dynamic imports for heavy libraries
const pdfjsLib = await import('pdfjs-dist')
const mammoth = await import('mammoth')
```

#### Streaming Responses
```typescript
// Real-time streaming
const reader = response.body.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  // Update UI with chunk
}
```

#### Memory Management
- **File cleanup**: Revoke object URLs
- **Message limits**: Prevent memory bloat
- **Garbage collection**: Remove unused references

### Bundle Optimization
- **Tree shaking**: Remove unused code
- **Dynamic imports**: Load libraries on demand
- **Compression**: Gzip/Brotli compression
- **Caching**: Browser and CDN caching

## 🔒 Security Considerations

### Client-Side Security
- **Input validation**: Sanitize user inputs
- **File validation**: Check file types and sizes
- **XSS prevention**: Escape user content
- **CSRF protection**: Use secure headers

### API Security
- **Rate limiting**: Prevent abuse
- **Input sanitization**: Validate all inputs
- **Error handling**: Don't expose internals
- **Authentication**: Secure API keys

## 🧪 Testing Architecture

### Testing Strategy
```typescript
// Unit tests
describe('useChatStore', () => {
  it('should create new chat', () => {
    // Test implementation
  })
})

// Integration tests
describe('Chat API', () => {
  it('should handle message streaming', () => {
    // Test implementation
  })
})
```

### Test Structure
```
src/
├── __tests__/           # Test files
├── components/          # Component tests
├── lib/                # Utility tests
└── app/                # API tests
```

## 📈 Scalability Considerations

### Current Limitations
- **localStorage size**: ~5-10MB limit
- **File processing**: Client-side only
- **Memory usage**: Grows with chat history
- **API rate limits**: OpenAI usage limits

### Future Improvements
- **Database integration**: Server-side storage
- **File processing**: Server-side processing
- **Caching**: Redis for performance
- **CDN**: Static asset delivery

## 🔄 Deployment Architecture

### Production Setup
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Vercel        │    │   OpenAI        │
│   (Static)      │◄──►│   (Serverless)  │◄──►│   (API)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment Configuration
```typescript
// Production
OPENAI_API_KEY=prod_key
NEXT_PUBLIC_APP_NAME=AIX Chat

// Development
OPENAI_API_KEY=dev_key
NEXT_PUBLIC_APP_NAME=AIX Chat (Dev)
```

---

*This architecture provides a solid foundation for AIX Chat's current features and future growth.*
