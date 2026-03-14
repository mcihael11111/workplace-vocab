# Plan: Auth + Learning Progress Tracking

**Goal:** Add Google login and per-user term completion tracking to Workplace Vocab.

---

## What we're building

1. **Login flow** — "Start Learning" button opens a login modal. Users sign in with Google.
2. **Mark as complete** — logged-in users see a "Mark as complete" button on each flashcard.
3. **Progress dashboard** — a new view (no page reload) showing all categories, all terms, and which ones are done. Includes a "Continue" button to jump back in.
4. **User menu in nav** — avatar + name when logged in, logout option.

---

## Tech choices

| Need | Solution | Why |
|------|----------|-----|
| Google OAuth | **Firebase Auth** | One-stop: Auth + DB, no backend needed |
| Persist progress | **Firestore** | Real-time, per-user document store |
| Routing | None — **state-based view switching** | App has no router; keep the pattern |

### Firestore data model
```
users/
  {userId}/
    completedTerms: ["A/B Testing", "Bounce Rate", ...]   ← array of term names
```
Simple array; term names are unique across the dataset so no IDs needed.

---

## Stages

### Stage 1 — Firebase setup + Auth ✅ TODO
- Install `firebase` package
- Create `src/firebase.js` — initialise app + auth + firestore
- Create `src/context/AuthContext.jsx` — `AuthProvider`, `useAuth` hook
  - Exposes: `user`, `signInWithGoogle()`, `signOut()`
- Wrap `<App>` in `<AuthProvider>` in `main.jsx`

**Files created:** `src/firebase.js`, `src/context/AuthContext.jsx`

---

### Stage 2 — Login modal ✅ TODO
- Create `src/components/overlays/LoginModal.jsx`
  - Google sign-in button, brief value prop copy, close button
  - Shown when unauthenticated user clicks "Start Learning" (CtaSection) or any gated action
- Add `loginOpen` state to `App.jsx`, pass `openLogin` down where needed
- Update `CtaSection.jsx` — "Start Learning" calls `openLogin()` instead of scrolling
- Update `HeroSection.jsx` — secondary "Start Learning" CTA (if present) does same

**Files created:** `src/components/overlays/LoginModal.jsx`
**Files modified:** `App.jsx`, `CtaSection.jsx`, `HeroSection.jsx`

---

### Stage 3 — User menu in nav ✅ TODO
- Update `SiteNav.jsx` — right side shows:
  - When logged out: "Sign in" button → opens login modal
  - When logged in: avatar circle + display name, clicking opens a small dropdown with "My Progress" + "Sign out"

**Files modified:** `SiteNav.jsx`

---

### Stage 4 — Progress hook + Firestore sync ✅ TODO
- Create `src/hooks/useProgress.js`
  - On mount: loads user's `completedTerms` array from Firestore
  - Exposes: `completedTerms` (Set), `toggleComplete(termName)`
  - `toggleComplete` adds/removes term from Firestore array atomically
- Add "Mark as complete" toggle button to `FlashcardModal.jsx`
  - Green checkmark when complete, outline when not
  - Only shown when user is logged in

**Files created:** `src/hooks/useProgress.js`
**Files modified:** `FlashcardModal.jsx`, `App.jsx`

---

### Stage 5 — Progress dashboard view ✅ TODO
- Create `src/components/sections/ProgressSection.jsx`
  - Full-page view (replaces main content, state-controlled from App.jsx)
  - Header: "Your Progress" + overall % complete chip
  - Per-category accordion panels showing each term with ✓ / ○ status
  - "Continue" button on each category → opens the next uncompleted flashcard
  - "Back to home" button returns to normal view
- Wire into `App.jsx` with `activeView` state (`"home"` | `"progress"`)
- Nav "My Progress" link sets `activeView = "progress"`

**Files created:** `src/components/sections/ProgressSection.jsx`
**Files modified:** `App.jsx`, `SiteNav.jsx`

---

## What logged-out users still see
- Full site, all terms, all flashcards — nothing gated
- "Mark as complete" button not shown
- Clicking "Start Learning" opens login modal

## Order of implementation
Stage 1 → 2 → 3 → 4 → 5. Each stage is independently deployable.

---

## Firebase project setup (one-time, manual)
Before Stage 1 code runs, you need to:
1. Create a Firebase project at console.firebase.google.com
2. Enable **Authentication → Google** sign-in provider
3. Enable **Firestore Database** (start in production mode)
4. Register a web app → copy the config object
5. Add your domain to **Authentication → Authorised domains**

The config values go into a `.env` file (never committed):
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
