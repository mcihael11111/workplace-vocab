import { ALL_WORDS } from "../data/words.js";
import { CATEGORIES } from "../data/categories.js";

// ─── CATEGORY MAP ────────────────────────────────────────────────────────────
// O(1) lookup: category name → category object.
// Built once at module load — safe because CATEGORIES is static.
export const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.name, c]));

/**
 * Find a term object by name (case-insensitive).
 * Returns undefined if not found.
 * @param {string} name
 * @returns {object|undefined}
 */
export function findTermByName(name) {
  return ALL_WORDS.find(w => w.term.toLowerCase() === name.toLowerCase());
}

// ─── FREEMIUM: 25% FREE PER CATEGORY ─────────────────────────────────────────
// First 25% of terms in each category are free (min 1 per category).
// Proportionally spread so every category has some free content.
function computeFreeTerms() {
  const byCategory = {};
  for (const w of ALL_WORDS) {
    if (!byCategory[w.category]) byCategory[w.category] = [];
    byCategory[w.category].push(w.term);
  }
  const free = new Set();
  for (const terms of Object.values(byCategory)) {
    const n = Math.max(1, Math.ceil(terms.length * 0.25));
    terms.slice(0, n).forEach(t => free.add(t));
  }
  return free;
}

export const FREE_TERMS = computeFreeTerms();
export const isTermLocked = (termName) => !FREE_TERMS.has(termName);
