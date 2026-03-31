# Copy Audit Results
### Full review of all 490 terms against the updated writing guidelines

---

## What passes across the board

These rules have **zero violations** across all 490 terms:

- **Em dashes**: Zero content em dashes in any text field
- **Scenario openers**: Zero instances of "A team", "A product team", "A design team", "A startup", or "A company"
- **WhyItMatters restating definition**: No verbatim duplication found

---

## Issue 1: Definitions over 2 sentences

**~90 terms** have definitions of 3-4 sentences. The two main patterns:

### Pattern A: Acronym expansions (16 terms)

Terms like MVP, API, QA, KPI, CTA, CSAT, NDA, GDPR, EBITDA, P&L, RLHF, OKR, HCD, PoC, B2B vs B2C count their acronym expansion ("Minimum Viable Product.") as a separate sentence, pushing the total to 3.

**Example (MVP, line 213):**
> "Minimum Viable Product. The simplest version of a product you can ship to real users to test whether your idea actually works. It includes only what is needed to learn, not everything the team wishes it had."

**Proposed fix:** Merge the expansion into the first sentence.
> "Minimum Viable Product: the simplest version of a product you can ship to real users to test whether your idea actually works. It includes only what is needed to learn, not everything the team wishes it had."

### Pattern B: Third sentence adds detail that belongs elsewhere (74 terms)

The third sentence typically adds a supporting detail, example, or clarification. Worst in the Psychology categories (~60 terms).

**Example (Cash Flow, line 1934):**
> "The movement of money into and out of a business over time. Positive cash flow means more money is coming in than going out. Cash flow is distinct from profit: a profitable business can still fail if it runs out of cash at the wrong moment."

**Proposed fix:** Cut the third sentence or fold it into sentence two.
> "The movement of money into and out of a business over time. Positive cash flow means more money is coming in than going out, and it is distinct from profit: a profitable business can still fail if it runs out of cash."

### Full list of affected terms

**Lines 1-900:** Affordance, Call to Action, MVP, API, QA, Stakeholder, KPI, B2B vs B2C, Tone of Voice, Accessibility, Baseline, CSAT, CTA (Copy category), Checkbox

**Lines 900-1900:** PoC, Sans serif

**Lines 1900-2900:** Profit Margin, Cash Flow, EBITDA, P&L, Fiscal Year, Return on Investment, NDA, GDPR, Working Capital, Overhead, Weights, Token, Context Window, Temperature, Black Box, RLHF

**Lines 2900-3632 (Psychology):** ~60 terms. Nearly every term in Body Language, Persuasion & Influence, Behavioural Economics, Social Psychology, Psychology of Graphic Design, Psychology of Marketing, Psychology of Product Design, Psychology of Leadership, and Psychology of Learning has a 3-4 sentence definition. This is the largest block of violations.

---

## Issue 2: Psychology sections over 2 sentences

**~30 terms** have psychology fields running to 3-4 sentences.

**Lines 1-900 (8 terms):** KPI, Tone of Voice, Design Pattern, NPS, Design Debt, Wireframe, Card sorting, Design system

**Lines 900-1900 (7 terms):** Divergent thinking, Empathy map, Flat design, Font weight, Inclusive design, Miller's Law, Navigation, Retention, Sprint, Marketing Funnel, Brand Positioning

**Lines 1900-2900 (5 terms):** Hallucination, Explainability (XAI), Trust Calibration, Personalisation Engine, AI Bias

**Example (Font weight, line 991):**
> "Bold text signals importance and authority. Light fonts signal elegance and refinement. These associations are culturally learned but operate automatically, which is why weight alone can create hierarchy without introducing a second typeface. The brain reads visual weight as informational weight."

**Proposed fix:** Merge to 2 sentences:
> "Bold text signals importance and authority while light fonts signal elegance, and these associations operate automatically even though they are culturally learned. The brain reads visual weight as informational weight, which is why weight alone can create hierarchy without a second typeface."

---

## Issue 3: Example quotes over 20 words

This is the most **systemic** issue. The majority of "In real conversation" quotes across the entire file exceed 20 words. The worst offenders reach 35-46 words.

### Worst offenders (30+ words)

| Term | Line | Words | Current text |
|------|------|-------|-------------|
| Data Privacy (AI) | 2892 | ~46 | Multi-sentence paragraph about training data policies |
| Brand | 771 | ~36 | Three sentences about feature not feeling on-brand |
| North Star Metric | 1536 | ~35 | Three sentences about weekly active users |
| Sign-off | 1595 | ~34 | Three sentences about legal sign-off |
| Business Case | 1565 | ~33 | Five sentences with conversion stats |
| Interleaving | 3596 | ~33 | Three sentences about study sessions |
| CSAT | 785 | ~31 | Three sentences about onboarding score |
| Alignment | 727 | ~31 | Three sentences about icon alignment |
| Servant Leadership | 3517 | ~31 | Three sentences about leadership role |
| Mere Exposure Effect | 3359 | ~31 | Three sentences about brand familiarity |
| Assumption | 749 | ~30 | Two sentences about validating assumptions |
| Baseline | 764 | ~30 | Three sentences about icon baseline alignment |
| Epic | 1483 | ~30 | Three sentences listing story types |
| Definition of Done | 1497 | ~30 | Three sentences with checklist |
| Workshop | 1572 | ~30 | Three sentences about facilitation |

**Proposed approach:** Cut each to one punchy sentence, ideally a question or a statement with a reason. Target: under 20 words.

**Example (Brand, line 771):**
> Current (36 words): "The feature works technically, but it doesn't feel like us. The copy is formal, the colours are off-brand, and the interaction style doesn't match the rest of the product. This needs a brand pass before it ships."

> Proposed (~16 words): "This doesn't feel like us. It needs a brand pass before it ships."

**Example (North Star Metric, line 1536):**
> Current (35 words): "Our north star metric is weekly active users who complete at least one project. Everything we design should move that number. If a feature doesn't contribute to it, it goes to the bottom of the backlog."

> Proposed (~18 words): "Does this feature move our north star? If it doesn't increase weekly active project completions, deprioritise it."

---

## Issue 4: Parenthetical lists in definitions

**~8 terms** still contain parenthetical lists in their definitions:

| Term | Line | Parenthetical content |
|------|------|-----------------------|
| Stakeholder | 328 | (executives, legal, product) and (clients, partners, regulators) |
| Proxemics | 3044 | (0-45cm), (45cm-1.2m), (1.2-3.6m), (3.6m+) |
| Serial Position Effect | 3329 | (primacy) and (recency) |
| Intrinsic vs Extrinsic Motivation | 3510 | (curiosity, mastery, purpose) and (salary, bonuses, deadlines) |
| Metacognition | 3617 | (understanding what strategies work) and (planning, monitoring, evaluating) |
| Dark Patterns | 3445 | (easy to enter, hard to leave) |
| Feedback Psychology | 3531 | (threat response) |
| Call to Action (UI Elements) | 92 | Inline list: 'Sign up', 'Get started', 'Add to cart' |

---

## Issue 5: Broken grammar (2 terms)

**Patent (line 2078):** Scenario contains "a patent search and identified" which should be "a patent search identified" (extraneous "and").

**Unsupervised Learning (line 2414):** Scenario contains "A clustering algorithm on the data and discovered" which is missing a verb. Should be "A clustering algorithm ran on the data and discovered" or similar.

---

## Summary by priority

| Priority | Issue | Terms affected | Effort |
|----------|-------|---------------|--------|
| **Critical** | Broken grammar (2 scenarios) | 2 | 5 min |
| **High** | Example quotes over 20 words | ~200+ | High (bulk rewrite) |
| **High** | Definitions over 2 sentences (Psychology block) | ~60 | High (systematic trim) |
| **Medium** | Definitions over 2 sentences (acronym pattern) | ~16 | Low (merge expansion into sentence) |
| **Medium** | Definitions over 2 sentences (third-sentence pattern) | ~14 | Medium (cut or fold) |
| **Medium** | Psychology fields over 2 sentences | ~30 | Medium (merge to 2) |
| **Low** | Parenthetical lists in definitions | 8 | Low (restructure) |

---

## Recommended execution order

1. **Fix the 2 broken grammar issues** (5 minutes, zero risk)
2. **Fix the 16 acronym-expansion definitions** (merge expansion into first sentence with a colon)
3. **Trim the ~60 Psychology definitions** to 2 sentences (biggest single block)
4. **Trim the ~14 other over-long definitions** across Finance, Legal, AI & ML
5. **Trim the ~30 psychology fields** to 2 sentences
6. **Fix the 8 parenthetical lists** (restructure into natural prose)
7. **Rewrite the ~200+ example quotes** to under 20 words (largest effort, can be batched by domain)

---

*Audit completed 31 March 2026*
*Covers all 490 terms in words.js*
