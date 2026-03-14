# Workplace Vocab

A vocabulary learning tool for designers, product managers, developers, and anyone who works in product. 100+ terms across 19 categories and 4 domains.

Built by [Michael Papanikolaou](https://www.madebymichael.com.au/uxuidesignportfolio) · delightfuldesign.com.au

---

## Quick Start (Frontend only — Phase 1)

```bash
cd packages/frontend
npm install
npm run dev
# → http://localhost:5173
```

## Quick Start (Frontend + Backend — Phase 2)

```bash
# 1. Install all workspace dependencies from root
npm install

# 2. Set up backend environment
cd packages/backend
cp .env.example .env
# Edit .env — set DATABASE_URL to your PostgreSQL connection string

# 3. Run migrations and seed data
npm run db:migrate
npm run db:seed

# 4. Start both servers (from repo root)
cd ../..
npm run dev:backend   # terminal 1 → http://localhost:3001
npm run dev:frontend  # terminal 2 → http://localhost:5173
```

---

## Project Structure

```
workplace-vocab/
├── packages/
│   ├── frontend/     Vite + React SPA
│   └── backend/      Node.js + Express + Prisma API
└── docs/             All documentation
```

## Documentation

| Doc | Contents |
|---|---|
| [docs/architecture.md](docs/architecture.md) | System overview, directory map, data flow |
| [docs/frontend.md](docs/frontend.md) | Component tree, props, hooks, utils |
| [docs/backend.md](docs/backend.md) | API routes, middleware, env vars |
| [docs/database.md](docs/database.md) | Schema, migrations, seeding, connecting a DB |
| [docs/data-content.md](docs/data-content.md) | How to add/edit terms and categories |
| [docs/deployment.md](docs/deployment.md) | Vercel (frontend) + Railway/Render (backend) |
| [docs/contributing.md](docs/contributing.md) | Branch strategy, commit format, PR guide |
| [docs/roadmap.md](docs/roadmap.md) | Phase 1 → 2 → 3 plan |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite 5 + React 18 |
| Fonts | DM Sans + DM Serif Display |
| Backend | Node.js + Express 4 |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Hosting | Vercel (frontend) + Railway (backend) |
| CI | GitHub Actions |
