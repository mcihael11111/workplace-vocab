import { useState } from "react";
import { Badge } from "../ui/Badge.jsx";

// Single term row inside the CategoryDrawer list.
// Clicking opens the FlashcardModal at this term's index via onOpen.
export function DrawerWordRow({ word, cat, onOpen }) {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onOpen?.()}
      aria-label={`Open flashcard for ${word.term}`}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 18px", borderRadius: 12, minHeight: 44,
        border: `1.5px solid ${hov ? cat.accent : "#F1F5F9"}`,
        background: pressed ? cat.color : hov ? cat.color : "#FAFAFA",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s, transform 0.1s",
        transform: pressed ? "scale(0.98)" : "none",
        gap: 12, outline: "none",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E", letterSpacing: "-0.01em", fontFamily: "'DM Serif Display', serif", marginBottom: 4 }}>
          {word.term}
        </div>
        <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {word.definition}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <Badge level={word.level}/>
        <div style={{ width: 30, height: 44, borderRadius: 8, background: (hov || pressed) ? cat.accent : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={(hov || pressed) ? "#fff" : "#94A3B8"} strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
