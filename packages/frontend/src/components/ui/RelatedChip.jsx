import { useState } from "react";

// Chip displayed in the FlashcardModal "Related terms" section.
// linked=true means the term exists in ALL_WORDS and is clickable.
// linked=false renders as a dimmed, non-interactive label.
export function RelatedChip({ label, linked, color, accent, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "6px 14px", borderRadius: 8,
        background: hov && linked ? accent : color,
        color: hov && linked ? "#fff" : accent,
        fontSize: 13, fontWeight: 600,
        border: `1px solid ${accent}${linked ? "40" : "20"}`,
        cursor: linked ? "pointer" : "default",
        transition: "all 0.15s",
        opacity: linked ? 1 : 0.55,
      }}
    >
      {label}
      {linked && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke={hov ? "#fff" : accent} strokeWidth="2.5" strokeLinecap="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      )}
    </span>
  );
}
