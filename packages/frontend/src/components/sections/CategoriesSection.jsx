import { CategoryCard } from "../cards/CategoryCard.jsx";
import { Search } from "lucide-react";
import { FilterPills } from "../ui/FilterPills.jsx";
import { DOMAINS } from "../../data/domains.js";
import { filterCategories } from "../../utils/filterUtils.js";
import { CATEGORIES } from "../../data/categories.js";
import { ALL_WORDS } from "../../data/words.js";

// Category grid section with domain filter pills and search-driven heading.
export function CategoriesSection({ search, activeDomain, onDomainChange, onOpenDrawer, completedTerms = new Set(), user }) {
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))", gap: 14, alignItems: "start" }}>
        {filteredCats.map((cat) => {
          const catWords = user ? ALL_WORDS.filter(w => w.category === cat.name) : [];
          const completedCount = user ? catWords.filter(w => completedTerms.has(w.term)).length : undefined;
          const totalCount     = user ? catWords.length : undefined;
          return (
            <CategoryCard key={cat.id} cat={cat} onClick={() => onOpenDrawer(cat)} completedCount={completedCount} totalCount={totalCount}/>
          );
        })}
      </div>
      {search && filteredCats.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "#94A3B8", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Search size={32} color="#CBD5E1" strokeWidth={1.5} />
          <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>No categories match "{search}"</p>
        </div>
      )}
    </section>
  );
}
