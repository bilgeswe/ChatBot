# Installation Guide

This guide will walk you through setting up AIX Chat on your local development machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (comes with Node.js)
- **Git**: For cloning the repository
- **OpenAI API Key**: Required for AI functionality

### Checking Your Environment

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/aix-chat.git

# Navigate to the project directory
cd aix-chat
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# Alternative: using yarn
yarn install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Create environment file
touch .env.local
```

Add the following content to `.env.local`:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Optional: Custom configuration
NEXT_PUBLIC_APP_NAME=AIX Chat
```

### Step 4: Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env.local` file

### Step 5: Start Development Server

```bash
# Start the development server
npm run dev

# Alternative: using yarn
yarn dev
```

### Step 6: Verify Installation

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the AIX Chat interface
3. Try creating a new chat to verify everything is working

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

#### Node Version Issues
```bash
# Update Node.js using nvm
nvm install 18
nvm use 18
```

#### Dependency Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### OpenAI API Issues
- Verify your API key is correct
- Check your OpenAI account has sufficient credits
- Ensure the API key has the necessary permissions

### Environment Variables Not Loading

If environment variables aren't loading:

1. Ensure `.env.local` is in the root directory
2. Restart the development server
3. Check for typos in variable names
4. Ensure no spaces around the `=` sign

## 📁 Project Structure

After installation, your project should look like this:

```
aix-chat/
├── .env.local              # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── src/
│   ├── app/                # Next.js app directory
│   ├── components/         # React components
│   └── lib/               # Utility libraries
└── docs/                  # Documentation
```

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned successfully
- [ ] Dependencies installed without errors
- [ ] `.env.local` file created with OpenAI API key
- [ ] Development server starts without errors
- [ ] Application loads in browser
- [ ] Can create a new chat
- [ ] AI responses are working

## 🆘 Getting Help

If you encounter issues during installation:

1. Check the [Troubleshooting](Troubleshooting) page
2. Search [GitHub Issues](https://github.com/your-repo/issues)
3. Create a new issue with:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps you've already tried

## 🔄 Next Steps

Once installation is complete:

1. Read the [Quick Start](Quick-Start) guide
2. Explore the [Basic Usage](Basic-Usage) documentation
3. Check out the [File Upload Guide](File-Upload-Guide)
4. Learn about [Chat Management](Chat-Management)

---

*Installation complete! You're ready to start using AIX Chat.*
