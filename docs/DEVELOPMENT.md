# MindMark Development Guide

## Overview

MindMark is an AI-enhanced bookmark manager designed for cognitive accessibility. This guide covers the development workflow, testing, and contribution guidelines.

## Prerequisites

- **Bun**: v1.1.0 or higher
- **Node.js**: v18.0.0 or higher
- **Git**: Latest version

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd MindMark

# Install dependencies
bun install

# Start development servers
bun run dev

# Run specific app
bun run dev:web      # Web application
bun run dev:app      # Desktop application
bun run dev:extension # Browser extension
```

## Project Structure

```
MindMark/
├── apps/
│   ├── web/           # Next.js web application
│   ├── app/           # Desktop application
│   └── extension/     # Browser extension (WXT)
├── packages/
│   ├── ui/            # Shared UI components
│   ├── supabase/      # Database operations
│   ├── ai/            # AI processing
│   ├── content/       # Content extraction
│   ├── workflows/     # AI workflows
│   ├── search/        # Search functionality
│   ├── extension-utils/ # Extension utilities
│   └── logger/        # Logging utilities
├── tooling/           # Development tools
└── test/              # Global test setup
```

## Development Workflow

### Available Scripts

```bash
# Development
bun run dev                    # Start all development servers
bun run dev:web               # Start web app only
bun run dev:app               # Start desktop app only
bun run dev:extension         # Start extension development

# Building
bun run build                 # Build all packages and apps
bun run clean                 # Clean all build artifacts
bun run clean:workspaces      # Clean workspace dependencies

# Testing
bun run test                  # Run all tests
bun run test:watch            # Run tests in watch mode

# Code Quality
bun run lint                  # Run linting
bun run format                # Format code with Biome
bun run typecheck             # Type checking

# Package-specific development
bun run ai:dev                # AI package development
bun run content:dev           # Content package development
bun run workflows:dev         # Workflows package development
```

## Testing

MindMark uses Bun's built-in test runner for fast, reliable testing.

### Running Tests

```bash
# Run all tests
bun run test

# Run tests for specific package
cd packages/supabase
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test src/schemas/index.test.ts
```

### Writing Tests

Tests should be placed alongside source files with `.test.ts` or `.spec.ts` extensions:

```typescript
// example.test.ts
import { describe, it, expect } from "bun:test";
import { myFunction } from "./example";

describe("MyFunction", () => {
  it("should work correctly", () => {
    const result = myFunction("input");
    expect(result).toBe("expected");
  });
});
```

### Test Utilities

Global test utilities are available in `/test/setup.ts`:

```typescript
import { createMockUser, createMockBookmark } from "../test/setup";

const mockUser = createMockUser();
const mockBookmark = createMockBookmark();
```

## Code Quality

### Linting and Formatting

MindMark uses Biome for linting and formatting:

```bash
# Check code quality
bun run lint

# Fix auto-fixable issues
bun run lint:repo:fix

# Format code
bun run format
```

### Configuration

- **Biome**: `biome.json` - Linting and formatting rules
- **TypeScript**: `tsconfig.json` - Type checking configuration
- **Bun**: `bunfig.toml` - Runtime and test configuration

## Database Development

### Supabase Setup

```bash
# Navigate to supabase package
cd packages/supabase

# Generate types from database
bun run db:generate-types

# Reset database (development only)
bun run db:reset

# Apply migrations
bun run db:migrate

# Seed database
bun run db:seed
```

### Database Migrations

Migration files are located in `packages/supabase/supabase/migrations/`:

- `20241223000001_create_enhanced_users.sql` - User profiles with cognitive preferences
- `20241223000002_create_bookmarks.sql` - Bookmark storage with AI metadata
- `20241223000003_create_collections.sql` - Smart collections with automation
- `20241223000004_create_tags.sql` - Tagging system with confidence scoring
- `20241223000005_create_ai_processing_queue.sql` - AI task queue
- `20241223000006_create_user_activity.sql` - Activity tracking
- `20241223000007_setup_realtime_and_functions.sql` - Real-time and utilities

## Browser Extension Development

The browser extension uses WXT framework for cross-browser compatibility:

```bash
# Start extension development
bun run dev:extension

# Build extension
cd apps/extension
bun run build

# Output will be in .output/chrome-mv3/
```

### Extension Structure

- `entrypoints/background.ts` - Service worker
- `entrypoints/content.ts` - Content script
- `entrypoints/popup.html` - Extension popup
- `wxt.config.ts` - WXT configuration

## Environment Variables

Create `.env.local` files in each app directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
FIRECRAWL_API_KEY=your_firecrawl_key

# Browser Automation
BROWSERBASE_API_KEY=your_browserbase_key
BROWSERBASE_PROJECT_ID=your_project_id

# AI Orchestration
MASTRA_API_KEY=your_mastra_key
VERCEL_AI_SDK_KEY=your_vercel_key
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Run `bun run clean` and `bun install`
2. **Type Errors**: Run `bun run typecheck` to identify issues
3. **Test Failures**: Check test setup in `/test/setup.ts`
4. **Extension Issues**: Ensure WXT dependencies are installed

### Getting Help

1. Check existing issues in the repository
2. Review this development guide
3. Check package-specific README files
4. Run `bun run lint` to catch common issues

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `bun run test`
5. Run linting: `bun run lint`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Standards

- Use TypeScript for all new code
- Follow the existing code style (enforced by Biome)
- Write tests for new functionality
- Update documentation as needed
- Ensure accessibility compliance (WCAG 2.1 AAA)

## Performance

- Build times: ~30 seconds for full build
- Test execution: <1 second for unit tests
- Development server startup: <5 seconds
- Hot reload: <1 second for most changes

## Architecture Decisions

- **Monorepo**: Turborepo for efficient builds and caching
- **Runtime**: Bun for fast package management and testing
- **Database**: Supabase for real-time features and RLS
- **AI**: Multiple providers with fallback system
- **Extension**: WXT for cross-browser compatibility
- **Testing**: Bun's built-in test runner for speed
- **Code Quality**: Biome for consistent formatting and linting
