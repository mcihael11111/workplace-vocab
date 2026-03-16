# Card Writing Guidelines — Workplace Vocab

These guidelines ensure every term card in the Workplace Vocab app is consistent in voice, depth, and educational value.

---

## Card Structure

Every term object has these fields:

```js
{
  term: "Term Name",           // Title-case, the canonical name
  category: "Category Name",   // Must match a CATEGORIES entry
  level: "Beginner",           // Beginner | Intermediate | Advanced
  definition: "...",           // What it is
  whyItMatters: "...",         // Why someone should care
  scenario: "...",             // A concrete story showing the concept in action
  example: "\"...\"",          // A sentence someone might say in a real workplace
  related: ["Term A", "Term B", "Term C", "Term D"]  // 3–5 related terms
}
```

---

## Level Criteria

| Level | Who it's for | Guideline |
|-------|-------------|-----------|
| **Beginner** | Someone in their first 1–2 years in a product/design/dev role | The term is common, frequently heard in meetings or documentation. A new hire would encounter it in their first month. |
| **Intermediate** | Someone with 2–5 years of experience | The term requires context to understand well. You might hear it but not fully grasp its implications without experience. |
| **Advanced** | Senior practitioners, specialists | The term is niche, strategic, or requires deep domain knowledge. Used in specialised discussions or leadership contexts. |

---

## Writing Rules

### Definition
- **1–3 sentences.** Start with what it is, not what it isn't.
- Avoid jargon in the definition itself — if you must reference another term, make sure it's in `related`.
- Be precise. Don't pad with filler. Every word should earn its place.
- Use British English spelling (organisation, colour, behaviour, prioritise).

### Why It Matters
- **2–4 sentences.** Explain the real-world consequence of understanding (or not understanding) this concept.
- Speak to the reader as a practitioner, not a student. Assume they work in a product team.
- Avoid generic statements like "This is important for any designer." Say *why* it's important and what goes wrong without it.

### Scenario
- **3–6 sentences.** Tell a short, concrete story.
- Use a realistic workplace situation — a team, a product, a launch, a meeting.
- Show the concept in action, not just its definition restated. The scenario should demonstrate *consequence* — what happened because of (or in absence of) this concept.
- Never use fictional brand names. Keep it generic: "a team", "a SaaS product", "a fintech company".
- Write in past tense.

### Example (spoken quote)
- **1 sentence in double quotes.** Something a person might actually say in a meeting, Slack message, or presentation.
- Should sound natural — not textbook. Imagine a PM, designer, or lead saying it.
- Wrap the entire value in escaped quotes: `"\"The sentence here.\""`.

### Related Terms
- **3–5 terms.** Must be exact `term` strings from other cards in the dataset.
- Prioritise terms the reader would naturally want to explore next.
- Mix categories where possible — cross-linking between categories is valuable.

---

## Voice & Tone

- **Authoritative but approachable.** Write like a senior colleague explaining something over coffee, not a textbook.
- **No fluff.** Cut "basically", "essentially", "in other words", "simply put".
- **No hedging.** Don't say "can sometimes be useful" — say what it does and why it matters.
- **Concrete over abstract.** Prefer specific examples over general principles.
- **British English.** Organisation, colour, behaviour, favour, analyse, prioritise.

---

## Formatting Conventions

- Use straight quotes `"` not curly quotes.
- No trailing commas after the last property in an object.
- Each term object starts on its own line with 2-space indentation.
- Properties are indented 4 spaces from the opening brace.
- `related` arrays go on a single line.
- Section comment headers use the format: `// ── CATEGORY NAME (count) ──────...`

---

## Category Object Structure

Each category in the `CATEGORIES` array:

```js
{
  id: "kebab-case-id",
  name: "Display Name",
  domain: "Domain Name",       // Product Design | Engineering | Business | Marketing | Strategy | Operations
  count: 10,                   // Number of terms in this category
  color: "#F0F9FF",            // Light background colour (pastel)
  accent: "#0EA5E9",           // Bold accent colour for badges/borders
  icon: "📈",                  // Emoji icon (or Lucide icon name if migrated)
  description: "Short phrase listing 4–5 key terms in the category"
}
```

---

## Checklist Before Adding a Term

- [ ] Term name is title-case and matches how it's used in industry
- [ ] Category exists in `CATEGORIES` array
- [ ] Level is appropriate (see criteria above)
- [ ] Definition is clear without requiring other jargon
- [ ] Scenario tells a story with a consequence, not just a restated definition
- [ ] Example quote sounds like something a real person would say
- [ ] All `related` terms exist as cards in the dataset
- [ ] British English spelling used throughout
- [ ] Category `count` in `CATEGORIES` is updated after adding
