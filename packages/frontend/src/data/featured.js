// ─── FEATURED TERMS ─────────────────────────────────────────────────────────
// The hand-picked terms shown in the "Start with these" flashcard section.
// Add or swap term names here to update featured content — no other change needed.

import { ALL_WORDS } from "./words.js";

const FEATURED_TERMS = [
  "Cognitive Load",      // Product Design
  "CI/CD",               // Engineering
  "OKR",                 // Business
  "Value Proposition",   // Marketing
  "Burn Rate",           // Finance
  "NDA",                 // Legal
  "Hallucination",       // AI & Machine Learning
];

const FEATURED_WORDS = ALL_WORDS.filter(w => FEATURED_TERMS.includes(w.term));

export { FEATURED_TERMS, FEATURED_WORDS };
