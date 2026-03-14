import { useState } from "react";

// Fixed-position prev/next nav buttons shown on desktop inside FlashcardModal.
// direction: "left" | "right"
export function ChevronBtn({ direction, disabled, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "fixed",
        [direction === "left" ? "left" : "right"]: 20,
        top: "50%",
        transform: `translateY(-50%) scale(${hov && !disabled ? 1.08 : 1})`,
        width: 52, height: 52, borderRadius: "50%",
        background: disabled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.97)",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: disabled ? "none" : "0 4px 24px rgba(0,0,0,0.22)",
        transition: "all 0.15s", opacity: disabled ? 0.3 : 1, zIndex: 1010,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke={disabled ? "#94A3B8" : "#1A1A2E"} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
      >
        {direction === "left"
          ? <path d="M15 18l-6-6 6-6"/>
          : <path d="M9 18l6-6-6-6"/>}
      </svg>
    </button>
  );
}
