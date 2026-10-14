# Motif App

Next.js 16 frontend for Motif. It talks to the Go API in `../core` only from server components and server actions. The browser never calls the API or OpenAI directly.

## Setup

```bash
cp .env.example .env.local    # API_URL, default http://localhost:8000/api/v1
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). The API must be reachable at `API_URL`, or every page shows a "Can't reach the Motif API" error state. `API_URL` is read at runtime, so one build works for any environment.

| Command | What it does |
|---------|--------------|
| `yarn dev` | Dev server with Turbopack |
| `yarn build` | Production build with standalone output (routes are partial prerenders) |
| `yarn start` | Serve the production build |
| `yarn lint` | ESLint |
| `npx tsc --noEmit` | Type check (run `npx next typegen` first on a clean checkout) |

Docker: `docker build -t motif-app .` produces a distroless Node image that runs `server.js` on `PORT` (default 3000). Pass `API_URL` at run time.

## Screens

| Route | Screen |
|-------|--------|
| `/` | Leads portal: campaign selector, stats, a searchable, filterable and sortable target table with inline priority and stage edits, CSV import, add company, CSV export |
| `/campaigns` | Campaign cards, including archived ones |
| `/campaigns/new` | Four-step setup wizard: basics, ICP, workflow, review |
| `/campaigns/[id]` | Campaign settings: basics, status, workflow, Gmail label, ICP edit, delete |
| `/companies/[id]` | Target research: profile, ICP check with the AI fit summary, findings, risks, next actions, AI outreach drafts, research chat, Run AI research |
| `/inbound` | Inbound deals: status tabs, detail, AI fit score and summary with Evaluate / Re-evaluate, the email, reply drafts, Gmail sync |

Query params drive state, so every view is linkable: `?campaign=`, `?q=`, `?sort=`, `?priority=`, `?research_status=`, `?evaluation_status=`, `?page=`, `?status=`, `?id=`, `?tab=`.

## Structure

```
app/          routes, layout, loading / error / not-found
base/         primitives from Stitchd (Button, TextField, Select, Modal, ToggleGroup, Tooltip...)
components/   feature folders, each with an index.ts barrel and actions.ts server actions
context/      ChatProvider, PortalProvider
data/         status meta (labels, colours, tooltips) and filter definitions
hooks/        useMouse, useShortcut, useSearchParam
icons/        SVG icon components
lib/api/      _GET/_POST/_PATCH/_PUT/_DELETE/_DOWNLOAD helpers and one file per resource
lib/types/    IRaw* API shapes and serialize* functions to camelCase
lib/common/   cn, formatters, query parsing
```

Every API call goes through `lib/api`, with one function per route. Each returns `{ success, data, error, status }`, and lists also carry `total`, `page`, `count` and `counts`. Mutations go through `"use server"` action files that call `refresh()`. Inline edits use `useOptimistic`, and async sections are wrapped in `<Suspense>` with matching skeletons. Conventions come from the Lens app and Stitchd.

## UI states

- AI features (Run AI research, chat replies, inbound Evaluate, AI outreach drafts) check `/integrations`. Without `OPENAI_API_KEY`, the UI says so: research and evaluation explain the missing key, chat saves notes, and outreach drafts fall back to a template.
- Inbound deals and imported leads are scored in the background. A deal shows "Not evaluated yet" with an Evaluate button until its score arrives.
- The "Why it matches the ICP" panel is a rule-based comparison of profile fields against the ICP. It sits next to the AI fit summary.
- Seed companies and deals from `core/script/seed.sql` are labelled **Sample**.
- Drafts can be edited, reviewed and copied. Motif never sends email.
