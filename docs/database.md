# Database

## ORM: Prisma 5

Prisma was chosen for:
- Type-safe queries without raw SQL
- First-class migration tooling (`prisma migrate dev` / `prisma migrate deploy`)
- Built-in seeding workflow
- Easy swap to other databases (MySQL, SQLite, etc.) by changing the datasource provider

Schema location: `packages/backend/prisma/schema.prisma`

---

## Schema

### Phase 1 — Content models

#### `Category`
| Field | Type | Notes |
|---|---|---|
| `id` | `String` (cuid) | Primary key |
| `slug` | `String` (unique) | URL-safe id e.g. `"design-system"` |
| `name` | `String` | Display name e.g. `"Design System"` |
| `domain` | `String` | `"Product Design"` \| `"Engineering"` \| `"Business"` \| `"Marketing"` |
| `icon` | `String` | Emoji |
| `description` | `String` | Short description |
| `color` | `String` | Background hex |
| `accent` | `String` | Accent hex |
| `count` | `Int` | Denormalised term count |
| `terms` | `Term[]` | Relation |

#### `Term`
| Field | Type | Notes |
|---|---|---|
| `id` | `String` (cuid) | Primary key |
| `slug` | `String` (unique) | e.g. `"cognitive-load"` |
| `term` | `String` | Display name |
| `categoryId` | `String` | FK → Category |
| `level` | `Level` enum | `Beginner` \| `Intermediate` \| `Advanced` |
| `definition` | `Text` | What it means |
| `whyItMatters` | `Text` | Why professionals should know it |
| `example` | `Text` | In-context usage sentence |
| `related` | `String[]` | Array of related term names (denormalised) |

> **Note on `related`:** Currently stored as a string array for simplicity. When user-generated connections or analytics are needed in Phase 3, normalise this into a `TermRelation` join table.

#### `Level` enum
```
Beginner | Intermediate | Advanced
```

---

### Phase 2 — User models (commented out in schema)

`User`, `Progress`, `Bookmark` models are defined in comments in `schema.prisma`. To activate: uncomment and run `npm run db:migrate`.

---

## Migration Workflow

### Development
```bash
# After changing schema.prisma:
cd packages/backend
npm run db:migrate
# Prisma will prompt for a migration name
```

### Production (CI / release command)
```bash
npm run db:deploy
# Applies all pending migrations without prompting
```

### Never edit migration files manually
Prisma owns the `prisma/migrations/` directory. Only modify `schema.prisma` and let Prisma generate the SQL.

---

## Seeding

The seed script at `src/db/seed.js` reads directly from `packages/frontend/src/data/words.js` and `categories.js` — the JS data files are the single source of truth until a CMS is built.

```bash
cd packages/backend
npm run db:seed
```

The seed uses `upsert` on `slug` — safe to re-run without creating duplicates.

---

## Connecting to a Database

### Local (development)

1. Install PostgreSQL locally or use Docker:
   ```bash
   docker run --name wv-db -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=workplace_vocab -p 5432:5432 -d postgres
   ```
2. Set `DATABASE_URL` in `packages/backend/.env`:
   ```
   DATABASE_URL="postgresql://postgres:secret@localhost:5432/workplace_vocab?schema=public"
   ```
3. Run migrations and seed:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

### Hosted (production)

Recommended providers: **Supabase**, **Railway**, **Neon**, or **PlanetScale** (MySQL).

All provide a `DATABASE_URL` connection string. Set it as an environment variable on your hosting platform. Run `npm run db:deploy` as a release command before the app starts.
