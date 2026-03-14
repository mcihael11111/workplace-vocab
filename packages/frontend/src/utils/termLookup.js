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
