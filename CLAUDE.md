# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (this also regenerates the AGENTS.md block above via `next dev`)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config: `eslint-config-next` core-web-vitals + typescript rulesets)
- No test framework is configured in this repo yet.

## Architecture

This is Next.js 16.3.5 on the App Router — newer than this model's training data, per the AGENTS.md notice above. Breaking changes already confirmed by reading `node_modules/next/dist/docs/`:

- **Middleware is renamed Proxy.** The convention is a `proxy.ts` file at the project root exporting `proxy()` (not `middleware.ts`/`middleware()`). Functionality is unchanged, only the name and file convention.
- **Cache Components** (`next.config.ts` → `cacheComponents: true`) is the new caching model, replacing route segment configs (`dynamic`, `revalidate`, `fetchCache`) with the `use cache` directive plus `cacheLife`/`cacheTag` from `next/cache`, and requiring `<Suspense>` around runtime-only data (`cookies()`, `headers()`, `searchParams`, random/time values). `next.config.ts` in this repo is currently empty, so Cache Components is **not** enabled — check that file before assuming this model applies.
- Layout/page prop types come from generated helpers (`LayoutProps<"/">`, `PageProps<...>`) rather than hand-written interfaces — see `app/layout.tsx`.

Consult `node_modules/next/dist/docs/01-app/` for anything else that looks unfamiliar before relying on prior Next.js knowledge.

### Current state of the project

This is a freshly scaffolded `create-next-app` project with shadcn/ui and Supabase added as dependencies but not yet wired into application code:

- `app/` — only `layout.tsx`, `page.tsx`, and `globals.css` exist, still the default create-next-app content.
- `components/ui/` — shadcn/ui primitives (avatar, button, card, dialog, dropdown-menu, input, label, sheet). Generated per `components.json` (style `base-nova`, baseColor `neutral`, icon library `lucide`, RSC on). Add new primitives via the `shadcn` CLI rather than hand-writing them, to stay consistent with this config.
- `lib/utils.ts` — re-exports `cn` from the `cn` package; this is what shadcn components use for class merging.
- `@supabase/supabase-js` and `@supabase/ssr` are installed but there is no client/server Supabase setup yet (no `lib/supabase/*` or equivalent) — this integration is greenfield.
- Path alias `@/*` → repo root (`tsconfig.json`), matching the shadcn aliases in `components.json` (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`).
- Styling is Tailwind CSS v4 via `@tailwindcss/postcss`; there is no `tailwind.config.*` file since v4 configures via CSS in `app/globals.css`.
