# Motif App

Next.js 16 frontend for Motif. It talks to the Go API in `../core` from server components and server actions only; the browser never calls the API directly.

## Setup

```bash
cp .env.example .env.local
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). The API must be running on `API_URL` (default `http://localhost:8000/api/v1`), otherwise every page shows a "Can't reach the Motif API" error state.

| Command | What it does |
|---------|--------------|
| `yarn dev` | Dev server with Turbopack |
| `yarn build` | Production build (every route is a partial prerender) |
| `yarn start` | Serve the production build |
| `yarn lint` | ESLint |
| `npx tsc --noEmit` | Type check (run `npx next typegen` first on a clean checkout) |

## Screens

| Route | Screen |
|-------|--------|
| `/` | Leads portal: campaign selector, stats, searchable / filterable / sortable target table with inline priority and stage edits, CSV import, add company |
| `/campaigns` | Campaign cards, including archived ones |
| `/campaigns/new` | Five-step setup wizard: basics, ICP, documents, workflow, review |
| `/campaigns/[id]` | Campaign settings: basics, status, workflow, ICP edit, documents, delete |
| `/companies/[id]` | Target research: profile, ICP criteria check, findings, risks, next actions, outreach drafts, research chat |
| `/inbound` | Inbound deals: status tabs, detail, ICP fit, reply drafts, Gmail setup state |

Query params drive state so every view is linkable: `?campaign=`, `?q=`, `?sort=`, `?priority=`, `?research_status=`, `?evaluation_status=`, `?page=`, `?status=`, `?id=`, `?tab=`.

## Structure

```
app/          routes, layout, loading / error / not-found
base/         primitives from Stitchd (Button, TextField, Select, Modal, ToggleGroup, Tooltip...)
components/   feature folders, each with index.ts barrel and actions.ts server actions
context/      ChatProvider, PortalProvider
data/         status meta (labels, colours, tooltips) and filter definitions
hooks/        useMouse, useShortcut, useSearchParam
icons/        SVG icon components
lib/api/      _GET/_POST/_PATCH/_PUT/_DELETE helpers and one file per resource
lib/types/    IRaw* API shapes and serialize* functions to camelCase
lib/common/   cn, formatters, query parsing
```

Conventions come from the Lens app and Stitchd: `// #region imports`, `"use server"` action files that call `refresh()` after a mutation, `useOptimistic` for inline edits, and async sections wrapped in `<Suspense>` with matching skeletons.

## Honest states

- Fit scores and seed companies are labelled **Sample**. Nothing computes a score yet.
- The "Why it matches the ICP" panel is a rule-based comparison of profile fields against the ICP, not AI.
- "Run AI research" and the research chat show a setup-required state until a research provider is wired in the API.
- Gmail sync shows the missing environment variables reported by the API. Inbound deals are seed data or logged by hand.
- Drafts can be edited, reviewed and copied. Send is disabled; Motif never sends email.
- Uploaded documents are stored with metadata only and marked "Not parsed".
