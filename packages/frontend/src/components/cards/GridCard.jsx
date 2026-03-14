import { useState } from "react";
import { Badge } from "../ui/Badge.jsx";
import { CAT_MAP } from "../../utils/termLookup.js";

// Featured flashcard tile shown in the grid section.
// Clicking opens the FlashcardModal via onOpen.
export function GridCard({ word, onOpen }) {
  const [hov, setHov] = useState(false);
  const cat = CAT_MAP[word.category] || { accent: "#1A1A2E", color: "#F8FAFC" };

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hov ? cat.accent : "#E2E8F0"}`,
        borderRadius: 16, padding: 28, cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 12px 32px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        height: 210,
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: cat.accent }}>
            {word.category}
          </span>
          <Badge level={word.level}/>
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#1A1A2E", letterSpacing: "-0.03em", lineHeight: 1.15, fontFamily: "'DM Serif Display', Georgia, serif" }}>
          {word.term}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 12 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
          Tap to learn
        </span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: hov ? cat.accent : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hov ? "#fff" : "#94A3B8"} strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
