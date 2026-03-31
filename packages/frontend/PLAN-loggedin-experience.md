# Plan: Logged-in Experience Improvements

Reference: PLAN-auth-and-progress.md (auth foundation)

---

## Problems to fix

1. **Nav doesn't update after Google redirect login** — `getRedirectResult` may not be processing, user state doesn't reflect
2. **"Start learning" doesn't change when logged in** — nav button stays static
3. **No "Resume course" CTA** — no obvious next action for returning users
4. **Category cards show no progress** — no indication of X/Y terms done
5. **Featured grid cards show no completion status** — no checkmark on completed terms
6. **No logged-in welcome context** — homepage feels the same regardless of auth state

---

## What best-practice logged-in experience looks like

- Personalised greeting / progress summary visible immediately
- Primary CTA changes from acquisition ("Start learning") to retention ("Resume →")
- Content reflects the user's state (completed, in-progress, not started)
- Nav is the persistent anchor: always shows who you are + where to go next

---

## Stages

### Stage 1 — Fix auth redirect handling ✅ TODO
- Add `getRedirectResult` call in `AuthContext` useEffect so returning users from Google redirect are properly picked up
- Files: `src/context/AuthContext.jsx`

### Stage 2 — Nav: logged-in state ✅ TODO
- Replace "Start learning" button with:
  - User avatar (photo or initials circle)
  - "Resume →" pill button (opens next uncompleted flashcard)
  - Dropdown with "My Progress" + "Sign out"
- "Resume →" finds the first uncompleted term across ALL_WORDS
- Files: `src/components/layout/SiteNav.jsx`
- Requires: `completedTerms` prop passed down from App

### Stage 3 — Homepage: logged-in welcome strip ✅ TODO
- Shown only when user is logged in, sits between Hero and Ticker
- Shows: "Welcome back, [Name]" + overall progress chip + "Resume →" button
- Files: `src/components/sections/WelcomeStrip.jsx` (new), `src/App.jsx`

### Stage 4 — Category cards: per-category progress ✅ TODO
- Each CategoryCard shows X/Y terms complete + mini progress bar when user is logged in
- Completed categories get a green "✓ Complete" badge
- Files: `src/components/cards/CategoryCard.jsx`, `src/components/sections/CategoriesSection.jsx`
- Requires: `completedTerms` + word list per category

### Stage 5 — Featured grid cards: completion indicator ✅ TODO
- Completed GridCards show a green checkmark badge in the top-right
- Card background tints lightly green when complete
- Files: `src/components/cards/GridCard.jsx`, `src/components/sections/FeaturedSection.jsx`
- Requires: `completedTerms` prop

---

## Data flow

App.jsx owns `user` + `completedTerms` (already the case).
New props thread:

```
App
 ├── SiteNav          ← + completedTerms (for "Resume →")
 ├── WelcomeStrip     ← + user, completedTerms, onOpenModal (new)
 ├── CategoriesSection ← + completedTerms (new)
 │    └── CategoryCard ← + completedTerms (new)
 └── FeaturedSection  ← + completedTerms (new)
      └── GridCard    ← + isDone (new)
```

---

## Order of implementation
Stage 1 → 2 → 3 → 4 → 5. All deployable incrementally.
