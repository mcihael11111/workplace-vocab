import { CategoryCard } from "../cards/CategoryCard.jsx";
import { ALL_WORDS } from "../../data/words.js";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// A single domain section: heading + "View All" + subcategory card grid
export function DomainSection({ domain, onOpenDrawer, completedTerms, user }) {
  const navigate = useNavigate();

  // Pick accent from first category
  const accent = domain.categories[0]?.accent || "#64748B";

  return (
    <section
      id={`domain-${domain.name.toLowerCase().replace(/\s+/g, "-")}`}
      style={{ marginBottom: 48 }}
    >
      {/* Heading row */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <h3 style={{
          fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em",
          fontFamily: "'DM Serif Display', serif", margin: 0, color: "#1A1A2E",
        }}>
          {domain.name}
        </h3>
        <ViewAllButton accent={accent} onClick={() => navigate(`/categories?domain=${encodeURIComponent(domain.name)}`)} />
      </div>

      {/* 2-col card grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
        gap: 14,
        alignItems: "start",
      }}>
        {domain.categories.map((cat) => {
          const catWords = user ? ALL_WORDS.filter(w => w.category === cat.name) : [];
          const completedCount = user ? catWords.filter(w => completedTerms.has(w.term)).length : undefined;
          const totalCount = user ? catWords.length : undefined;
          return (
            <CategoryCard
              key={cat.id}
              cat={cat}
              onClick={() => onOpenDrawer(cat)}
              completedCount={completedCount}
              totalCount={totalCount}
            />
          );
        })}
      </div>
    </section>
  );
}

function ViewAllButton({ accent, onClick }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        background: "none", border: "none", cursor: "pointer",
        fontSize: 13, fontWeight: 600, color: hov ? accent : "#64748B",
        transition: "color 0.15s", padding: 0,
      }}
    >
      View all <ChevronRight size={14} strokeWidth={2.5} />
    </button>
  );
}
