# Writing & Development Plan: Copy Readability Rewrite
### Based on COPY-READABILITY-REPORT.md

---

## Scope at a glance

| Content | Count | Needs editing |
|---------|-------|---------------|
| Term definitions | 490 | ~490 (plain-language first sentence) |
| Em dashes in term copy | 233 | All 233 |
| Em dashes in About page | 12 | All 12 |
| Em dashes in other UI components | 5 | All 5 |
| Psychology sections | 109 | ~109 (tighten to 2 sentences) |
| Scenarios starting with "A team..." | 182 | ~182 (lead with situation) |
| "In real conversation" quotes | 490 | ~50 (only the stiff-sounding ones) |
| About page sections | 5 | 3 (Who it's for, What you'll find, Why it exists) |
| Card Writing Guidelines | 1 file | Update to reflect new rules |

---

## Phase 0: Prep (before any writing)

**Goal:** Set the rules, update the style guide, and create a quality checklist so every rewrite is consistent.

### 0.1 Update CARD-WRITING-GUIDELINES.md

Add the following rules derived from the report:

**Definition rules (new):**
- First sentence must be plain language a non-expert can repeat back. No parenthetical lists, no technical framing.
- Second sentence adds precision, specifics, or domain context.
- Maximum 2 sentences. If a third is needed, move the information to whyItMatters.

**WhyItMatters rules (new):**
- Must not restate the definition. Open with tension, reframe, consequence, or a concrete image.
- If the first sentence could be swapped with the definition's first sentence and still make sense, rewrite it.

**Scenario rules (update):**
- Do not open with "A team", "A product team", "A design team", or "A startup". Lead with the artefact, the situation, or the problem.
- Acceptable openers: the product, the page, the form, the dashboard, the flow, a specific object in the story.

**Psychology rules (update):**
- Maximum 2 sentences. Name the principle in the first sentence. Connect it to the term in the second.
- End with a bold **Design implication:** line (one sentence, actionable).

**Em dash rule (reinforce):**
- Zero tolerance. No em dashes ( — ) anywhere. Replace with a period (two sentences), a comma, or restructure.

**Conversation example rules (new):**
- Should sound like something said mid-meeting, not rehearsed. Questions are good. Reasons are good. Presentation-speak is not.
- Test: would someone actually pause a stand-up to say this sentence out loud?

### 0.2 Create a rewrite checklist

For each term, the writer (or AI assistant) checks:

- [ ] Definition opens with a plain first sentence
- [ ] No parenthetical lists in definition
- [ ] WhyItMatters does not restate the definition
- [ ] Scenario does not open with "A team..."
- [ ] No em dashes anywhere in the card
- [ ] Psychology is 2 sentences max + design implication line
- [ ] Conversation example sounds natural (not rehearsed)
- [ ] British English spelling throughout

### 0.3 Set up a tracking system

Create a simple spreadsheet or checklist with all 490 terms grouped by domain. Columns:
- Term name
- Domain / Category
- Definition rewritten (yes/no)
- Em dashes removed (yes/no)
- Scenario rewritten (yes/no)
- Psychology tightened (yes/no)
- QA pass (yes/no)

---

## Phase 1: About page & UI copy (1 session)

**Goal:** Fix all user-facing marketing and navigation copy first. This is the highest-visibility, lowest-volume work.

**Files touched:**
- `packages/frontend/src/components/sections/AboutPage.jsx`
- `packages/frontend/src/components/sections/HeroSection.jsx`
- `packages/frontend/src/components/sections/CtaSection.jsx`
- `packages/frontend/src/components/overlays/LoginModal.jsx`

### 1.1 About page rewrites

| Section | Change |
|---------|--------|
| Hero intro (3 paragraphs) | Remove all em dashes. Replace with periods or commas. |
| "Why it exists" | Remove em dashes. Tighten opening. |
| "Who it's for" | Break single paragraph into 4 separate `<p>` tags, one per persona. Remove "Or" / "Maybe" connectors. Remove em dash. |
| "What you'll find here" | Convert card-structure paragraph into a structured list with bold labels: **A plain-language definition**, **Why it matters**, **A real scenario**, **Related terms**. |
| "Who built this" | Remove em dashes. Minor tightening only. The personal voice is strong. |
| CTA section | Remove em dash from supporting copy. |

### 1.2 Hero section

| Element | Current | Revised |
|---------|---------|---------|
| Subheading | "Learn the language of design, product, and business — one term at a time." | "Learn the language of design, product, and business. One term at a time." |

### 1.3 CTA section

| Element | Current | Revised |
|---------|---------|---------|
| Description | "Built for designers, product managers, developers, and anyone who works in product — at any stage of their career." | "Built for designers, product managers, developers, and anyone who works in product, at any stage of their career." |

### 1.4 Login modal

Review and remove any em dashes. Current copy is already clean and concise.

### Deliverable
All About page and UI component copy is em-dash-free, scannable, and follows the revised guidelines. Commit and review before moving to term cards.

---

## Phase 2: Em dash sweep across all 490 terms (1-2 sessions)

**Goal:** Remove all 233 em dashes from `words.js`. This is the single highest-volume, lowest-decision task, and it creates the most consistency.

### Approach

Work through `words.js` systematically by category section. For each em dash:

1. **If connecting two independent clauses:** Split into two sentences with a period.
2. **If adding a parenthetical aside:** Replace with a comma or restructure.
3. **If creating emphasis:** Use a period and let the second sentence stand alone.

### Batch strategy

Process by domain to maintain voice consistency within each domain:

| Batch | Domain | Approx. terms | Em dashes (est.) |
|-------|--------|---------------|-----------------|
| 2a | Product Design | ~149 | ~70 |
| 2b | Engineering | ~40 | ~20 |
| 2c | Business | ~60 | ~30 |
| 2d | Marketing | ~38 | ~18 |
| 2e | Finance | ~29 | ~14 |
| 2f | Legal | ~28 | ~13 |
| 2g | AI & Machine Learning | ~66 | ~32 |
| 2h | Psychology | ~80 | ~36 |

### QA check
After each batch, run: `grep ' — ' packages/frontend/src/data/words.js | wc -l`
Target: 0.

### Deliverable
Zero em dashes in `words.js`. Commit per domain batch so changes are reviewable.

---

## Phase 3: Definition rewrites (3-5 sessions)

**Goal:** Rewrite the first sentence of every definition to be plain language. This is the highest-impact change for readability and requires the most editorial judgement.

### Rules for the rewrite

1. Read the current definition.
2. Write a new first sentence that a non-expert could repeat to a colleague.
3. Move technical precision to the second sentence.
4. Remove parenthetical lists. Integrate examples naturally or move them.
5. Keep to 2 sentences maximum.

### Batch strategy

Work by domain. Within each domain, start with Beginner terms (easiest to calibrate the voice), then Intermediate, then Advanced.

| Batch | Domain | Terms | Priority |
|-------|--------|-------|----------|
| 3a | Product Design (Beginner) | ~50 | First |
| 3b | Product Design (Intermediate) | ~60 | Second |
| 3c | Product Design (Advanced) | ~39 | Third |
| 3d | Engineering | ~40 | Fourth |
| 3e | Business | ~60 | Fifth |
| 3f | Marketing | ~38 | Sixth |
| 3g | Finance | ~29 | Seventh |
| 3h | Legal | ~28 | Eighth |
| 3i | AI & Machine Learning | ~66 | Ninth |
| 3j | Psychology | ~80 | Tenth |

### Quality gate

After completing each domain, review 5 random terms against the checklist:
- Can someone repeat the first sentence from memory?
- Does the second sentence add precision without repeating the first?
- Are there any parenthetical lists?

### Deliverable
All 490 definitions open with a plain first sentence. Commit per domain.

---

## Phase 4: WhyItMatters deduplication (2-3 sessions)

**Goal:** Ensure no whyItMatters section restates the definition. Each one should open with tension, consequence, or a reframe.

### Approach

For each term:
1. Read the definition and the whyItMatters back to back.
2. If the whyItMatters opens by restating what the thing is, rewrite the opening sentence.
3. Good openers: "Without this...", "The gap between X and Y is where...", "Teams that skip this...", a concrete image, a contrast.

### Batch strategy
Same domain-by-domain order as Phase 3. Can be combined with Phase 3 if working through each term holistically, but tracked separately.

### Deliverable
All 490 whyItMatters sections open with a distinct angle from their definition. Commit per domain.

---

## Phase 5: Scenario rewrites (2-3 sessions)

**Goal:** Rewrite the ~182 scenarios that open with "A team..." to lead with the situation, artefact, or problem instead.

### Rules for the rewrite

1. Identify the object in the story (the form, the page, the dashboard, the flow, the notification system).
2. Open with that object or the situation it creates.
3. Keep the team as a character in the story, just not the first word.
4. Do not change scenarios that already lead with the artefact (e.g., "A registration form with fifteen fields...").

### Examples of the pattern

| Current opener | Revised opener |
|---------------|---------------|
| "A product team used red..." | "The notification system used red..." |
| "A team was focused on optimising..." | "The onboarding flow was the team's focus..." |
| "A product FAQ page listed 22 questions..." | "Twenty-two FAQ answers stacked in a single scroll." |
| "A redesigned settings page replaced..." | "The settings page redesign replaced..." |

### Batch strategy
Same domain order. Focus on the 182 that match the "A team" pattern.

### Deliverable
No scenario opens with "A team", "A product team", "A design team", or "A startup". Commit per domain.

---

## Phase 6: Psychology section tightening (1-2 sessions)

**Goal:** Tighten all 109 psychology sections to 2 sentences maximum, plus add a bold **Design implication** line.

### Rules

1. First sentence names the principle and defines it briefly.
2. Second sentence connects it to the term.
3. Third line is bold: **Design implication:** followed by one actionable sentence.
4. If the current section is already 2 sentences, just add the design implication line.

### Batch strategy
All 109 psychology sections, processed by domain.

### Data model update
The `psychology` field in `words.js` will now contain the design implication as part of the string. Format:

```
"Principle Name describes X. This connects to the term because Y.\n\n**Design implication:** Actionable sentence."
```

Verify the TermPanel component renders markdown/bold in the psychology section. If it doesn't, this requires a small frontend change to support bold text rendering in psychology sections.

### Frontend check
- File: `packages/frontend/src/components/overlays/TermPanel.jsx` (or equivalent)
- Confirm psychology text renders with basic markdown support (bold at minimum)
- If not, add a lightweight markdown renderer or simple bold-text parser for the psychology field

### Deliverable
All 109 psychology sections are 2 sentences + design implication. Frontend renders bold text. Commit.

---

## Phase 7: Conversation example polish (1 session)

**Goal:** Review all 490 "In real conversation" examples and fix the ones that sound rehearsed.

### Triage approach

Not all 490 need rewriting. Scan for patterns that signal stiffness:
- Sentences longer than 25 words
- No question marks anywhere (real conversations include questions)
- Opening with "Before we..." (planning-speak, not conversation)
- Complex subordinate clauses ("...so that we can ensure that...")

Estimate: ~50-80 will need rewriting. The rest are already natural.

### Rules for rewrites

1. Shorter is better. Under 20 words is ideal.
2. Questions are natural. Use them.
3. Include a reason when it reveals thinking ("I don't want to prioritise based on gut feel").
4. Test: would someone interrupt a stand-up to say this? If not, it's too formal.

### Deliverable
All conversation examples pass the "would someone actually say this?" test. Commit.

---

## Phase 8: About page structural changes (1 session)

**Goal:** Implement the structural improvements from the report that go beyond copy edits.

### 8.1 "Who it's for" section

Convert the single `<p>` block into 4 separate `<p>` elements:

```jsx
<p>You just landed your first role on a product team and stand-ups feel like a foreign language.</p>
<p>You're a marketer suddenly working with engineers, and half the words in their Jira tickets might as well be in code.</p>
<p>You're running a startup and want to talk to every part of your team without sounding like you're bluffing.</p>
<p>You've switched industries and you're rebuilding your vocabulary from scratch, even with ten years of experience.</p>
```

### 8.2 "What you'll find here" section

Replace the prose paragraph with a structured list:

```jsx
<p>Each term goes deeper than a one-liner:</p>
<p><strong>A plain-language definition</strong> so you understand the concept immediately.</p>
<p><strong>Why it matters</strong> so you know when and where it applies.</p>
<p><strong>A real scenario</strong> so you can see it in context.</p>
<p><strong>Related terms</strong> so ideas connect instead of sitting in a list.</p>
```

### Deliverable
About page structural changes live. Commit.

---

## Phase 9: Final QA & style guide lock (1 session)

### 9.1 Automated checks

Run these validation checks across the full `words.js`:

```bash
# Em dash count (target: 0)
grep -c ' — ' packages/frontend/src/data/words.js

# Scenarios starting with "A team" (target: 0)
grep -c '"A team\|"A product team\|"A design team\|"A startup' packages/frontend/src/data/words.js

# Psychology sections longer than 3 sentences (target: 0)
# Manual spot-check required
```

### 9.2 Manual spot-check

Pick 5 random terms from each domain (40 total). For each, verify:
- [ ] Definition first sentence is plain language
- [ ] WhyItMatters does not restate definition
- [ ] Scenario leads with situation/artefact
- [ ] Psychology is 2 sentences + design implication
- [ ] Conversation example sounds natural
- [ ] No em dashes
- [ ] British English spelling

### 9.3 Update CARD-WRITING-GUIDELINES.md

Finalise the style guide with all new rules from Phase 0. This becomes the reference for all future term additions.

### 9.4 Update card-writing-guide.md (if separate)

Ensure both documentation files are in sync and reflect the same rules.

### Deliverable
Full QA pass complete. Style guide locked. All documentation updated.

---

## Phase sequence and dependencies

```
Phase 0 ──→ Phase 1 ──→ Phase 2 ──────────────────────────────┐
  (prep)     (about)     (em dashes)                           │
                                                                ▼
             Phase 3 ──→ Phase 4 ──→ Phase 5 ──→ Phase 6 ──→ Phase 7
             (defs)      (why)       (scenarios)  (psych)     (quotes)
                                                                │
                                                                ▼
                                                  Phase 8 ──→ Phase 9
                                                  (about       (QA)
                                                   structure)
```

**Phase 0** must come first (sets the rules).
**Phase 1** is independent and quick (About page).
**Phase 2** (em dashes) can run in parallel with Phase 1.
**Phases 3-7** are the bulk of the work and should be done in order per domain. Within a single domain, a writer can process all 5 changes per term in one pass.
**Phase 8** is independent (structural JSX changes).
**Phase 9** comes last (validation).

---

## Recommended working approach

### Option A: Per-term (recommended)

Instead of doing all definitions, then all whyItMatters, then all scenarios in separate sweeps, **process each term once and apply all changes in a single pass.** This means for each term you:

1. Rewrite the definition opening
2. Remove em dashes
3. Check whyItMatters for restatement
4. Rewrite scenario opening if needed
5. Tighten psychology section if present
6. Check conversation example

This is more efficient and produces more consistent results because you see the full card in context.

### Batch size

Process one category at a time (5-20 terms). Commit after each category. This keeps changes reviewable and progress trackable.

### Per-domain session plan (Option A)

| Session | Domain | Categories | Terms | Estimated work |
|---------|--------|------------|-------|----------------|
| 1 | Prep + About page + UI | Style guide + 4 component files | ~17 em dashes | Light |
| 2 | Product Design: Research, Design Methodologies | 2 categories | ~25 terms | Medium |
| 3 | Product Design: UI Elements, Colours, Typography | 3 categories | ~91 terms | Heavy |
| 4 | Product Design: remaining categories | 7 categories | ~33 terms | Medium |
| 5 | Engineering | 2 categories | ~40 terms | Medium |
| 6 | Business | 3 categories | ~60 terms | Heavy |
| 7 | Marketing | 4 categories | ~38 terms | Medium |
| 8 | Finance + Legal | 6 categories | ~57 terms | Medium |
| 9 | AI & Machine Learning | 5 categories | ~66 terms | Heavy |
| 10 | Psychology | 9 categories | ~80 terms | Heavy |
| 11 | QA + style guide finalisation | All | — | Light |

---

## Success criteria

When this plan is complete:

1. **Zero em dashes** in any user-facing copy (words.js, About page, UI components)
2. **Every definition** opens with a sentence a non-expert can repeat
3. **No whyItMatters section** restates its definition
4. **No scenario** opens with "A team..."
5. **All 109 psychology sections** are 2 sentences + design implication
6. **About page** uses scannable structure (one persona per line, feature list format)
7. **CARD-WRITING-GUIDELINES.md** reflects all new rules
8. **All future terms** written against the updated guidelines

---

*Plan created 30 March 2026*
*Companion to: COPY-READABILITY-REPORT.md*
