// ─── TYPE DEFINITIONS (JSDoc) ────────────────────────────────────────────────
// These are documentation-only — not enforced at runtime.
// If TypeScript is added later, convert these to interfaces.

/**
 * @typedef {Object} Word
 * @property {string}   term         - Display name of the term
 * @property {string}   category     - Category name (matches CATEGORIES[].name)
 * @property {"Beginner"|"Intermediate"|"Advanced"} level
 * @property {string}   definition   - What it means
 * @property {string}   whyItMatters - Why professionals should know it
 * @property {string}   example      - In-context usage sentence
 * @property {string[]} related      - Array of related term names (may not all exist in ALL_WORDS)
 */

/**
 * @typedef {Object} Category
 * @property {string} id          - URL-safe slug e.g. "design-system"
 * @property {string} name        - Display name e.g. "Design System"
 * @property {string} domain      - Parent domain e.g. "Product Design"
 * @property {number} count       - Denormalised term count
 * @property {string} color       - Background hex for icons and chips
 * @property {string} accent      - Primary accent hex
 * @property {string} icon        - Emoji icon
 * @property {string} description - Short description shown on category cards
 */

/**
 * @typedef {Object} Domain
 * @property {string} id   - "All" | "Product Design" | "Engineering" | "Business" | "Marketing"
 * @property {string} name - Display name
 */
