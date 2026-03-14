import { CategoryCard } from "../cards/CategoryCard.jsx";
import { FilterPills } from "../ui/FilterPills.jsx";
import { AdSlot } from "../ui/AdSlot.jsx";
import { DOMAINS } from "../../data/domains.js";
import { filterCategories } from "../../utils/filterUtils.js";
import { CATEGORIES } from "../../data/categories.js";
import { ALL_WORDS } from "../../data/words.js";

// Category grid section with domain filter pills and search-driven heading.
export function CategoriesSection({ search, activeDomain, onDomainChange, onOpenDrawer, completedTerms = new Set() }) {
  const filteredCats = filterCategories(CATEGORIES, activeDomain, search);

  return (
    <section
      id="categories"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px,7vw,72px) 24px 0" }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Browse by category</p>
          <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif" }}>
            {search
              ? `${filteredCats.length} categories found`
              : activeDomain !== "All"
                ? activeDomain
                : "Every area of practice"}
          </h2>
        </div>
        <FilterPills options={DOMAINS} active={activeDomain} onChange={onDomainChange}/>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))", gap: 14 }}>
        {filteredCats.map((cat, i) => {
          const catWords = ALL_WORDS.filter(w => w.category === cat.name);
          const completedCount = catWords.filter(w => completedTerms.has(w.term)).length;
          return (
          <>
            <CategoryCard key={cat.id} cat={cat} onClick={() => onOpenDrawer(cat)} completedCount={completedCount} totalCount={catWords.length}/>
            {i === 10 && <AdSlot key="ad-grid" slot="1205581780" variant="grid"/>}
          </>
          );
        })}
      </div>
      {search && filteredCats.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "#94A3B8" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 16, fontWeight: 500 }}>No categories match "{search}"</p>
        </div>
      )}
    </section>
  );
}
