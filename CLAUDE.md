# NORA — Nexora AI BizDev Agent

> A daily AI BizDev assistant for Nexora AI. It analyzes the current state of the
> company and generates concrete improvement suggestions in three areas
> (Marketing, Product, Operations). The founder reviews and approves them; NORA
> then ships approved suggestions as Monday.com tasks and elaborated Notion docs.
>
> Built on the AI Coding Starter Kit — a Next.js template with an AI-powered
> development workflow driven by specialized skills (Requirements, Architecture,
> Frontend, Backend, QA, Deployment). The product itself is **NORA**; the skills
> and rules under `.claude/` are how features get built.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 3 + shadcn/ui (Radix primitives, copy-paste components)
- **Backend:** Supabase (PostgreSQL + Auth + RLS) — accessed via `@supabase/ssr`
- **AI:** Anthropic Claude via `@anthropic-ai/sdk` (model `claude-opus-4-8`, structured output with Zod)
- **Integrations:** Monday.com API (task creation), Notion API (document creation/elaboration)
- **Validation:** Zod + react-hook-form
- **Deployment:** Vercel (daily cron for suggestion generation)
- **Testing:** Vitest (unit/integration) + Playwright (E2E)

## What NORA Does (Data Flow)

1. **Generate** — A daily Vercel cron (`0 6 * * *`) or the dashboard "Generate"
   button hits `GET/POST /api/generate-suggestions`. It loads live context
   (Supabase history + Notion BizDev DB + QualiPilot Living Spec), calls Claude
   to produce 3–5 suggestions, and stores them as `pending`.
2. **Review** — Stefan reviews pending suggestions on `/dashboard` and
   approves / rejects / marks implemented.
3. **Ship** — On approval, the `updateSuggestionStatus` server action creates a
   Monday.com task and (best-effort) a Claude-elaborated Notion document, then
   marks the suggestion `approved`.
4. **Track** — Implementation history and all-time stats are shown in the
   dashboard's "Verlauf" view.

## Project Structure

```
src/
  middleware.ts            Supabase auth gate (redirects to /login; /api excluded)
  app/
    page.tsx               Root (redirects)
    login/                 Login page (Supabase auth)
    dashboard/             Review & approval UI + history view (client components)
    api/
      generate-suggestions/  Cron + button endpoint (auth via CRON_SECRET or session)
    actions/
      suggestions.ts       Server action: approve→Monday+Notion, status changes
  components/ui/           shadcn/ui components (NEVER recreate these)
  hooks/                   Custom React hooks (use-toast, use-mobile)
  lib/
    supabase.ts            Browser Supabase client
    supabase-server.ts     Server client (cookies) + service-role client
    anthropic.ts           Claude: generateSuggestions(), elaborateDocument()
    live-context.ts        Assembles live context for generation
    nora-context.ts        Static company briefing (NORA_COMPANY_CONTEXT)
    monday.ts              Monday.com GraphQL: boards, groups, tasks, updates
    notion.ts              Notion API: databases, pages, BizDev entries
    utils.ts               cn() class helper
supabase/schema.sql        DB schema (idempotent): suggestions, implementations,
                           daily_reports, app_config — all with RLS
features/                  Feature specs (PROJ-X-name.md) + INDEX.md + README.md
docs/
  PRD.md                   Product Requirements Document
  design-system.md         Nexora AI brand guide (Dark Premium, Sora, #0078FF)
  production/              Production guides (error tracking, perf, security, rate limiting)
tests/                     Playwright E2E specs (one per PROJ-X)
.claude/
  skills/                  Workflow skills (init, write-spec, architecture, ...)
  rules/                   Always-on rules (general, frontend, backend, security)
  agents/                  Subagent definitions (frontend-dev, backend-dev, qa-engineer)
vercel.json                Daily cron → /api/generate-suggestions
```

## Database

Schema lives in `supabase/schema.sql` (idempotent — safe to re-run). Tables:

- **suggestions** — generated ideas. `status`: `pending | approved | rejected | implemented`. `category`: `marketing | product | operations`.
- **implementations** — links a suggestion to its Monday task / Notion page; `status`: `pending | done | failed`.
- **daily_reports** — one row per `report_date`; `generation_status`: `pending | sent | failed` (used for double-run protection).
- **app_config** — key-value store for runtime config (e.g. `monday_board_id`, `notion_database_id`).

Every table has **RLS enabled** with policies allowing access only to authenticated users. The cron endpoint bypasses RLS via the service-role client.

## Environment Variables

Document all of these in `.env.local.example`. Never commit real values.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (browser-safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (browser-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key — server-only, used by cron to bypass RLS |
| `ANTHROPIC_API_KEY` | Claude API key for generation + elaboration |
| `CRON_SECRET` | Bearer token authorizing the Vercel cron call |
| `MONDAY_API_KEY` | Monday.com API token (task creation) |
| `NOTION_API_KEY` | Notion integration token (document creation) |
| `NOTION_PARENT_PAGE_ID` | Parent page under which the Notion DB is created |

## Development Workflow (Skills)

Features are built by invoking skills in order. Each reads `features/INDEX.md` at
start and updates it when done.

1. `/init` - Initialize the project: PRD + feature map (run once at the start)
2. `/write-spec` - Create a full feature spec for one feature
3. `/architecture` - Design tech architecture (PM-friendly, no code)
4. `/frontend` - Build UI components (shadcn/ui first!)
5. `/backend` - Build APIs, database, RLS policies
6. `/qa` - Test against acceptance criteria + security audit
7. `/deploy` - Deploy to Vercel + production-ready checks

Use `/refine PROJ-X` at any point to revisit and improve an existing feature spec.
Use `/help` if unsure where you are in the workflow.

## Feature Tracking

All features are tracked in `features/INDEX.md`. Feature specs live in
`features/PROJ-X-name.md` (one feature per file). Feature IDs are sequential —
check INDEX.md for the next available number. After completing work, follow the
**Write-Then-Verify** status-update sequence in `.claude/rules/general.md`:
read → edit → re-read to confirm the change landed.

## Key Conventions

- **Feature IDs:** PROJ-1, PROJ-2, … (sequential)
- **Commits:** `type(PROJ-X): description` — types: feat, fix, refactor, test, docs, deploy, chore
- **Single Responsibility:** one feature per spec file
- **shadcn/ui first:** NEVER create custom versions of installed shadcn components — check `src/components/ui/` and install missing ones with `npx shadcn@latest add <name> --yes`
- **RLS always:** every Supabase table has RLS enabled with explicit policies. RLS or auth-flow changes require explicit user approval (see `.claude/rules/security.md`)
- **Server-side validation:** validate all input with Zod in server actions / API routes; never trust the client
- **Human-in-the-loop:** suggestions stay drafts until Stefan approves; integrations (Monday/Notion) only run on approval
- **Best-effort integrations:** Notion/elaboration failures must not block a Monday task or an approval — they degrade to warnings
- **Tests:** unit tests co-located next to source (`anthropic.test.ts` next to `anthropic.ts`); E2E specs in `tests/PROJ-X-*.spec.ts`
- **Language:** code comments and user-facing copy are in German (the founder's working language); keep that consistent

## Build & Test Commands

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run start        # Production server
npm test             # Vitest unit/integration tests (vitest run)
npm run test:watch   # Vitest watch mode
npm run test:e2e     # Playwright E2E tests
npm run test:all     # Both suites (vitest run && playwright test)
```

## Product Context

@docs/PRD.md

## Feature Overview

@features/INDEX.md
