import { useState } from "react";
import { Badge } from "../ui/Badge.jsx";
import { CAT_MAP } from "../../utils/termLookup.js";

// Featured flashcard tile shown in the grid section.
// Clicking opens the FlashcardModal via onOpen.
export function GridCard({ word, onOpen, isDone = false }) {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);
  const cat = CAT_MAP[word.category] || { accent: "#1A1A2E", color: "#F8FAFC" };

  const scale = pressed ? "scale(0.97)" : hov ? "translateY(-3px)" : "none";
  const shadow = pressed
    ? "0 1px 4px rgba(0,0,0,0.06)"
    : hov
    ? "0 12px 32px rgba(0,0,0,0.09)"
    : "0 1px 4px rgba(0,0,0,0.04)";

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
        background: isDone ? "#F0FDF4" : "#fff",
        border: `1.5px solid ${isDone ? "#86EFAC" : hov ? cat.accent : "#E2E8F0"}`,
        borderRadius: 16, padding: 28, cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease",
        transform: scale,
        boxShadow: shadow,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        height: 210, position: "relative", outline: "none",
      }}
    >
      {isDone && (
        <div style={{ position: "absolute", top: 14, right: 14, width: 22, height: 22, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
      )}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: isDone ? "#16A34A" : cat.accent }}>
            {word.category}
          </span>
          {!isDone && <Badge level={word.level}/>}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#1A1A2E", letterSpacing: "-0.03em", lineHeight: 1.15, fontFamily: "'DM Serif Display', Georgia, serif" }}>
          {word.term}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: isDone ? "#16A34A" : "#94A3B8", fontSize: 12 }}>
          {isDone ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              Completed
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              Tap to learn
            </>
          )}
        </span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: isDone ? "#22C55E" : (hov || pressed) ? cat.accent : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDone || hov || pressed ? "#fff" : "#94A3B8"} strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
