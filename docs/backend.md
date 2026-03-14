# Backend

## Stack

- **Node.js** (ES modules)
- **Express 4** — HTTP framework
- **Prisma 5** — ORM + migration tool
- **PostgreSQL** — database (any Prisma-compatible DB can be swapped in)
- **dotenv** — environment variable loading

---

## Running Locally

```bash
cd packages/backend
cp .env.example .env          # fill in DATABASE_URL etc.
npm install
npm run db:migrate            # create tables
npm run db:seed               # populate from JS data files
npm run dev                   # starts on port 3001
```

---

## API Reference

Base path: `/api/v1`

All responses follow one of these shapes:

```json
{ "success": true,  "data": <payload> }
{ "success": false, "error": "<message>" }
```

---

### Health

#### `GET /api/v1/health`
Uptime check for load balancers and deployment pipelines.

**Response:**
```json
{ "success": true, "status": "ok", "timestamp": "2026-03-14T00:00:00.000Z" }
```

---

### Terms

#### `GET /api/v1/terms`
Returns all terms. Supports filtering via query params.

| Query param | Type | Description |
|---|---|---|
| `q` | `string` | Search term name and definition |
| `level` | `"Beginner" \| "Intermediate" \| "Advanced"` | Filter by level |
| `category` | `string` | Filter by category name |
| `domain` | `string` | Filter by domain name |

**Example:** `GET /api/v1/terms?domain=Engineering&level=Beginner`

**Response:** `{ "success": true, "data": [Term, ...] }`

---

#### `GET /api/v1/terms/:id`
Returns a single term by `id` or `slug`.

**Response:** `{ "success": true, "data": Term }`

**404:** `{ "success": false, "error": "Term not found" }`

---

### Categories

#### `GET /api/v1/categories`
Returns all categories.

| Query param | Type | Description |
|---|---|---|
| `domain` | `string` | Filter by domain name |

**Response:** `{ "success": true, "data": [Category, ...] }`

---

#### `GET /api/v1/categories/:id`
Returns a single category by `id` or `slug`.

---

#### `GET /api/v1/categories/:id/terms`
Returns all terms belonging to a category.

**Response:** `{ "success": true, "data": [Term, ...] }`

---

## Middleware Stack (execution order)

```
Request
  │
  ├── corsMiddleware       Allow requests from CORS_ORIGIN
  ├── express.json()       Parse JSON body
  ├── express.urlencoded() Parse form body
  ├── requestLogger        Log method/path/status/ms (dev only)
  │
  ├── /api/v1/health      → health.routes
  ├── /api/v1/terms       → terms.routes   → termsController   → termsService
  ├── /api/v1/categories  → categories.routes → categoriesController → categoriesService
  │
  ├── notFound            404 for unmatched routes
  └── errorHandler        Catches thrown errors, returns { success: false, error }
```

---

## Controller / Service Pattern

**Controllers** (`src/controllers/`) handle HTTP: read `req.query` / `req.params`, call a service, write `res`.

**Services** (`src/services/`) contain business logic and Prisma queries. They have no knowledge of Express — they can be called from tests, CLI scripts, or other transports.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes (prod) | — | Prisma PostgreSQL connection string |
| `PORT` | No | `3001` | Express listen port |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed CORS origin |
| `NODE_ENV` | No | `development` | `development` \| `production` \| `test` |
