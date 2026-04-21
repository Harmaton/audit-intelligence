# Auditor General Intelligence Platform — Next.js simulation

A fully-interactive, responsive prototype of the AG Intelligence Platform
shown in your mockups, built with the Next.js **App Router**, **Tailwind CSS**
and a **JSON file + API route** for entity persistence. Every module page is
navigable and backed by dummy data; new entities are onboarded via a
chat-style intake and persisted to `data/entities.json`.

---

## What you're getting

```
auditor-general-platform/
├── data/
│   └── entities.json                # Persisted entity registry (seed data included)
└── src/
    ├── app/
    │   ├── layout.tsx               # Root layout w/ responsive sidebar shell
    │   ├── globals.css              # Tailwind directives + small polish
    │   ├── page.tsx                 # Command Centre dashboard
    │   ├── risk-intelligence/page.tsx
    │   ├── reconciliation-hub/page.tsx
    │   ├── recommendations/page.tsx
    │   ├── value-realisation/page.tsx
    │   ├── executive-reporting/page.tsx
    │   ├── ministry-detail/page.tsx
    │   ├── entities/page.tsx        # Entity list + Entity Portal drawer
    │   ├── entities/onboard/page.tsx# Chat-style entity onboarding
    │   └── api/entities/route.ts    # GET list / POST create
    ├── components/
    │   ├── Sidebar.tsx              # Responsive desktop sidebar + mobile drawer
    │   ├── TopFilters.tsx           # Sector + audit-type chip filters
    │   ├── StatCard.tsx             # Stat / glow cards
    │   ├── ModuleCard.tsx           # "Tier X" capability card
    │   ├── RiskHeatmap.tsx          # Interactive SVG heatmap
    │   ├── TrendChart.tsx           # Line / bar / stacked bar SVG charts
    │   ├── AIAuditCopilot.tsx       # Copilot chat widget w/ canned answers
    │   ├── EntityPortalDrawer.tsx   # Entity Portal side-sheet
    │   ├── PageHeader.tsx           # Page hero
    │   ├── Pill.tsx                 # Risk / status pills
    │   └── Icons.tsx                # Inline SVG icons (no icon package)
    └── lib/
        ├── types.ts                 # Entity, Recommendation, etc.
        ├── seed.ts                  # Dummy data for every module
        └── store.ts                 # Read / write entities.json
```

## How to install into your project

This is the set of `src/` and `data/` files you were expecting — not a full
Next.js project scaffold. To drop them in:

1. Make sure your Next.js project has:

   - **App Router** enabled (default on `create-next-app@14+`)
   - **Tailwind CSS** configured (template you shared already has it)
   - A `tsconfig.json` with the `@/*` path alias (default in `create-next-app`
     with the `--src-dir` flag). If you don't use `src/`, put everything
     directly under the project root.

2. Copy `src/` over your existing `src/` (replace `app/` and `components/`,
   and add `lib/`).

3. Copy the top-level `data/` folder to your project root. The API route
   will read/write `data/entities.json` relative to `process.cwd()`.

4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Visit http://localhost:3000

### Tailwind note

The components use only stock Tailwind utilities — no custom plugins. If
your `tailwind.config.js` already scans `./src/**/*.{ts,tsx}` (default for
`create-next-app`), nothing else is needed.

---

## Features, page by page

| Route | What it does |
| --- | --- |
| `/` (Command Centre) | Hero, Tier 1 stat cards, risk heatmap, risk driver bars, action flow, trend charts, six module cards, AI Audit Copilot, recent alerts, platform benefits. Sector / audit-type filter chips are live. |
| `/risk-intelligence` | Live alerts with level filters, sector intensity chart, priority entities table. |
| `/reconciliation-hub` | Reconciliation queue with category & status filters, gap totals. |
| `/recommendations` | Recommendation tracker with status tabs, search and expandable details with mock escalation buttons. |
| `/value-realisation` | Overview tab (budget / spend / completion / scorecards) and Projects tab with completion bars and delay chips. |
| `/executive-reporting` | Cycle switch (Q1 26 / Q4 25 / Annual), AI-assisted summary with traceable sources, KPIs, trend charts. |
| `/entities` | Entity list pulling from the API, type/search filters, Entity Portal drawer, prominent **Onboard an entity** CTA. |
| `/entities/onboard` | Chat-style intake wizard → POSTs to `/api/entities` → persists to `data/entities.json`. Newly onboarded entities appear flagged in the list and bump the sidebar count. |
| `/ministry-detail` | Drill into any entity, shows risk trend, recommendations + reconciliation items for that entity, and illustrative spend split. |

## Responsive behaviour

- **≥ lg**: persistent 18rem sidebar.
- **< lg**: sidebar collapses into a top bar with a hamburger that opens a
  full-height drawer. Tap outside to close.
- Tables scroll horizontally on narrow viewports, filter pills wrap, and
  hero sections reflow from 1 → 2 → 3 columns.

## Data & persistence

- Seed data (entities, recommendations, reconciliation items, alerts, trends)
  lives in `src/lib/seed.ts`.
- Entities are the only persisted data — stored in `data/entities.json`.
- The API route (`/api/entities`) exposes:
  - `GET /api/entities` → `{ entities: Entity[] }`
  - `POST /api/entities` with JSON body → appends and returns `{ entity }`
- The sidebar and the Entities page refetch on navigation so the count and
  list update immediately after an onboarding.

## Known trade-offs

- The chat assistant and the copilot use canned responses, not a real LLM.
- The heatmap is a stylised zonal SVG — not a real geographic map.
- Storage is a JSON file, fine for a pilot demo but not concurrency-safe.
  Swap `src/lib/store.ts` for your real data layer when productionising.# audit-intelligence
