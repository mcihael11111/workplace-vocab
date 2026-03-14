// ─── FILTER UTILITIES ───────────────────────────────────────────────────────
// Pure functions for filtering terms and categories.
// No React dependencies — fully testable in isolation.

/**
 * Filter categories by active domain and search query.
 * @param {Array}  categories - Full CATEGORIES array
 * @param {string} domain     - Active domain id ("All" | "Product Design" | etc.)
 * @param {string} search     - Raw search string from the input
 * @returns {Array} Filtered category objects
 */
export function filterCategories(categories, domain, search) {
  return categories
    .filter(c => domain === "All" || c.domain === domain)
    .filter(c => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
}

/**
 * Filter featured words by level.
 * @param {Array}  words  - Featured words array
 * @param {string} level  - "All" | "Beginner" | "Intermediate" | "Advanced"
 * @returns {Array} Filtered word objects
 */
export function filterByLevel(words, level) {
  if (level === "All") return words;
  return words.filter(w => w.level === level);
}
