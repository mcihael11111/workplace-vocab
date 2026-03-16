// Slug utilities for URL-safe identifiers.
// Categories already have an `id` field that works as a slug.
// Terms need to be converted: "Affinity Map" → "affinity-map"

export function termToSlug(termName) {
  return termName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function findTermBySlug(words, slug) {
  return words.find(w => termToSlug(w.term) === slug);
}

export function findCategoryById(categories, id) {
  return categories.find(c => c.id === id);
}
