# Content Guide — Adding and Editing Terms

This document is written for anyone editing vocabulary content — no coding experience required.

---

## Where the content lives

All vocabulary terms are in one file:

```
packages/frontend/src/data/words.js
```

All categories are in:

```
packages/frontend/src/data/categories.js
```

---

## Term object shape

Each term looks like this:

```js
{
  term:         "Cognitive Load",
  category:     "Design Methodologies",
  level:        "Intermediate",
  definition:   "The total mental effort required to process information...",
  whyItMatters: "Every decision a user makes costs mental energy...",
  example:      "\"We've added too many options to this screen — the cognitive load is going to slow people down.\"",
  related:      ["Mental model", "Affordance", "Gestalt principles", "Progressive disclosure"],
}
```

### Field guide

| Field | What to write | Rules |
|---|---|---|
| `term` | The exact term name | Title case. Must be unique. |
| `category` | The category this term belongs to | Must exactly match a `name` value in `categories.js` |
| `level` | Difficulty level | Must be exactly `"Beginner"`, `"Intermediate"`, or `"Advanced"` |
| `definition` | What the term means | 2–4 sentences. Plain English. No jargon without explanation. |
| `whyItMatters` | Why a product professional should know this | 2–4 sentences. Practical, professional angle. |
| `example` | The term used in a real conversation | Start with a quote. Keep it concrete and believable. |
| `related` | Other terms this connects to | Array of term names. They don't all have to exist in the data — unmatched terms are shown as dimmed chips. |

---

## Adding a new term

1. Open `packages/frontend/src/data/words.js`
2. Find the section for the correct category (e.g. `// ── RESEARCH`)
3. Copy an existing term block and paste it at the end of that section
4. Fill in all fields — every field is required
5. Save the file

The term will appear automatically in the app. If you add it to `FEATURED_TERMS` in `packages/frontend/src/data/featured.js`, it will also appear in the flashcard grid on the homepage.

---

## Adding a new category

1. Open `packages/frontend/src/data/categories.js`
2. Add a new object to the `CATEGORIES` array:

```js
{
  id:          "my-category",        // URL-safe, lowercase, hyphenated
  name:        "My Category",        // Display name — must match term.category values exactly
  domain:      "Product Design",     // "Product Design" | "Engineering" | "Business" | "Marketing"
  count:       0,                    // Update this as you add terms
  color:       "#F0FDF4",            // Light background hex for icons
  accent:      "#22C55E",            // Accent colour hex
  icon:        "🆕",                 // Emoji icon
  description: "Short description shown on the category card",
}
```

3. Add terms to `words.js` using the exact `name` value as the `category` field.

---

## Updating the featured flashcards

Edit the `FEATURED_TERMS` array in `packages/frontend/src/data/featured.js`:

```js
const FEATURED_TERMS = [
  "Cognitive Load",
  "Affinity Map",
  // add or swap terms here
];
```

Only terms that exist in `words.js` will appear. Unmatched names are silently ignored.

---

## Content guidelines

- **Australian English** spelling throughout (behaviour, colour, organise, recognise)
- Definitions should explain the term to someone who has never heard it
- `whyItMatters` should explain the professional value — what goes wrong without understanding this term?
- Examples should be quotable — imagine a real meeting room sentence
- Avoid circular definitions (don't define "affordance" using the word "affordance")
