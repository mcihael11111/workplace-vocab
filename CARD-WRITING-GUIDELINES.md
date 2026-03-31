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
  related: ["Term A", "Term B", "Term C", "Term D"],  // 3–5 related terms
  psychology: "..."            // Optional — the psychological principle behind the concept
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
- **2 sentences maximum.** First sentence must be plain language a non-expert can repeat to a colleague. Second sentence adds precision, specifics, or domain context.
- Do not open with a technically dense or reference-manual-style sentence. Lead with what it is in simple terms.
- No parenthetical lists inside definitions. Integrate examples naturally ("like sticky notes, observations, and quotes") or move them to the second sentence.
- Avoid jargon in the definition itself. If you must reference another term, make sure it's in `related`.
- Be precise. Don't pad with filler. Every word should earn its place.
- Use British English spelling (organisation, colour, behaviour, prioritise).

### Why It Matters
- **2–4 sentences.** Explain the real-world consequence of understanding (or not understanding) this concept.
- **Must not restate the definition.** If the first sentence could be swapped with the definition's first sentence and still make sense, rewrite it. Open with tension, contrast, consequence, or a concrete image instead.
- Good openers: "Without this...", "The gap between X and Y is where...", "Teams that skip this...", a concrete image, or a reframe that shifts the reader's perspective.
- Speak to the reader as a practitioner, not a student. Assume they work in a product team.
- Avoid generic statements like "This is important for any designer." Say *why* it's important and what goes wrong without it.

### Scenario
- **3–6 sentences.** Tell a short, concrete story.
- **Do not open with "A team", "A product team", "A design team", or "A startup".** Lead with the artefact, the situation, or the problem. Acceptable openers: the product, the page, the form, the dashboard, the flow, the notification system, or a specific object in the story.
- Show the concept in action, not just its definition restated. The scenario should demonstrate *consequence* — what happened because of (or in absence of) this concept.
- Never use fictional brand names. Keep it generic but specific to the object: "the checkout flow", "the settings page", "a SaaS onboarding screen".
- Write in past tense.

### Example (spoken quote)
- **1 sentence in double quotes.** Something a person might actually say in a meeting, Slack message, or stand-up.
- Should sound natural, not rehearsed. Questions are good. Reasons that reveal thinking are good. Presentation-speak is not.
- Test: would someone interrupt a stand-up to say this sentence out loud? If it sounds too formal or too long, shorten it.
- Aim for under 20 words. Include context or consequence when it reveals the speaker's thinking.
- Wrap the entire value in escaped quotes: `"\"The sentence here.\""`.

### Related Terms
- **3–5 terms.** Must be exact `term` strings from other cards in the dataset.
- Prioritise terms the reader would naturally want to explore next.
- Mix categories where possible — cross-linking between categories is valuable.

### Psychology (optional)
- **2 sentences maximum, plus a design implication line.** First sentence names the principle and defines it briefly. Second sentence connects it to the term.
- End with a bold design implication: `**Design implication:** One actionable sentence.`
- Only include when a genuine, named psychology principle applies. Not every term needs one.
- Name the principle explicitly (e.g. "Loss Aversion", "Mere Exposure Effect", "Cognitive Load Theory") so the reader gains a specific concept they can research further.
- Focus on insight the reader would not otherwise have. The psychology should add a layer of understanding that the definition and why-it-matters sections do not cover.
- Skip psychology for purely technical terms (CSS, API, GPU), pure role descriptions, and terms where the connection would feel forced.
- Good candidates: design patterns with cognitive roots, marketing tactics built on behavioural economics, business metrics that exploit bias, and any term where understanding the underlying human behaviour changes how you apply the concept.

---

## Voice & Tone

- **Authoritative but approachable.** Write like a senior colleague explaining something over coffee, not a textbook.
- **No fluff.** Cut "basically", "essentially", "in other words", "simply put".
- **No hedging.** Don't say "can sometimes be useful". Say what it does and why it matters.
- **No em dashes.** Zero tolerance for em dashes ( — ) anywhere. They are a known marker of AI-generated writing and interrupt natural reading flow. Split into two sentences with a period, use a comma, or restructure the sentence.
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
  domain: "Domain Name",       // Product Design | Engineering | Business | Marketing | Finance | Legal | AI & Machine Learning
  count: 10,                   // Number of terms in this category
  color: "#F0F9FF",            // Light background colour (pastel)
  accent: "#0EA5E9",           // Bold accent colour for badges/borders
  icon: Microscope,            // Lucide React icon component
  description: "Short phrase listing 4–5 key terms in the category",
  psychology: "The psychological principles underpinning this category"  // 2–4 sentences
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
