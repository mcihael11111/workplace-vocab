// ─── DOMAINS & STATS ────────────────────────────────────────────────────────
// Derived automatically from CATEGORIES — no manual updates needed.
// Adding a new domain to categories.js is all that's required.

import { CATEGORIES } from "./categories.js";

const domainNames = [...new Set(CATEGORIES.map(c => c.domain))];

const DOMAINS = [
  { id: "All", name: "All" },
  ...domainNames.map(d => ({ id: d, name: d })),
];

const totalTerms = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

const STATS = [
  { value: `${totalTerms}+`, label: "Written terms" },
  { value: `${CATEGORIES.length}`,  label: "Categories" },
  { value: `${domainNames.length}`, label: "Domains" },
];

export { DOMAINS, STATS };
