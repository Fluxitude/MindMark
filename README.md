# MindMark
## AI-Enhanced Bookmark Manager for Cognitive Accessibility

MindMark is a modern, AI-powered bookmark manager designed specifically for users with memory issues, brain fog, and executive dysfunction. It automatically summarizes and organizes any saved URL with memory-friendly features and cognitive accessibility at its core.

## 🎯 Key Features

- **Instant AI Processing**: Real-time AI summarization and categorization
- **Cognitive-First UI**: OKLCH colors, zero border radius, high contrast design
- **Smart Organization**: AI-powered collections and tagging
- **Browser Extension**: Cross-browser support with WXT framework
- **Real-time Sync**: Live updates across all devices
- **Semantic Search**: Natural language queries with AI embeddings
- **Accessibility**: WCAG 2.1 AAA compliance with cognitive accessibility features

## 🏗️ Architecture

This is a modern monorepo built with:

- **Framework**: Next.js 15.1+ with App Router and Server Components
- **Language**: TypeScript 5.6+ with strict mode
- **UI**: shadcn/ui with OKLCH color system and zero border radius
- **Database**: Supabase with PostgreSQL, Auth, and Real-time
- **AI**: Vercel AI SDK v4.0+ with multi-model support
- **Content**: Firecrawl for web scraping and content extraction
- **Automation**: Mastra AI for workflow orchestration
- **Browser**: Stagehand for browser automation
- **Extension**: WXT framework for cross-browser extensions
- **Styling**: Tailwind CSS with cognitive accessibility tokens
- **Code Quality**: Ultracite (Biome-based) for linting and formatting
- **Package Manager**: Bun for fast installs and development

## 📁 Project Structure

```
MindMark/
├── apps/
│   ├── web/          # Marketing website
│   ├── app/          # Main application
│   ├── extension/    # Browser extension
│   └── api/          # Supabase configuration
├── packages/
│   ├── ui/           # OKLCH design system & components
│   ├── supabase/     # Database operations & types
│   ├── ai/           # AI processing services
│   ├── content/      # Content extraction & analysis
│   ├── workflows/    # AI workflow orchestration
│   ├── search/       # Semantic search & embeddings
│   ├── extension/    # Extension utilities
│   └── logger/       # Logging utilities
└── tooling/
    └── typescript/   # Shared TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Bun 1.1+
- Supabase account
- OpenAI API key
- Anthropic API key (optional)
- Firecrawl API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MindMark
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

4. Set up the database:
```bash
cd packages/supabase
bun run db:migrate
```

5. Start development:
```bash
bun dev
```

This will start:
- Main app at http://localhost:3000
- Marketing site at http://localhost:3001
- Extension development server

## 🧠 Cognitive Accessibility Features

MindMark is designed with cognitive accessibility as a core principle:

- **High Contrast**: 15.8:1 contrast ratios for maximum readability
- **Zero Border Radius**: Sharp edges for clear visual boundaries
- **Consistent Patterns**: Predictable navigation and interaction patterns
- **Memory Aids**: Visual cues, consistent iconography, and clear status indicators
- **Reduced Cognitive Load**: Minimal interface complexity with progressive disclosure
- **Customizable**: Adjustable font sizes, spacing, and motion preferences

## 🤖 AI Features

- **Multi-Model Support**: OpenAI GPT-4o, GPT-4o-mini, Anthropic Claude 3.5 Sonnet
- **Real-time Processing**: Streaming AI responses with live progress indicators
- **Content Summarization**: Cognitive-friendly summaries in multiple styles
- **Auto-Categorization**: Intelligent bookmark organization
- **Semantic Search**: Natural language queries with vector embeddings
- **Smart Recommendations**: Personalized content discovery

## 📱 Browser Extension

Cross-browser extension built with WXT framework:

- **One-Click Saving**: Instant bookmark saving with AI processing
- **Context Menu**: Save any link or page
- **Keyboard Shortcuts**: Power user features
- **Real-time Sync**: Instant sync with web app
- **Offline Support**: Works offline with sync on reconnect

## 🔧 Development

### Available Scripts

```bash
# Development
bun dev                    # Start all apps in development
bun dev:app               # Start main app only
bun dev:web               # Start marketing site only
bun dev:extension         # Start extension development

# Building
bun build                 # Build all apps
bun typecheck            # Type check all packages
bun lint                 # Lint all code
bun format               # Format all code

# Testing
bun test                 # Run all tests
```

### Package Development

Each package can be developed independently:

```bash
cd packages/ai
bun dev                  # Start AI service development

cd packages/ui
bun dev                  # Start UI component development
```

## 📚 Documentation

- [Product Requirements Document](./docs/PRD-v3-Modern.md)
- [Design System](./docs/Design-System.md)
- [Implementation Tasks](./docs/TASKS.md)

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and AI services
- Inspired by cognitive accessibility research and user feedback
- Leverages proven architectural patterns from v1 implementation
