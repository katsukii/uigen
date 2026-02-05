# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface, Claude generates them via tool calls, and the results render in a sandboxed iframe preview. All generated files live in a virtual in-memory file system (never written to disk).

## Commands

```bash
npm run setup          # First-time setup: install deps, generate Prisma client, run migrations
npm run dev            # Start dev server (Next.js + Turbopack) on localhost:3000
npm run build          # Production build
npm run lint           # ESLint
npm run test           # Run all tests (Vitest)
npx vitest run src/path/to/file.test.tsx  # Run a single test file
npm run db:reset       # Force reset SQLite database
npx prisma generate    # Regenerate Prisma client after schema changes
npx prisma migrate dev # Run database migrations
```

## Architecture

### AI Chat Flow

1. User sends a message via `ChatInterface` component
2. Request hits `POST /api/chat` (`src/app/api/chat/route.ts`)
3. Backend reconstructs `VirtualFileSystem` from serialized state, prepends system prompt, calls Claude via Vercel AI SDK's `streamText()`
4. Claude uses two tools to manipulate files: `str_replace_editor` (view/create/edit files) and `file_manager` (rename/delete)
5. Tool results stream back to client; `FileSystemContext` applies tool calls to local file system state
6. On completion, project is auto-saved to database (messages + file system serialized as JSON)

### Virtual File System

`src/lib/file-system.ts` — Central abstraction. An in-memory tree of `FileNode` objects with create/update/delete/rename operations. Serialized to JSON for database persistence and sent to the API on each request. The AI's system prompt instructs it to treat `/` as root and create `/App.jsx` as the entry point.

### Preview Rendering

`src/components/preview/PreviewFrame.tsx` — Builds a self-contained HTML document with an import map, injects all virtual files as blob URLs, transpiles JSX via Babel standalone, and renders inside a sandboxed iframe. Entry point resolution: `App.jsx` > `App.tsx` > `index.jsx` > first `.jsx`/`.tsx` file.

### State Management

Two React contexts drive the app:
- **ChatContext** (`src/lib/contexts/chat-context.tsx`) — Wraps Vercel AI SDK's `useChat` hook, manages messages and streaming state
- **FileSystemContext** (`src/lib/contexts/file-system-context.tsx`) — Manages `VirtualFileSystem` instance, routes AI tool calls to file operations, tracks selected file for the editor

### Routing

- `/` — Home page; redirects authenticated users to their latest project, shows main content for anonymous users
- `/[projectId]` — Project page (authenticated); loads saved messages and file system from database
- `/api/chat` — Streaming chat endpoint

### Auth

JWT-based with HTTP-only cookies (`src/lib/auth.ts`). Server actions in `src/actions/` handle signup/signin/signout. Middleware (`src/middleware.ts`) protects API routes.

### Database

SQLite via Prisma. Schema in `prisma/schema.prisma`. Prisma client generated to `src/generated/prisma`. Two models: `User` and `Project` (stores serialized messages and file system data as JSON strings).

### AI Provider

`src/lib/provider.ts` — Returns Anthropic Claude when `ANTHROPIC_API_KEY` is set, otherwise returns a `MockLanguageModel` that produces canned multi-step tool calls for demo/testing.

## Key Conventions

- Path alias `@/*` maps to `./src/*`
- UI components use shadcn/ui (Radix primitives + Tailwind). Config in `components.json`, components in `src/components/ui/`
- Generated components must use Tailwind CSS, not inline styles
- The AI system prompt (`src/lib/prompts/generation.tsx`) defines rules for generated code: `/App.jsx` as entry point, `@/` import alias for non-library files, virtual FS only
- Tests are co-located in `__tests__/` directories next to the code they test
- Vitest with jsdom environment and React Testing Library
