// TermOfTheDay — featured strip below the hero, matching the CategoriesSection header pattern.
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

  // Short teaser — up to first comma/period or 100 chars
  const teaser = (() => {
    const cutoff = term.definition.search(/[,.]/);
    const short  = cutoff > 0 && cutoff < 100 ? term.definition.slice(0, cutoff) : term.definition.slice(0, 100);
    return short + ".";
  })();

  return (
    <div style={{ borderBottom: "1px solid #F1F5F9" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "20px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 24, flexWrap: "wrap",
      }}>

        {/* Left: label + term + teaser */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8", margin: 0 }}>
              Word of the day
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: cat.color, borderRadius: 99, padding: "2px 8px 2px 5px" }}>
              <span style={{ fontSize: 11 }}>{cat.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: cat.accent }}>{cat.name}</span>
            </div>
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 6px" }}>
            {term.term}
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.55, margin: 0 }}>
            {teaser}
          </p>
        </div>

        {/* Right: CTA */}
        <div style={{ flexShrink: 0 }}>
          {isDone ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, color: "#16A34A", whiteSpace: "nowrap" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
              Done today
            </div>
          ) : (
            <button
              onClick={handleOpen}
              aria-label={`Open flashcard for ${term.term}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "opacity 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Open card
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
