import { useEffect } from "react";
import { useWindowSize } from "../../hooks/useWindowSize.js";

const MILESTONES = [
  { count: 3,   label: "First Steps",     sub: "3 cards read"  },
  { count: 10,  label: "Getting Started", sub: "10 cards read" },
  { count: 25,  label: "On a Roll",       sub: "25 cards read" },
  { count: 50,  label: "Vocab Master",    sub: "50 cards read" },
];

// Achievement sheet shown when a milestone is reached (e.g. 3 cards read).
// currentCount — the milestone count just hit (e.g. 3)
// onClose — called when "Continue learning" is tapped
export function MilestoneSheet({ currentCount, onClose }) {
  const isMobile = useWindowSize() < 768;

  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const currentIdx = MILESTONES.findIndex(m => m.count === currentCount);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1100,
          background: "rgba(10,15,30,0.78)",
          backdropFilter: "blur(10px)",
          animation: "overlayIn 0.2s ease forwards",
        }}
      />

      {/* Sheet */}
      <div style={{
        position: "fixed", zIndex: 1110,
        background: "#fff",
        ...(isMobile ? {
          left: 0, right: 0, bottom: 0,
          borderRadius: "24px 24px 0 0",
          padding: "32px 24px 40px",
          animation: "sheetUp 0.35s cubic-bezier(0.32,0.72,0,1)",
        } : {
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(440px, calc(100vw - 48px))",
          borderRadius: 24,
          padding: "40px 36px 36px",
          animation: "cardIn 0.32s cubic-bezier(0.34,1.56,0.64,1)",
        }),
        boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center",
      }}>

        {/* Trophy */}
        <div style={{
          width: 96, height: 96, borderRadius: 28,
          background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 52, marginBottom: 24,
          boxShadow: "0 0 0 8px #FEF9EC, 0 0 0 16px #FEF3C7",
          animation: "trophyPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s both",
        }}>
          🏆
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em",
          fontFamily: "'DM Serif Display', Georgia, serif",
          color: "#1A1A2E", margin: "0 0 8px",
        }}>
          Congratulations!
        </h2>
        <p style={{ fontSize: 15, color: "#64748B", margin: "0 0 32px", lineHeight: 1.5 }}>
          You've read your first <strong style={{ color: "#1A1A2E" }}>3 cards</strong>.<br/>
          Keep going to unlock the next level.
        </p>

        {/* Milestone track */}
        <div style={{
          display: "flex", gap: 8, width: "100%",
          marginBottom: 32, justifyContent: "center",
        }}>
          {MILESTONES.map((m, i) => {
            const isUnlocked = i <= currentIdx;
            return (
              <div key={m.count} style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6,
                padding: "14px 8px",
                borderRadius: 14,
                background: isUnlocked ? "#FFFBEB" : "#F8FAFC",
                border: `1.5px solid ${isUnlocked ? "#FDE68A" : "#E2E8F0"}`,
              }}>
                <span style={{
                  fontSize: 22,
                  filter: isUnlocked ? "none" : "grayscale(1)",
                  opacity: isUnlocked ? 1 : 0.35,
                }}>
                  🏆
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: isUnlocked ? "#D97706" : "#CBD5E1",
                  letterSpacing: "0.02em",
                }}>
                  {m.count}
                </span>
                <span style={{
                  fontSize: 10, color: isUnlocked ? "#92400E" : "#CBD5E1",
                  fontWeight: 500, textAlign: "center", lineHeight: 1.3,
                }}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          style={{
            width: "100%", height: 48, borderRadius: 12,
            background: "#1A1A2E", color: "#fff",
            border: "none", fontSize: 15, fontWeight: 700,
            cursor: "pointer", letterSpacing: "0.01em",
          }}
        >
          Continue learning
        </button>

      </div>

      <style>{`
        @keyframes trophyPop {
          from { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
