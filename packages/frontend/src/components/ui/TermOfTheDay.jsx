// TermOfTheDay — full-width section placed directly below the hero.
// Picks one term per calendar day deterministically — no backend needed.
// The category accent colour, icon, and name all update with the term.
//
// Props:
//   completedTerms — Set<string>
//   onOpen         — (words: Word[], index: number) => void
import { ALL_WORDS } from "../../data/words.js";
import { CAT_MAP } from "../../utils/termLookup.js";

function getDailyTerm() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return ALL_WORDS[dayIndex % ALL_WORDS.length];
}

export function TermOfTheDay({ completedTerms, onOpen }) {
  const term   = getDailyTerm();
  const cat    = CAT_MAP[term.category] || { accent: "#6366F1", color: "#EEF2FF", icon: "📖", name: term.category };
  const isDone = completedTerms.has(term.term);

  const handleOpen = () => {
    const wordsInCat = ALL_WORDS.filter(w => w.category === term.category);
    const idx        = wordsInCat.findIndex(w => w.term === term.term);
    onOpen(wordsInCat, idx >= 0 ? idx : 0);
  };

  // Teaser: first sentence of definition, max 120 chars
  const teaser = term.definition.length > 120
    ? term.definition.slice(0, term.definition.lastIndexOf(" ", 120)) + "…"
    : term.definition;

  return (
    <section style={{ borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9", background: "#FAFAFA" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20 }}>

        {/* Label */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: cat.color, border: `1px solid ${cat.accent}22`, borderRadius: 99, padding: "5px 14px" }}>
          <span style={{ fontSize: 14 }}>{cat.icon}</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: cat.accent }}>
            Today's term · {cat.name}
          </span>
        </div>

        {/* Term */}
        <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1A2E", margin: 0 }}>
          {term.term}
        </h2>

        {/* Teaser */}
        <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 520, margin: 0 }}>
          {teaser}
        </p>

        {/* CTA */}
        {isDone ? (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, color: "#16A34A" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Done for today — come back tomorrow
          </div>
        ) : (
          <button
            onClick={handleOpen}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: cat.accent, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em", transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Open today's card
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        )}

        {/* Scroll cue */}
        <div style={{ marginTop: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: 0.35 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94A3B8" }}>Scroll to explore</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>

      </div>
    </section>
  );
}
