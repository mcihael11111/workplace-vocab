// TermOfTheDay — picks one term per calendar day deterministically (no backend needed).
// Index rotates through ALL_WORDS based on days since Unix epoch.
//
// Props:
//   completedTerms  — Set<string>
//   onOpen          — (words: Word[], index: number) => void  (same signature as openModal)
import { ALL_WORDS } from "../../data/words.js";

function getDailyTerm() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return ALL_WORDS[dayIndex % ALL_WORDS.length];
}

export function TermOfTheDay({ completedTerms, onOpen }) {
  const term   = getDailyTerm();
  const isDone = completedTerms.has(term.term);

  const handleOpen = () => {
    const wordsInCat = ALL_WORDS.filter(w => w.category === term.category);
    const idx        = wordsInCat.findIndex(w => w.term === term.term);
    onOpen(wordsInCat, idx >= 0 ? idx : 0);
  };

  return (
    <button
      onClick={isDone ? undefined : handleOpen}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        background: isDone ? "#F0FDF4" : "#F8FAFC",
        border: `1.5px solid ${isDone ? "#86EFAC" : "#E2E8F0"}`,
        borderRadius: 12, padding: "10px 16px",
        cursor: isDone ? "default" : "pointer",
        textAlign: "left", width: "100%",
        transition: "border-color 0.15s",
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>
        {isDone ? "✅" : "📖"}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: isDone ? "#16A34A" : "#94A3B8", margin: "0 0 2px" }}>
          {isDone ? "Today's term — done!" : "Today's term"}
        </p>
        <p style={{ fontSize: 14, fontWeight: 700, color: isDone ? "#15803D" : "#1A1A2E", margin: 0, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {term.term}
        </p>
      </div>
      {!isDone && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" style={{ flexShrink: 0 }}>
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      )}
    </button>
  );
}
