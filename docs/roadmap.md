# Roadmap

## Phase 1 — Static (Current)

**Status:** Live

**What's active:**
- React SPA reads vocabulary data from local JS files (`packages/frontend/src/data/`)
- No backend API calls
- No database
- No user accounts

**Ship criteria:** Frontend builds, deploys to Vercel, all 100+ terms accessible.

---

## Phase 2 — API-backed

**Trigger:** Content grows enough that editing JS files becomes impractical, or search/filtering needs to move server-side.

**Changes:**
- Backend deployed (Railway or Render) with PostgreSQL
- Seed script runs: all categories and terms imported from JS data files into DB
- Frontend updated to fetch from `VITE_API_URL`:
  - `GET /api/v1/terms?q=&level=&domain=` — replaces in-memory filter in `filterUtils.js`
  - `GET /api/v1/categories` — replaces `CATEGORIES` import
- `filterUtils.js` functions become the specification for API query params (no frontend filter logic needed once server-side search is live)
- Admin UI or CMS connected to backend for content editing (no code deploys for new terms)

**Effort:** Medium — frontend fetch hooks + backend already scaffolded.

---

## Phase 3 — User Accounts & Progress

**Trigger:** Enough returning users to justify personalisation, or a paid/premium tier.

**Changes:**
- Auth layer added (recommend [Clerk](https://clerk.com) or [Auth0] for hosted auth, or [NextAuth] if moving to Next.js)
- `User`, `Progress`, `Bookmark` Prisma models activated (already defined in comments in `schema.prisma`)
- New API routes: `POST /api/v1/bookmarks`, `GET /api/v1/progress`
- Frontend: bookmarks saved per-user, progress indicator on categories, streak or completion tracking
- Optional: learning streaks, spaced repetition, shareable progress cards

**Effort:** High — auth integration is the most complex step.

---

## Future Ideas (Backlog)

- **Search improvements** — fuzzy search, typo tolerance (consider Algolia or pgvector)
- **Audio pronunciation** — short audio clips for tricky terms
- **Quiz mode** — definition shown, user types or selects the term
- **Content CMS** — Sanity or Contentful integration so non-technical editors can manage terms
- **Sharing** — shareable flashcard links, Twitter/LinkedIn card integration
- **Mobile app** — React Native or PWA wrapper
- **Analytics dashboard** — most viewed terms, most bookmarked, search queries that return no results (content gap discovery)
