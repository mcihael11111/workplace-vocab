// TermOfTheDay — compact horizontal card below the hero.
// Picks one term per calendar day deterministically — no backend needed.
// Category accent, icon, and name update daily with the term.
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

  // Short teaser — first clause only
  const teaser = (() => {
    const cutoff = term.definition.search(/[,\.]/);
    const short  = cutoff > 0 && cutoff < 100 ? term.definition.slice(0, cutoff) : term.definition.slice(0, 80);
    return short + "…";
  })();

  return (
    <div style={{ borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9", background: "#FAFAFA" }}>
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "16px 24px",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>

        {/* Left: label + category chip */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#94A3B8" }}>
            Today
          </span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: cat.color, borderRadius: 99, padding: "3px 10px 3px 6px" }}>
            <span style={{ fontSize: 13 }}>{cat.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: cat.accent }}>{cat.name}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: "#E2E8F0", flexShrink: 0 }}/>

        {/* Term + teaser */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1A2E", whiteSpace: "nowrap" }}>
            {term.term}
          </span>
          <span style={{ fontSize: 13, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>
            {teaser}
          </span>
        </div>

        {/* CTA */}
        {isDone ? (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#16A34A", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            Done today
          </div>
        ) : (
          <button
            onClick={handleOpen}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: cat.accent, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0, transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Open card
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        )}

      </div>
    </div>
  );
}
