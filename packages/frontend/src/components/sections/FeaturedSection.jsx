import { GridCard } from "../cards/GridCard.jsx";
import { FilterPills } from "../ui/FilterPills.jsx";
import { FEATURED_WORDS } from "../../data/featured.js";
import { filterByLevel } from "../../utils/filterUtils.js";

const LEVEL_OPTIONS = [
  { id: "All",          name: "All" },
  { id: "Beginner",     name: "Beginner" },
  { id: "Intermediate", name: "Intermediate" },
  { id: "Advanced",     name: "Advanced" },
];

// Featured flashcards grid with level filter.
// onOpenModal(words, index) is called when a card is clicked.
export function FeaturedSection({ activeFilter, onFilterChange, onOpenModal, completedTerms = new Set() }) {
  const filteredFeatured = filterByLevel(FEATURED_WORDS, activeFilter);

  return (
    <section
      id="flashcards"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(40px,7vw,80px) 24px 0" }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Featured terms</p>
          <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif" }}>Start with these</h2>
        </div>
        <FilterPills options={LEVEL_OPTIONS} active={activeFilter} onChange={onFilterChange}/>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
        {filteredFeatured.map((word, i) => (
          <GridCard key={word.term} word={word} onOpen={() => onOpenModal(filteredFeatured, i)} isDone={completedTerms.has(word.term)}/>
        ))}
      </div>
      <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#94A3B8" }}>
        Tap any card to open — use ← → keys or the chevrons to navigate
      </p>
    </section>
  );
}
