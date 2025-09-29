# AIX Chat - Advanced AI Chat Application

A modern, full-featured AI chat application built with Next.js, React, and TypeScript. Features file upload support, chat history persistence, and real-time streaming responses.

## 🚀 Features

### Core Chat Functionality
- **Real-time AI Conversations**: Stream responses from OpenAI's GPT models
- **Chat History**: Persistent storage using localStorage
- **Multiple Chat Sessions**: Create, switch between, and manage multiple conversations
- **Message Management**: Rename, delete, import, and export chat sessions

### File Handling
- **Multi-format Support**: Upload and process PDF, DOCX, XLSX, and image files
- **Text Extraction**: Automatic content extraction from uploaded files
- **File Summarization**: AI-powered file summarization with dedicated controls
- **Context Integration**: File content seamlessly integrated into conversations

### User Interface
- **Modern Design**: Clean, responsive interface with dark/light mode support
- **Sidebar Navigation**: Easy chat session management
- **File Upload Interface**: Drag-and-drop file upload with progress indicators
- **Export Options**: JSON and Markdown export capabilities

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API with streaming support
- **File Processing**: PDF.js, Mammoth, XLSX, Tesseract.js
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Turbopack

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aix-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini  # Optional: specify model
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Starting a Conversation
1. Click "New Chat" to create a fresh conversation
2. Type your message in the input field
3. Press Enter or click "Send" to send your message
4. Watch the AI response stream in real-time

### File Upload
1. Click "Upload File" to select a file (PDF, DOCX, XLSX, JPG, PNG)
2. Wait for file processing to complete
3. Ask questions about the file content
4. Use "Summarize" button for AI-generated file summaries

### Managing Chats
- **Create New Chat**: Click "New Chat" button
- **Switch Between Chats**: Click on any chat in the sidebar
- **Rename Chat**: Click "Rename" in the chat header
- **Delete Chat**: Click "Delete" in the chat header
- **Export Chat**: Use "Export JSON" or "Export MD" buttons

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm test

# Run tests with UI
npm run test:ui
```

### Project Structure

```
src/
├── app/
│   ├── api/chat/          # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ChatApp.tsx        # Main app component
│   ├── ChatUI.tsx         # Chat interface
│   ├── ChatSidebar.tsx    # Sidebar navigation
│   ├── FileUpload.tsx     # File upload component
│   └── CodeBlock.tsx      # Code syntax highlighting
├── lib/
│   ├── ai/                # AI integration
│   ├── chat/              # Chat data models
│   ├── files/             # File processing
│   └── store/             # State management
└── components/            # Reusable components
```

## 🔒 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes | - |
| `OPENAI_MODEL` | OpenAI model to use | No | `gpt-4o-mini` |

## 📁 File Support

### Supported Formats
- **PDF**: Text extraction using PDF.js
- **DOCX**: Microsoft Word documents via Mammoth
- **XLSX/XLS**: Excel spreadsheets via XLSX library
- **Images**: JPG, PNG with OCR via Tesseract.js

### File Limits
- Maximum file size: 10MB
- Text extraction limit: 8000 characters per file

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🔮 Roadmap

- [ ] Database integration for chat persistence
- [ ] User authentication and multi-user support
- [ ] Advanced file processing (more formats)
- [ ] Chat sharing and collaboration features
- [ ] Mobile app development
- [ ] Plugin system for custom integrations

---

**Built with ❤️ using Next.js and OpenAI**