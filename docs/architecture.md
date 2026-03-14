# Architecture

## Overview

Workplace Vocab is a monorepo with two independent packages:

| Package | Path | Purpose |
|---|---|---|
| `@workplace-vocab/frontend` | `packages/frontend/` | Vite + React SPA |
| `@workplace-vocab/backend`  | `packages/backend/`  | Node.js + Express REST API |

The packages share no runtime code. The frontend reads vocabulary data from local JS files in **Phase 1** and will fetch from the API in **Phase 2**.

---

## Directory Tree

```
workplace-vocab/
├── .github/workflows/         CI pipelines
├── docs/                      All documentation (you are here)
├── packages/
│   ├── frontend/              Vite + React SPA
│   │   ├── public/            Static assets (favicon, og-image, robots.txt)
│   │   ├── src/
│   │   │   ├── components/    UI split into layout / sections / cards / overlays / ui
│   │   │   ├── data/          Static vocabulary data (words, categories, domains, featured)
│   │   │   ├── hooks/         Custom React hooks
│   │   │   ├── styles/        CSS files (global, animations, fonts)
│   │   │   ├── types/         JSDoc type definitions
│   │   │   ├── utils/         Pure utility functions
│   │   │   ├── App.jsx        Root component — state + layout orchestration
│   │   │   └── main.jsx       Entry point — createRoot, CSS imports
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   └── backend/               Express API
│       ├── prisma/
│       │   └── schema.prisma  Data model (PostgreSQL)
│       ├── src/
│       │   ├── config/        Environment variable validation
│       │   ├── controllers/   HTTP request/response handlers
│       │   ├── db/            Prisma client singleton + seed script
│       │   ├── middleware/     CORS, logging, error handling
│       │   ├── routes/        Express routers — mounted at /api/v1
│       │   ├── services/      Business logic (Prisma queries)
│       │   ├── utils/         apiResponse helper
│       │   ├── app.js         Express app config
│       │   └── index.js       Server entry — app.listen
│       └── package.json
├── .gitignore
├── .env.example               Root-level shared env template
├── package.json               npm workspaces root
└── README.md
```

---

## Data Flow (Phase 1 — Static)

```
User interaction
      │
      ▼
  App.jsx  ←── useState (search, activeFilter, activeDomain)
      │         useModalState, useDrawerState
      │
  Section components (HeroSection, CategoriesSection, FeaturedSection)
      │
  filterUtils.js  ←── filterCategories(), filterByLevel()
      │
  data/words.js + data/categories.js  (static JS arrays)
      │
  Card/Overlay components
      │
  FlashcardModal  ←── termLookup.js findTermByName() for related chips
```

## Data Flow (Phase 2 — API-backed)

```
User interaction
      │
      ▼
  App.jsx  ←── fetch(`${VITE_API_URL}/api/v1/terms?q=...`)
      │
  Express API  ─── termsController → termsService → Prisma → PostgreSQL
      │
  JSON response  →  React state  →  component re-render
```

---

## Phases

| Phase | Status | What's active |
|---|---|---|
| 1 | Current | Frontend reads static JS data files |
| 2 | Planned | Frontend fetches from Express API; data in PostgreSQL |
| 3 | Planned | User accounts, bookmarks, progress tracking |

See [roadmap.md](./roadmap.md) for full phase details.
