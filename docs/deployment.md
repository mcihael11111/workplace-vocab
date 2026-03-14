# Deployment

## Frontend — Vercel

The frontend is a static Vite build — the best fit for Vercel's free tier.

### Setup
1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Configure:
   - **Root directory:** `packages/frontend`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` → your production API URL (e.g. `https://api.workplacevocab.com`)
5. Deploy

Vercel auto-deploys on every push to `main`.

### Phase 1 note
In Phase 1, the frontend has no API calls — `VITE_API_URL` is defined but unused. The static build will work without a running backend.

---

## Backend — Railway or Render

Both Railway and Render support Node.js deployments with PostgreSQL add-ons in a few clicks.

### Railway (recommended for simplicity)

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Select the repo, set **Root directory** to `packages/backend`
3. Add a **PostgreSQL** plugin — Railway provides the `DATABASE_URL` automatically
4. Add environment variables:
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://your-frontend.vercel.app`
   - `PORT=3001` (Railway sets `PORT` automatically — this is a fallback)
5. Set the **release command** (runs before the app starts):
   ```
   npx prisma migrate deploy
   ```
6. Set the **start command:**
   ```
   node src/index.js
   ```
7. Deploy

### Render

1. New Web Service → Connect repo
2. **Root directory:** `packages/backend`
3. **Build command:** `npm install && npx prisma generate`
4. **Start command:** `node src/index.js`
5. Add a PostgreSQL database under "Databases" — copy the external URL to `DATABASE_URL`
6. Set env vars: `NODE_ENV`, `CORS_ORIGIN`, `DATABASE_URL`

---

## Pre-Launch Checklist

### Frontend
- [ ] `VITE_API_URL` set to production API URL (Phase 2 only)
- [ ] Build succeeds locally: `npm run build`
- [ ] `index.html` has correct `<title>` and `<meta name="description">`
- [ ] `public/favicon.ico` is in place
- [ ] `public/og-image.png` is in place (1200×630px recommended)
- [ ] `public/robots.txt` is in place

### Backend
- [ ] `DATABASE_URL` set and PostgreSQL is reachable
- [ ] `CORS_ORIGIN` matches the deployed frontend URL exactly (no trailing slash)
- [ ] `NODE_ENV=production`
- [ ] `prisma migrate deploy` runs as a release command
- [ ] `GET /api/v1/health` returns 200 after deploy

### General
- [ ] Custom domain configured (optional)
- [ ] HTTPS enforced (both platforms do this by default)
- [ ] No `.env` files committed to git

---

## Custom Domain

### Vercel
Settings → Domains → Add `workplacevocab.com` or `www.workplacevocab.com`. Update DNS records as shown.

### Railway / Render
Both support custom domains under the service settings. Add a CNAME record pointing to the provided hostname.

Update `CORS_ORIGIN` on the backend to match the new frontend domain after switching.
