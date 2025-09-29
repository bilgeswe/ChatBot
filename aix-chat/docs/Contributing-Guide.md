# Contributing Guide

Thank you for your interest in contributing to AIX Chat! This guide will help you get started with contributing to the project.

## 🤝 How to Contribute

### Types of Contributions

- **Bug Reports**: Report issues and bugs
- **Feature Requests**: Suggest new features
- **Code Contributions**: Submit pull requests
- **Documentation**: Improve docs and guides
- **Testing**: Add tests and improve coverage

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/aix-chat.git
cd aix-chat

# Add upstream remote
git remote add upstream https://github.com/original-owner/aix-chat.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/your-bug-fix
```

### 4. Make Your Changes

- Write your code
- Add tests if applicable
- Update documentation
- Follow the coding standards

### 5. Test Your Changes

```bash
# Run tests
npm test

# Run linting
npm run lint

# Build the project
npm run build
```

### 6. Commit Your Changes

```bash
# Add your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new file upload feature"

# Push to your fork
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Fill out the PR template
4. Submit the pull request

## 📝 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Explicit types
interface User {
  id: string
  name: string
  email: string
}

// ✅ Good: Proper error handling
try {
  const result = await processFile(file)
  return result
} catch (error) {
  console.error('File processing failed:', error)
  throw new Error('Failed to process file')
}

// ❌ Bad: Using any
const data: any = await fetchData()

// ❌ Bad: No error handling
const result = await processFile(file)
return result
```

### React Component Guidelines

```typescript
// ✅ Good: Functional components with proper typing
interface ChatMessageProps {
  message: ChatMessage
  isStreaming?: boolean
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  return (
    <div className="message">
      {message.content}
    </div>
  )
}

// ❌ Bad: No prop types
export function ChatMessage(props) {
  return <div>{props.message.content}</div>
}
```

### File Organization

```
src/
├── components/          # React components
│   ├── ChatApp.tsx     # Main app component
│   ├── ChatUI.tsx      # Chat interface
│   └── FileUpload.tsx  # File upload component
├── lib/                # Utility functions
│   ├── chat/           # Chat-related utilities
│   ├── files/          # File processing
│   └── store/          # State management
└── app/                # Next.js app directory
    ├── api/            # API routes
    └── globals.css     # Global styles
```

## 🧪 Testing Guidelines

### Writing Tests

```typescript
// Component tests
import { render, screen } from '@testing-library/react'
import { ChatMessage } from '../ChatMessage'

describe('ChatMessage', () => {
  it('renders message content', () => {
    const message = {
      id: '1',
      role: 'user',
      content: 'Hello world',
      createdAt: '2024-01-01T00:00:00.000Z'
    }
    
    render(<ChatMessage message={message} />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })
})
```

### Test Coverage

- **Components**: Test rendering and user interactions
- **Hooks**: Test state management and side effects
- **Utilities**: Test pure functions and data transformations
- **API Routes**: Test request/response handling

## 📚 Documentation Standards

### Code Documentation

```typescript
/**
 * Extracts text content from a PDF file
 * @param file - The PDF file to process
 * @param onProgress - Optional progress callback
 * @returns Promise that resolves to extracted text
 * @throws Error if file processing fails
 */
export async function extractPdf(
  file: File, 
  onProgress?: (progress: number) => void
): Promise<string> {
  // Implementation
}
```

### README Updates

When adding new features:
1. Update the main README.md
2. Add feature to the features list
3. Update installation instructions if needed
4. Add usage examples

### Wiki Documentation

For significant features:
1. Create or update wiki pages
2. Add screenshots if applicable
3. Include step-by-step guides
4. Update the documentation index

## 🐛 Bug Reports

### Before Reporting

1. **Check existing issues** - Search for similar problems
2. **Test latest version** - Ensure you're on the latest code
3. **Reproduce the issue** - Create minimal reproduction steps
4. **Check browser console** - Look for error messages

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Additional Context
Any other context about the problem
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Brief description of the feature

## Use Case
Why would this feature be useful?

## Proposed Solution
How do you think this should work?

## Alternatives
Any alternative solutions you've considered?

## Additional Context
Any other context or screenshots
```

## 🔄 Pull Request Process

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Commit messages are descriptive

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Additional Notes
Any additional information about the changes
```

## 🏷️ Commit Message Convention

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```
feat(chat): add file upload functionality
fix(api): resolve streaming response issue
docs(readme): update installation instructions
test(components): add ChatMessage component tests
```

## 🎯 Development Workflow

### 1. Planning
- Check existing issues and discussions
- Create an issue for significant features
- Discuss approach with maintainers

### 2. Development
- Create feature branch
- Write code following standards
- Add tests for new functionality
- Update documentation

### 3. Testing
- Run all tests locally
- Test in different browsers
- Test with different file types
- Verify no regressions

### 4. Review
- Self-review your changes
- Request review from maintainers
- Address feedback promptly
- Keep PR up to date

### 5. Merge
- Squash commits if needed
- Delete feature branch
- Update documentation
- Celebrate! 🎉

## 🛠️ Development Setup

### Required Tools
- Node.js 18+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### VS Code Extensions
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens

### Environment Variables
```bash
# .env.local
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

## 🆘 Getting Help

### Community Resources
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Wiki**: Comprehensive documentation
- **Code Review**: Learn from PR feedback

### Contact Maintainers
- **GitHub**: @maintainer-username
- **Email**: maintainer@example.com
- **Discord**: [Community Server]

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or inflammatory comments
- Personal attacks
- Public or private harassment

## 🎉 Recognition

### Contributors
We recognize all contributors in our:
- README.md contributors section
- Release notes
- Community highlights

### Types of Contributions
- **Code**: Bug fixes, features, improvements
- **Documentation**: Guides, tutorials, examples
- **Testing**: Test cases, bug reports
- **Community**: Help, support, feedback

---

*Thank you for contributing to AIX Chat! Together we can build something amazing.*
