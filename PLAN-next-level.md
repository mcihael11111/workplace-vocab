# Development Plan: Take Workplace Vocab to the Next Level

> **Goal:** Transform from a beautifully written glossary into an addictive learning system that people recommend to each other.
>
> **Architecture:** All new features build on the existing React + Firebase stack (Phase 1). No backend migration required until noted.

---

## Phase 1: Spaced Repetition Engine (The Core Loop)

**Why first:** This single feature transforms "browse and leave" into "come back every day." Without it, everything else is lipstick on a glossary.

**Time estimate: ~1 week**

### 1.1 Data Model — Review Schedule

Extend the Firestore progress document at `users/{uid}/progress/data`:

```javascript
// New fields alongside existing completedTerms, viewedTerms, etc.
{
  reviewSchedule: {
    [termName: string]: {
      interval: number,        // Days until next review (1, 3, 7, 14, 30, 60)
      easeFactor: number,      // SM-2 ease factor (default 2.5)
      nextReview: "YYYY-MM-DD", // When to show this card again
      repetitions: number,     // Times successfully recalled
      lastReviewed: "YYYY-MM-DD"
    }
  },
  // Guest fallback: same shape in localStorage under wv_guest_reviews
}
```

**Files to modify:**
- [useProgress.js](packages/frontend/src/hooks/useProgress.js) — add `reviewSchedule` to Firestore sync, localStorage fallback, and merge-on-login logic
- New file: `packages/frontend/src/utils/spacedRepetition.js`

### 1.2 SM-2 Algorithm (Simplified)

Create `spacedRepetition.js` with a simplified SM-2 implementation:

```
On review response (quality 0-5):
  0-2 = "Forgot" → reset interval to 1, repetitions to 0
  3   = "Hard"   → interval stays same, ease decreases
  4   = "Good"   → interval × easeFactor
  5   = "Easy"   → interval × easeFactor × 1.3

Intervals cap at 60 days.
First review: 1 day. Second: 3 days. Then algorithmic.
```

Export functions:
- `calculateNextReview(current, quality)` → updated schedule entry
- `getDueTerms(reviewSchedule, today)` → term names due for review
- `getNewTermsForToday(allTerms, reviewSchedule, limit)` → terms never reviewed

### 1.3 Review Session UI

New route: `/review`

**Components to create:**
- `packages/frontend/src/components/sections/ReviewSession.jsx`

**UX flow:**
1. User opens `/review` (or taps "Start Review" from home/nav)
2. System pulls: due terms (max 15) + new terms (fill to 20 total)
3. Card appears (reuse existing FlashcardModal card layout)
4. After reading, user rates: **Forgot** / **Hard** / **Good** / **Easy** (4 buttons replacing prev/next)
5. Card animates out, next card appears
6. Session summary at end: "12 reviewed, 3 new, 5 to revisit tomorrow"
7. Confetti if all cards rated Good/Easy

**Files to modify:**
- [App.jsx](packages/frontend/src/App.jsx) — add `/review` route
- [SiteNav.jsx](packages/frontend/src/components/layout/SiteNav.jsx) — add "Review" nav link with due-count badge

### 1.4 Due Count Badge

Show a notification-style badge on the Review nav link:

```
Review (7)  ← 7 cards due today
```

Calculated from `getDueTerms()` on mount. Updates when reviews are completed.

**Files to modify:**
- [SiteNav.jsx](packages/frontend/src/components/layout/SiteNav.jsx) — badge next to "Review" link
- [useProgress.js](packages/frontend/src/hooks/useProgress.js) — expose `dueCount` from hook

---

## Phase 2: Daily Quiz Mode (Active Recall)

**Why second:** Passive reading doesn't create memory. Quizzes force retrieval, which is the actual mechanism that makes learning stick.

**Time estimate: ~1 week**

### 2.1 Quiz Engine

New route: `/quiz`

**Quiz types (randomised per question):**

| Type | Format | Example |
|------|--------|---------|
| **Definition match** | "Which term means...?" + 4 choices | Show definition → pick correct term |
| **Term match** | "What does [term] mean?" + 4 choices | Show term → pick correct definition |
| **Scenario match** | Read scenario → which term applies? | Show scenario → pick term |
| **Fill the blank** | "In a meeting, you'd call this a ___" | Show conversation quote with blank |

**Components to create:**
- `packages/frontend/src/components/sections/QuizSession.jsx` — orchestrates quiz flow
- `packages/frontend/src/components/quiz/QuizCard.jsx` — single question card
- `packages/frontend/src/components/quiz/QuizSummary.jsx` — end-of-quiz results

### 2.2 Quiz Generation Logic

New file: `packages/frontend/src/utils/quizGenerator.js`

```
generateQuiz(terms, completedTerms, reviewSchedule, count = 10):
  1. Pull 60% from due/completed terms (review), 40% new terms (discovery)
  2. For each term, randomly pick question type
  3. Generate 3 wrong answers from same category (plausible distractors)
  4. Shuffle answer order
  5. Return array of { question, answers[], correctIndex, termName, type }
```

### 2.3 Quiz → Review Integration

Quiz results feed directly into the spaced repetition engine:
- Correct answer on first try → quality 4 (Good)
- Correct after hesitation (>5s) → quality 3 (Hard)
- Wrong answer → quality 1 (Forgot), show the correct card briefly

**Files to modify:**
- [useProgress.js](packages/frontend/src/hooks/useProgress.js) — `recordQuizResult(termName, correct, hesitated)`
- [App.jsx](packages/frontend/src/App.jsx) — add `/quiz` route

### 2.4 Daily Quiz Prompt

On the home page, for logged-in users, replace or augment `TermOfTheDay` with a **Daily Quiz CTA**:

```
"Your daily quiz is ready"
"10 questions · 3 minutes · 4 due for review"
[Start Quiz]
```

**Files to modify:**
- [App.jsx](packages/frontend/src/App.jsx) — add `DailyQuizCta` component to home page (logged-in only)

---

## Phase 3: Role-Based Onboarding + Learning Paths (Personalisation)

**Why third:** Makes every user feel "this was made for me" instead of drowning in 42 categories.

**Time estimate: ~1 week**

### 3.1 Onboarding Flow

New overlay component shown on first visit (before any other content):

**Components to create:**
- `packages/frontend/src/components/overlays/OnboardingModal.jsx`

**Flow (3 screens, ~30 seconds):**

**Screen 1 — "What's your role?"**
```
[ Designer ]  [ Product Manager ]  [ Developer ]
[ Marketer ]  [ Founder / Business ]  [ Career Switcher ]
[ Student ]   [ Just Curious ]
```

**Screen 2 — "What's your experience level?"**
```
[ New to the field ]  [ 1-3 years ]  [ 3+ years ]
```

**Screen 3 — "Your learning path is ready"**
```
Based on your profile, we recommend starting with:
→ [Personalised Path Name] (15 terms)

[Start Learning]  or  [Browse all categories]
```

**Storage:**
- Firestore: `users/{uid}` → `{ role, experienceLevel, onboardingComplete }`
- Guest: localStorage `wv_guest_profile`

### 3.2 Learning Paths

New data file: `packages/frontend/src/data/learningPaths.js`

**Curated paths (hand-picked term sequences):**

| Path | Terms | Target |
|------|-------|--------|
| Design Foundations | 20 | New designers, career switchers |
| UX Research Essentials | 15 | Designers, PMs |
| Product Management 101 | 20 | New PMs, founders |
| Developer's Business Vocab | 15 | Engineers crossing into product |
| Startup Essentials | 20 | Founders, early employees |
| Marketing for Builders | 15 | Product people learning growth |
| AI Literacy | 15 | Anyone new to AI/ML |
| The Full Toolkit | 30 | Ambitious learners, career switchers |

Each path is an ordered array of term names with a description, estimated time, and difficulty.

### 3.3 Path Progress UI

New route: `/paths` (index) and `/paths/:pathSlug` (single path)

**Components to create:**
- `packages/frontend/src/components/sections/PathsIndex.jsx` — grid of available paths
- `packages/frontend/src/components/sections/PathDetail.jsx` — single path with ordered term list + progress

**Path detail shows:**
- Path description + "why this path"
- Ordered term list (numbered, not just alphabetical)
- Progress bar (X of 20 completed)
- "Continue" button (opens next incomplete term in review mode)
- Completion celebration when path is done

**Files to modify:**
- [App.jsx](packages/frontend/src/App.jsx) — add `/paths` and `/paths/:slug` routes
- [SiteNav.jsx](packages/frontend/src/components/layout/SiteNav.jsx) — add "Paths" nav link
- Home page — show recommended path based on onboarding profile

---

## Phase 4: Flip the Paywall (Free Content, Paid System)

**Why fourth:** Removing the content gate lets people fall in love. Monetise the learning system, not the glossary.

**Time estimate: ~3 days**

### 4.1 Remove View Limit on Content

Make all 490 terms readable by everyone. No 9-card limit.

**Files to modify:**
- [useProgress.js](packages/frontend/src/hooks/useProgress.js) — remove `FREE_VIEW_LIMIT`, `viewLimitReachedAt`, `RESET_DAYS` logic
- [FlashcardModal.jsx](packages/frontend/src/components/overlays/FlashcardModal.jsx) — remove locked/blurred card state
- [termLookup.js](packages/frontend/src/utils/termLookup.js) — remove `FREE_TERMS`, `isTermLocked`
- [CtaSection.jsx](packages/frontend/src/components/sections/CtaSection.jsx) — update CTA copy

### 4.2 New Pro Feature Gates

Instead of locking content, lock the learning system:

| Feature | Free | Pro |
|---------|------|-----|
| Browse all 490 terms | Yes | Yes |
| Mark terms complete | Yes (up to 30) | Unlimited |
| Spaced repetition | No (teaser: "Unlock smart reviews") | Yes |
| Daily quiz | 1 free quiz/day (5 questions) | Unlimited (10-20 questions) |
| Learning paths | Preview first 3 terms | Full path |
| Streak tracking | Basic (current streak only) | Full (longest, milestones, calendar) |
| Progress analytics | Basic % | Detailed (by category, time, mastery level) |

**Files to modify:**
- [useProgress.js](packages/frontend/src/hooks/useProgress.js) — add free-tier caps (30 completions, 1 quiz/day)
- [ReviewSession.jsx](packages/frontend/src/components/sections/ReviewSession.jsx) — gate behind Pro
- [QuizSession.jsx](packages/frontend/src/components/sections/QuizSession.jsx) — limit free to 1/day, 5 questions
- [PathDetail.jsx](packages/frontend/src/components/sections/PathDetail.jsx) — preview mode for free users

### 4.3 Upgrade Prompts (Contextual, Not Annoying)

Show upgrade nudges at moments of maximum motivation:
- After completing daily free quiz: "Want more? Unlock unlimited quizzes."
- After hitting 30 completions: "You're on a roll. Unlock unlimited progress tracking."
- After viewing a learning path preview: "Continue this path with Pro."
- On review page (free): "Smart reviews remember what you forget. Unlock for $X/mo."

New component: `packages/frontend/src/components/ui/UpgradeNudge.jsx` — reusable contextual CTA

---

## Phase 5: Shareable Moments + Social Proof (Growth)

**Why fifth:** Turns users into your marketing channel. Your audience (designers, PMs) lives on LinkedIn and Twitter.

**Time estimate: ~4 days**

### 5.1 Achievement Cards (Shareable Images)

Generate shareable image cards for milestones:

**Triggers:**
- Completed a learning path
- 7-day streak
- 30-day streak
- 100 terms learned
- Completed a domain (e.g., all Product Design terms)

**Components to create:**
- `packages/frontend/src/components/ui/ShareCard.jsx` — renders a styled card in a hidden canvas
- Uses `html2canvas` or a `<canvas>` API to generate a downloadable PNG

**Card design:**
```
┌─────────────────────────────┐
│  🎯 I just completed        │
│  "Design Foundations"        │
│  20 terms in 5 days          │
│                              │
│  workplacevocab.com          │
│  Learn the language of work  │
└─────────────────────────────┘
```

**Share options:** Download image, copy link, share to LinkedIn/Twitter (pre-filled text + image).

### 5.2 Public Profile (Optional)

New route: `/u/:username`

Light public page showing:
- Display name + role (from onboarding)
- Terms learned count
- Current streak
- Completed paths
- "Join me on Workplace Vocab" CTA

**Storage:** Firestore `users/{uid}` → `{ publicProfile: true, username }`

**Files to create:**
- `packages/frontend/src/components/sections/PublicProfile.jsx`

### 5.3 Social Proof on Landing Page

Add to the home page (below hero, above categories):

```
"Join 1,200+ designers and PMs learning the language of work"
[Avatar] [Avatar] [Avatar] + 1,197 others
```

Even before real numbers, show:
- Total terms in the system (490+)
- Domains covered (8)
- A few testimonial quotes (collect from early users)

**Files to modify:**
- [App.jsx](packages/frontend/src/App.jsx) — add `SocialProofStrip` component

---

## Phase 6: Notifications + Habit Formation (Retention)

**Why sixth:** Without pokes, even great products get forgotten. This closes the loop.

**Time estimate: ~4 days**

### 6.1 Email Reminders (Firebase Extensions or Simple SMTP)

Use Firebase Extensions "Trigger Email" or a simple Nodemailer setup on the backend.

**Email triggers:**

| Email | When | Content |
|-------|------|---------|
| Daily review reminder | 9am if cards are due | "You have 7 cards to review today" |
| Streak at risk | 8pm if no activity today AND streak > 3 | "Don't lose your 12-day streak!" |
| Weekly summary | Monday 9am | "Last week: 15 terms, 5-day streak, 82% quiz accuracy" |
| Path milestone | On path completion | "You completed Design Foundations!" |
| Win-back | 7 days inactive | "Your reviews are piling up. 23 cards due." |

**User preferences** (new Firestore field):
```javascript
users/{uid}: {
  emailPrefs: {
    dailyReminder: boolean,    // default true
    streakReminder: boolean,   // default true
    weeklySummary: boolean,    // default true
    marketing: boolean         // default false
  }
}
```

### 6.2 Push Notifications (PWA)

Register a service worker for push notifications via Firebase Cloud Messaging.

**Files to create:**
- `packages/frontend/public/sw.js` — service worker
- `packages/frontend/src/utils/pushNotifications.js` — registration + permission request

**Notification triggers:** Same as email (daily review, streak risk) but shorter copy.

### 6.3 PWA: Installable + Offline

Make the app installable on mobile home screens.

**Files to create/modify:**
- `packages/frontend/public/manifest.json` — app manifest (name, icons, theme colour, display: standalone)
- `packages/frontend/public/sw.js` — cache static assets + term data for offline browsing
- `packages/frontend/index.html` — link manifest, add meta tags for iOS

**Offline behaviour:**
- All 490 terms cached locally (they're already in a JS bundle)
- Review/quiz works offline, syncs results when back online
- "You're offline" banner when disconnected

---

## Phase 7: Team Plans (B2B Revenue)

**Why last:** This is where real revenue lives, but it requires the learning system to be proven first.

**Time estimate: ~2 weeks (requires backend)**

### 7.1 Team/Org Model

**Requires backend (Phase 2 migration).** Extend Prisma schema:

```prisma
model Organisation {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  plan      OrgPlan  @default(TEAM)
  seats     Int      @default(10)
  members   OrgMember[]
  createdAt DateTime @default(now())
}

model OrgMember {
  id        String       @id @default(cuid())
  org       Organisation @relation(fields: [orgId], references: [id])
  orgId     String
  user      User         @relation(fields: [userId], references: [id])
  userId    String
  role      OrgRole      @default(MEMBER)

  @@unique([orgId, userId])
}

enum OrgPlan { TEAM, ENTERPRISE }
enum OrgRole { OWNER, ADMIN, MEMBER }
```

### 7.2 Team Dashboard

New route: `/team`

- Member list with progress stats
- Assigned learning paths per member
- Team leaderboard (opt-in)
- Admin: invite members via email link
- Bulk assign paths: "All new hires do 'Product Management 101'"

### 7.3 Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | All content, basic tracking, 1 quiz/day |
| Pro | $8/mo or $60/yr | Full learning system, unlimited everything |
| Team | $6/seat/mo | Pro + team dashboard, assigned paths, leaderboard |
| Enterprise | Custom | SSO, API, custom content, analytics export |

---

## Implementation Order + Dependencies

```
Phase 1: Spaced Repetition ← foundation for everything
  │
  ├── Phase 2: Daily Quiz (depends on review schedule data)
  │
  ├── Phase 3: Onboarding + Paths (independent, can parallel with Phase 2)
  │
  └── Phase 4: Flip Paywall (depends on Phases 1-3 existing as Pro features)
        │
        ├── Phase 5: Sharing + Social (depends on achievements from Phases 1-3)
        │
        ├── Phase 6: Notifications + PWA (depends on review system from Phase 1)
        │
        └── Phase 7: Teams (depends on everything + backend migration)
```

**What can be parallelised:**
- Phases 2 + 3 can be built simultaneously
- Phase 5 (sharing) can start as soon as Phase 1 ships
- Phase 6 (PWA/notifications) is independent of Phases 3-5

---

## New Files Summary

| File | Phase | Purpose |
|------|-------|---------|
| `src/utils/spacedRepetition.js` | 1 | SM-2 algorithm |
| `src/components/sections/ReviewSession.jsx` | 1 | Review session page |
| `src/utils/quizGenerator.js` | 2 | Quiz question generation |
| `src/components/sections/QuizSession.jsx` | 2 | Quiz page |
| `src/components/quiz/QuizCard.jsx` | 2 | Single quiz question |
| `src/components/quiz/QuizSummary.jsx` | 2 | End-of-quiz results |
| `src/components/overlays/OnboardingModal.jsx` | 3 | First-visit onboarding |
| `src/data/learningPaths.js` | 3 | Curated path definitions |
| `src/components/sections/PathsIndex.jsx` | 3 | Paths grid page |
| `src/components/sections/PathDetail.jsx` | 3 | Single path page |
| `src/components/ui/UpgradeNudge.jsx` | 4 | Contextual upgrade CTA |
| `src/components/ui/ShareCard.jsx` | 5 | Shareable achievement image |
| `src/components/sections/PublicProfile.jsx` | 5 | Public user page |
| `public/manifest.json` | 6 | PWA manifest |
| `public/sw.js` | 6 | Service worker |
| `src/utils/pushNotifications.js` | 6 | Push notification helpers |

## Existing Files Modified

| File | Phases | Changes |
|------|--------|---------|
| `useProgress.js` | 1, 2, 4 | Review schedule, quiz results, remove view limit, free-tier caps |
| `FlashcardModal.jsx` | 1, 4 | Review rating buttons, remove locked state |
| `App.jsx` | 1, 2, 3, 5 | New routes: /review, /quiz, /paths, /u/:username |
| `SiteNav.jsx` | 1, 3 | Review badge, Paths link |
| `termLookup.js` | 4 | Remove free term gating |
| `CtaSection.jsx` | 4 | Updated copy for new model |
| `AuthContext.jsx` | 3, 6 | User profile fields, email prefs |

---

## Success Metrics

| Metric | Current (estimated) | Target (6 months) |
|--------|--------------------|--------------------|
| Daily active users | — | 500+ |
| Day-7 retention | ~5% | 30%+ |
| Day-30 retention | ~1% | 15%+ |
| Cards reviewed/day/user | 0 (browse only) | 10+ |
| Pro conversion | — | 5% of active users |
| Avg session length | ~2 min | 5+ min |
| Streak > 7 days | — | 20% of logged-in users |

---

## What NOT to Build

- **Multiplayer/real-time features** — complexity not worth it yet
- **User-generated content** — curated quality is the moat
- **AI-generated explanations** — hand-written content is the differentiator
- **Gamification beyond streaks/quizzes** — XP, levels, badges add complexity without learning value
- **Native mobile apps** — PWA covers 90% of the need, at 10% of the cost
- **Admin CMS** — edit `words.js` directly until you have 1000+ terms
