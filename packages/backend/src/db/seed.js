// ─── DATABASE SEED ──────────────────────────────────────────────────────────
// Run with: npm run db:seed
// Seeds all categories and terms from the frontend data files.
// Safe to re-run — uses upsert so existing records are updated, not duplicated.

import { prisma } from "./client.js";

// Import data from the frontend package (single source of truth)
// Adjust the relative path if workspace layout changes
import { CATEGORIES } from "../../frontend/src/data/categories.js";
import { ALL_WORDS }  from "../../frontend/src/data/words.js";

async function main() {
  console.log("Seeding categories…");
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where:  { id: cat.id },
      update: { name: cat.name, domain: cat.domain, icon: cat.icon, description: cat.description, color: cat.color, accent: cat.accent, count: cat.count },
      create: { id: cat.id,  name: cat.name, domain: cat.domain, icon: cat.icon, description: cat.description, color: cat.color, accent: cat.accent, count: cat.count },
    });
  }
  console.log(`✓ ${CATEGORIES.length} categories seeded`);

  console.log("Seeding terms…");
  // Build a map from category name → id
  const catsByName = Object.fromEntries(CATEGORIES.map(c => [c.name, c.id]));

  for (const word of ALL_WORDS) {
    const slug = word.term.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categoryId = catsByName[word.category];
    if (!categoryId) {
      console.warn(`  ⚠ Unknown category "${word.category}" for term "${word.term}" — skipping`);
      continue;
    }
    await prisma.term.upsert({
      where:  { slug },
      update: { term: word.term, categoryId, level: word.level, definition: word.definition, whyItMatters: word.whyItMatters, example: word.example, related: word.related },
      create: { slug, term: word.term, categoryId, level: word.level, definition: word.definition, whyItMatters: word.whyItMatters, example: word.example, related: word.related },
    });
  }
  console.log(`✓ ${ALL_WORDS.length} terms seeded`);
}

main()
  .then(() => { console.log("Seed complete."); prisma.$disconnect(); })
  .catch(e  => { console.error(e); prisma.$disconnect(); process.exit(1); });
