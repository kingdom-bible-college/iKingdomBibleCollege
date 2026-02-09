# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kingdom Bible College (킹덤바이블칼리지) — an online Bible college platform built with Next.js App Router. Features course management with Vimeo video delivery, user registration with admin approval, and role-based access control.

## Commands

```bash
pnpm dev              # Start development server
pnpm build            # Production build
pnpm lint             # ESLint
pnpm tsc --noEmit     # Type check

# Database (Drizzle ORM + Neon PostgreSQL)
pnpm drizzle-kit generate   # Generate migration after schema change
pnpm drizzle-kit push       # Apply migration to dev DB
pnpm drizzle-kit studio     # Open DB GUI

# Local PostgreSQL
docker compose up -d         # Start local DB container
```

## Architecture

**Server-First**: All pages are Server Components by default. `'use client'` only on leaf components that need interactivity. All DB/query files must import `'server-only'`.

**DAL Pattern**: Database queries live exclusively in `src/db/queries/`. Pages never call `db.select()` directly — they import DAL functions. Query functions are named with verb prefixes: `getAll*`, `get*ById`, `create*`, `update*`, `delete*`.

**Route Groups**: `(auth)` for login/signup (no header layout), `(main)` for everything else (with header).

**Auth**: Custom session-based auth. Sessions stored in DB, 14-day expiry, cookie `kbc_session`. New users start as `pending` status — admin must approve before login works. Use `requireUser()` / `requireAdmin()` from `src/lib/auth/session.ts` for protected routes.

## Key Paths

- `src/db/schema.ts` — All table definitions (users, sessions, courses, courseVideoOrders, words)
- `src/db/queries/` — DAL query functions (one file per domain)
- `src/db/index.ts` — Drizzle client setup (**do not modify**)
- `src/lib/auth/` — Password hashing (scrypt) and session management
- `src/lib/validations/` — Zod schemas for input validation
- `src/lib/vimeo.ts` — Vimeo API integration (server-side, 60s cache)
- `src/app/api/` — REST API routes with Zod validation
- `drizzle/` — Generated SQL migration files

## Coding Rules

- No `any` type — use `unknown` if unavoidable
- Use Drizzle-inferred types: `typeof table.$inferSelect` / `$inferInsert`
- Minimize type assertions (`as`)
- Component filenames: PascalCase (`UserCard.tsx`)
- Table names: snake_case plural (`blog_posts`)
- All API inputs validated with Zod
- No direct SQL — always use Drizzle ORM
- CSS Modules for styling (no Tailwind)
- Path alias: `@/*` maps to `src/*`

## Environment Variables

Required in `.env.local` (see `env.local.example`):
- `KBC_DATABASE_URL` — PostgreSQL connection string
- `VIMEO_ACCESS_TOKEN` — Vimeo API token
- `VIMEO_PER_PAGE`, `VIMEO_MAX_PAGES` — Vimeo pagination config
