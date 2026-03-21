import { CategoryCard } from "../cards/CategoryCard.jsx";
import { ALL_WORDS } from "../../data/words.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// A single domain section: heading + "View All" + horizontal carousel of subcategory cards
export function DomainSection({ domain, onOpenDrawer, completedTerms, user }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const accent = domain.categories[0]?.accent || "#64748B";

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section
      id={`domain-${domain.name.toLowerCase().replace(/\s+/g, "-")}`}
      style={{ marginBottom: 48 }}
    >
      {/* Heading row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <h3 style={{
          fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em",
          fontFamily: "'DM Serif Display', serif", margin: 0, color: "#1A1A2E",
        }}>
          {domain.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ViewAllButton accent={accent} onClick={() => navigate(`/categories?domain=${encodeURIComponent(domain.name)}`)} />
          {/* Carousel arrows — only show if content overflows */}
          {(canScrollLeft || canScrollRight) && (
            <div style={{ display: "flex", gap: 6 }}>
              <ArrowButton direction="left" enabled={canScrollLeft} onClick={() => scroll(-1)} />
              <ArrowButton direction="right" enabled={canScrollRight} onClick={() => scroll(1)} />
            </div>
          )}
        </div>
      </div>

      {/* Horizontal carousel of subcategory cards */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: 4,
        }}
      >
        {domain.categories.map((cat) => {
          const catWords = user ? ALL_WORDS.filter(w => w.category === cat.name) : [];
          const completedCount = user ? catWords.filter(w => completedTerms.has(w.term)).length : undefined;
          const totalCount = user ? catWords.length : undefined;
          return (
            <div key={cat.id} style={{ flex: "0 0 auto", width: "min(260px, 75vw)", scrollSnapAlign: "start" }}>
              <CategoryCard
                cat={cat}
                onClick={() => onOpenDrawer(cat)}
                completedCount={completedCount}
                totalCount={totalCount}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ArrowButton({ direction, enabled, onClick }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      aria-label={`Scroll ${direction}`}
      style={{
        width: 30, height: 30, borderRadius: "50%",
        border: "1.5px solid #E2E8F0",
        background: enabled && direction === "right" ? "#1A1A2E" : "#fff",
        cursor: enabled ? "pointer" : "default",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: enabled ? 1 : 0.35,
        transition: "opacity 0.15s",
      }}
    >
      <Icon size={15} color={enabled && direction === "right" ? "#fff" : "#1A1A2E"} strokeWidth={2} />
    </button>
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
