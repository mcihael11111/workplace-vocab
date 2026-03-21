import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Horizontal carousel of domain cards — "Explore all domains"
export function DomainCarousel({ domains, onDomainClick }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    el.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 6 }}>
            Explore
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif", margin: 0 }}>
            All domains
          </h2>
        </div>
        {/* Arrows */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            style={{
              width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #E2E8F0",
              background: canScrollLeft ? "#fff" : "#F8FAFC",
              cursor: canScrollLeft ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: canScrollLeft ? 1 : 0.4, transition: "opacity 0.15s",
            }}
          >
            <ChevronLeft size={18} color="#1A1A2E" strokeWidth={2} />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            style={{
              width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #E2E8F0",
              background: canScrollRight ? "#1A1A2E" : "#F8FAFC",
              cursor: canScrollRight ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: canScrollRight ? 1 : 0.4, transition: "opacity 0.15s",
            }}
          >
            <ChevronRight size={18} color={canScrollRight ? "#fff" : "#1A1A2E"} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        style={{
          display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory",
          scrollbarWidth: "none", msOverflowStyle: "none",
          paddingBottom: 4,
        }}
      >
        {domains.map((d) => (
          <DomainCard key={d.name} domain={d} onClick={() => onDomainClick(d.name)} />
        ))}
      </div>
    </div>
  );
}

function DomainCard({ domain, onClick }) {
  const [hov, setHov] = useState(false);

  // Pick the accent of the first category in this domain
  const accent = domain.categories[0]?.accent || "#64748B";
  const bgTint = domain.categories[0]?.color || "#F8FAFC";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Explore ${domain.name} — ${domain.categories.length} categories`}
      style={{
        minWidth: 200, maxWidth: 220, flex: "0 0 auto",
        scrollSnapAlign: "start",
        background: hov ? bgTint : "#fff",
        border: `1.5px solid ${hov ? accent : "#E2E8F0"}`,
        borderRadius: 14, padding: "20px 18px",
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Icon cluster — show first 3 category icons */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {domain.categories.slice(0, 3).map((cat) => (
          <span
            key={cat.id}
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              background: cat.color, borderRadius: 8, flexShrink: 0,
            }}
          >
            <cat.icon size={16} color={cat.accent} strokeWidth={1.75} />
          </span>
        ))}
      </div>

      <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 4, letterSpacing: "-0.01em" }}>
        {domain.name}
      </div>
      <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>
        {domain.categories.length} {domain.categories.length === 1 ? "category" : "categories"} · {domain.totalTerms} terms
      </div>
    </div>
  );
}
