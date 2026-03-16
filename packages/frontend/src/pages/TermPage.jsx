import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ALL_WORDS } from "../data/words.js";
import { CATEGORIES } from "../data/categories.js";
import { findCategoryById, findTermBySlug, termToSlug } from "../utils/slugs.js";
import { Badge } from "../components/ui/Badge.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { SEOHead } from "../components/ui/SEOHead.jsx";
import { CAT_MAP } from "../utils/termLookup.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function TermPage({ completedTerms = new Set(), onToggleComplete, user }) {
  const { categorySlug, termSlug } = useParams();
  const cat = findCategoryById(CATEGORIES, categorySlug);
  const words = cat ? ALL_WORDS.filter(w => w.category === cat.name) : [];
  const word = findTermBySlug(words, termSlug);

  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);

  if (!cat || !word) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <SEOHead title="Term not found" description="This term doesn't exist." />
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", marginBottom: 12 }}>Term not found</h1>
        <p style={{ fontSize: 15, color: "#64748B", marginBottom: 24 }}>The term you're looking for doesn't exist.</p>
        <Link to={cat ? `/categories/${categorySlug}` : "/categories"} style={{ color: "#6366F1", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
          {cat ? `Back to ${cat.name}` : "Browse all categories"}
        </Link>
      </div>
    );
  }

  const currentIndex = words.findIndex(w => w.term === word.term);
  const prevWord = currentIndex > 0 ? words[currentIndex - 1] : null;
  const nextWord = currentIndex < words.length - 1 ? words[currentIndex + 1] : null;
  const isDone = completedTerms.has(word.term);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": word.term,
    "description": word.definition,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": cat.name,
    },
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 96px" }}>
      <SEOHead
        title={`${word.term} — ${cat.name}`}
        description={word.definition.slice(0, 160)}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs items={[
        { label: "Home", to: "/" },
        { label: "Categories", to: "/categories" },
        { label: cat.name, to: `/categories/${categorySlug}` },
        { label: word.term },
      ]} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: cat.color, borderRadius: 7 }}>
          <cat.icon size={14} color={cat.accent} strokeWidth={1.75} />
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: cat.accent }}>{cat.name}</span>
        <span style={{ marginLeft: "auto" }}><Badge level={word.level} /></span>
      </div>

      <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1A2E", marginBottom: 32 }}>
        {word.term}
      </h1>

      {/* Definition */}
      <section style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 12 }}>What it means</p>
        <p style={{ fontSize: 17, color: "#1A1A2E", lineHeight: 1.75, margin: 0 }}>{word.definition}</p>
      </section>

      <div style={{ height: 1, background: "#F1F5F9", marginBottom: 24 }} />

      {/* Why it matters */}
      <section style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 12 }}>Why it matters</p>
        <p style={{ fontSize: 17, color: "#1E293B", lineHeight: 1.75, margin: 0 }}>{word.whyItMatters}</p>
      </section>

      <div style={{ height: 1, background: "#F1F5F9", marginBottom: 20 }} />

      {/* Example (collapsible) */}
      <section style={{ marginBottom: 16, border: "1.5px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
        <button onClick={() => setScenarioOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: scenarioOpen ? "#F1F5F9" : "#F8FAFC", border: "none", padding: "14px 16px", cursor: "pointer", minHeight: 44 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#475569" }}>Example</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: scenarioOpen ? "rotate(180deg)" : "none" }}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <div style={{ overflow: "hidden", maxHeight: scenarioOpen ? "600px" : 0, transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease", opacity: scenarioOpen ? 1 : 0 }}>
          <div style={{ borderTop: "1.5px solid #E2E8F0", padding: "14px 16px", background: "#F8FAFC" }}>
            <p style={{ fontSize: 15, color: "#1E293B", lineHeight: 1.72, margin: 0 }}>{word.scenario}</p>
          </div>
        </div>
      </section>

      {/* In a real conversation (collapsible) */}
      <section style={{ marginBottom: 24, border: "1.5px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
        <button onClick={() => setConversationOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: conversationOpen ? "#F1F5F9" : "#F8FAFC", border: "none", padding: "14px 16px", cursor: "pointer", minHeight: 44 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#475569" }}>In a real conversation</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: conversationOpen ? "rotate(180deg)" : "none" }}><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <div style={{ overflow: "hidden", maxHeight: conversationOpen ? "600px" : 0, transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease", opacity: conversationOpen ? 1 : 0 }}>
          <div style={{ borderTop: "1.5px solid #E2E8F0", padding: "14px 16px", background: "#F8FAFC", borderLeft: `4px solid ${cat.accent}` }}>
            <p style={{ fontSize: 15, color: "#1E293B", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>{word.example}</p>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: "#F1F5F9", marginBottom: 24 }} />

      {/* Related terms — linked to their term pages */}
      {word.related?.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 12 }}>Related terms</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {word.related.map(r => {
              const linked = ALL_WORDS.find(w => w.term.toLowerCase() === r.toLowerCase());
              if (!linked) return <span key={r} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600, background: "#F1F5F9", color: "#64748B" }}>{r}</span>;
              const linkedCat = CATEGORIES.find(c => c.name === linked.category);
              const linkedCatSlug = linkedCat?.id || categorySlug;
              return (
                <Link
                  key={r}
                  to={`/categories/${linkedCatSlug}/${termToSlug(linked.term)}`}
                  style={{ padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600, background: cat.color, color: cat.accent, textDecoration: "none", transition: "opacity 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {r}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Mark done button */}
      {user && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <button
            onClick={() => onToggleComplete(word.term)}
            style={{ display: "flex", alignItems: "center", gap: 6, border: `1.5px solid ${isDone ? "#22C55E" : "#E2E8F0"}`, borderRadius: 8, padding: "0 24px", height: 44, fontSize: 14, fontWeight: 600, cursor: "pointer", background: isDone ? "#F0FDF4" : "#fff", color: isDone ? "#16A34A" : "#64748B", transition: "all 0.15s" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            {isDone ? "Completed" : "Mark done"}
          </button>
        </div>
      )}

      {/* Prev / Next navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderTop: "1px solid #F1F5F9", paddingTop: 24 }}>
        {prevWord ? (
          <Link to={`/categories/${categorySlug}/${termToSlug(prevWord.term)}`} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", borderRadius: 12, border: "1.5px solid #F1F5F9", textDecoration: "none", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = cat.accent} onMouseLeave={e => e.currentTarget.style.borderColor = "#F1F5F9"}>
            <ChevronLeft size={16} color="#94A3B8" strokeWidth={2.5} />
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", margin: "0 0 2px", fontWeight: 600 }}>Previous</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", margin: 0, fontFamily: "'DM Serif Display', serif" }}>{prevWord.term}</p>
            </div>
          </Link>
        ) : <div style={{ flex: 1 }} />}
        {nextWord ? (
          <Link to={`/categories/${categorySlug}/${termToSlug(nextWord.term)}`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, padding: "14px 16px", borderRadius: 12, border: "1.5px solid #F1F5F9", textDecoration: "none", textAlign: "right", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = cat.accent} onMouseLeave={e => e.currentTarget.style.borderColor = "#F1F5F9"}>
            <div>
              <p style={{ fontSize: 11, color: "#94A3B8", margin: "0 0 2px", fontWeight: 600 }}>Next</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", margin: 0, fontFamily: "'DM Serif Display', serif" }}>{nextWord.term}</p>
            </div>
            <ChevronRight size={16} color="#94A3B8" strokeWidth={2.5} />
          </Link>
        ) : <div style={{ flex: 1 }} />}
      </div>
    </div>
  );
}
