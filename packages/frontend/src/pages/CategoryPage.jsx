import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ALL_WORDS } from "../data/words.js";
import { CATEGORIES } from "../data/categories.js";
import { findCategoryById } from "../utils/slugs.js";
import { Badge } from "../components/ui/Badge.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { SEOHead } from "../components/ui/SEOHead.jsx";
import { ArrowRight } from "lucide-react";

export function CategoryPage({ completedTerms = new Set(), user, onOpenDrawer }) {
  const { categorySlug } = useParams();
  const cat = findCategoryById(CATEGORIES, categorySlug);

  if (!cat) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <SEOHead title="Category not found" description="This category doesn't exist." />
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", marginBottom: 12 }}>Category not found</h1>
        <p style={{ fontSize: 15, color: "#64748B", marginBottom: 24 }}>The category you're looking for doesn't exist.</p>
        <Link to="/categories" style={{ color: "#6366F1", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Browse all categories</Link>
      </div>
    );
  }

  const words = ALL_WORDS.filter(w => w.category === cat.name);
  const completedCount = words.filter(w => completedTerms.has(w.term)).length;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 96px" }}>
      <SEOHead
        title={`${cat.name} Terms`}
        description={`Learn ${words.length} ${cat.name.toLowerCase()} terms: ${cat.description}. Definitions, examples, and real-world scenarios.`}
      />

      <Breadcrumbs items={[
        { label: "Home", to: "/" },
        { label: "Categories", to: "/categories" },
        { label: cat.name },
      ]} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <span style={{ width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", background: cat.color, borderRadius: 14, flexShrink: 0 }}>
          <cat.icon size={26} color={cat.accent} strokeWidth={1.75} />
        </span>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: cat.accent, margin: "0 0 4px" }}>{cat.domain}</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: 0 }}>{cat.name}</h1>
        </div>
      </div>
      <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.6, marginBottom: 8, maxWidth: 600 }}>{cat.description}</p>
      <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600, marginBottom: cat.psychology ? 20 : 32 }}>
        {words.length} terms{user ? ` · ${completedCount} completed` : ""}
      </p>

      {cat.psychology && (
        <div style={{
          background: `linear-gradient(135deg, ${cat.color}, #fff)`,
          border: `1.5px solid ${cat.accent}22`,
          borderRadius: 14,
          padding: "18px 20px",
          marginBottom: 32,
          maxWidth: 680,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cat.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
              <path d="M10 21h4"/>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: cat.accent }}>Psychology</span>
          </div>
          <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, margin: 0 }}>{cat.psychology}</p>
        </div>
      )}

      {/* Term list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {words.map((w, i) => (
          <TermListItem key={w.term} word={w} cat={cat} onOpen={() => onOpenDrawer(cat, i)} />
        ))}
      </div>

      {words.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
          <p style={{ fontSize: 16, fontWeight: 500 }}>More terms coming soon</p>
        </div>
      )}
    </div>
  );
}

function TermListItem({ word, cat, onOpen }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onOpen?.()}
      aria-label={`Open ${word.term}`}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 18px", borderRadius: 12, gap: 12,
        border: `1.5px solid ${hov ? cat.accent : "#F1F5F9"}`,
        background: hov ? cat.color : "#FAFAFA",
        cursor: "pointer", transition: "border-color 0.15s, background 0.15s",
        outline: "none",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#1A1A2E", letterSpacing: "-0.01em", fontFamily: "'DM Serif Display', serif", marginBottom: 4 }}>{word.term}</div>
        <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{word.definition}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <Badge level={word.level} />
        <div style={{ width: 32, height: 32, borderRadius: 8, background: hov ? cat.accent : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
          <ArrowRight size={13} color={hov ? "#fff" : "#94A3B8"} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
