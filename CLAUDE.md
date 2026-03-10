# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Production build
npm run lint      # Run ESLint

# E2E tests (requires dev server running)
npx playwright test                        # Run all tests
npx playwright test tests/auth.spec.ts     # Run a single test file
npx playwright test --ui                   # Interactive UI mode
```

## Environment

Requires `.env.local` with:
```
DATABASE_URL=postgres://...
JWT_SECRET=...
```

## Architecture

This is a Next.js 16 App Router ecommerce storefront demo using PostgreSQL directly (no ORM).

**Data layer** (`lib/db.ts`): A singleton `postgres` (npm package) connection exported as `sql`. All pages query the DB directly using tagged template literals — `sql\`SELECT ...\``. The singleton pattern prevents connection leaks during Next.js hot reloads.

**Pages** are all React Server Components except `app/auth/page.tsx` (client component). They query the DB at render time with no intermediate API layer.

**Auth flow** (`app/auth/`): The auth page is a client component that calls the `handleAuth` server action. The action hashes passwords with bcrypt, signs a 24h JWT with `jose`, and stores it as an `httpOnly` session cookie. `logout()` deletes that cookie. There is no middleware protecting routes — auth is purely client-initiated.

**`AppShell` component** (`components/AppShell.tsx`): Shared layout wrapper used by all pages. Provides the sticky header with nav links, theme toggle, account link, logout button, and a consistent page title/subtitle area.

**Theme**: Dark mode is implemented via a Tailwind `dark:` class strategy. `localStorage` is read in an inline `<script>` in the root layout `<head>` to apply the `dark` class before hydration (avoids flash). `ThemeToggle` toggles the class and persists to `localStorage`.

**Routes**:
- `/` — Homepage: top 6 categories + 9 latest products
- `/products` — Paginated full catalog (20/page), grouped by category
- `/products/[id]` — Single product detail
- `/categories` — All categories with product counts
- `/categories/[category]` — Products filtered by category
- `/auth` — Login/register form (toggles between modes with a hidden `type` field)

**`lib/format.ts`**: Single utility `formatCurrencyUSD(value)` — handles `unknown` price type from Postgres.

## Key conventions

- `price` columns come back from Postgres as `unknown`; always use `formatCurrencyUSD()` from `lib/format.ts` to display them.
- Server actions are in `app/auth/actions.ts` with `"use server"` directive.
- Path alias `@/` maps to the project root.
- Tailwind v4 is used (PostCSS plugin, not the v3 config file).
