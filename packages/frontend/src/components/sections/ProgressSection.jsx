// ProgressSection — full-page learning dashboard shown when activeView === "progress".
// Displays all categories with per-term completion status.
// Requires: completedTerms (Set), toggleComplete, onGoHome, onOpenModal
import { useState } from "react";
import { ALL_WORDS } from "../../data/words.js";
import { CATEGORIES } from "../../data/categories.js";
import { Badge } from "../ui/Badge.jsx";

export function ProgressSection({ completedTerms, toggleComplete, onGoHome, onOpenModal }) {
  const [expandedCat, setExpandedCat] = useState(null);

  const totalTerms     = ALL_WORDS.length;
  const totalCompleted = completedTerms.size;
  const pct            = totalTerms > 0 ? Math.round((totalCompleted / totalTerms) * 100) : 0;

  function continueCategory(cat) {
    const words    = ALL_WORDS.filter(w => w.category === cat.name);
    const firstIdx = words.findIndex(w => !completedTerms.has(w.term));
    onOpenModal(words, firstIdx >= 0 ? firstIdx : 0);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F1F5F9", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 60, zIndex: 50 }}>
        <button
          onClick={onGoHome}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#64748B", padding: "6px 0" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          Back to home
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>
          {totalCompleted} / {totalTerms} terms complete
        </span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Progress hero */}
        <div style={{ background: "#1A1A2E", borderRadius: 20, padding: "36px 36px 32px", marginBottom: 36, color: "#fff" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748B", marginBottom: 10 }}>Your progress</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            <h2 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, letterSpacing: "-0.04em", fontFamily: "'DM Serif Display', Georgia, serif", lineHeight: 1.1 }}>
              {pct === 100 ? "All done!" : pct === 0 ? "Let's get started" : `${pct}% complete`}
            </h2>
            <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.04em", fontFamily: "'DM Serif Display', serif", color: "#94A3B8" }}>
              {totalCompleted}<span style={{ fontSize: 24, color: "#475569" }}>/{totalTerms}</span>
            </span>
          </div>
          {/* Overall progress bar */}
          <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: "#22C55E", width: `${pct}%`, transition: "width 0.5s ease" }}/>
          </div>
        </div>

        {/* Category list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CATEGORIES.map(cat => {
            const words    = ALL_WORDS.filter(w => w.category === cat.name);
            if (words.length === 0) return null;
            const done     = words.filter(w => completedTerms.has(w.term)).length;
            const catPct   = Math.round((done / words.length) * 100);
            const isOpen   = expandedCat === cat.id;
            const allDone  = done === words.length;

            return (
              <div key={cat.id} style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14, overflow: "hidden" }}>

                {/* Category header row */}
                <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 20, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: cat.color, borderRadius: 10, flexShrink: 0 }}>
                    {cat.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E", letterSpacing: "-0.01em" }}>{cat.name}</span>
                      {allDone && (
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#16A34A", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 99, padding: "2px 8px" }}>Complete</span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 99, background: allDone ? "#22C55E" : cat.accent, width: `${catPct}%`, transition: "width 0.4s ease" }}/>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", whiteSpace: "nowrap" }}>{done}/{words.length}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    {!allDone && (
                      <button
                        onClick={() => continueCategory(cat)}
                        style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: cat.accent, border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        {done === 0 ? "Start →" : "Continue →"}
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedCat(isOpen ? null : cat.id)}
                      style={{ width: 32, height: 32, borderRadius: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded term list */}
                {isOpen && (
                  <div style={{ borderTop: "1px solid #F1F5F9", padding: "12px 20px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                    {words.map((word, i) => {
                      const done = completedTerms.has(word.term);
                      return (
                        <div
                          key={word.term}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: done ? "#F0FDF4" : "#FAFAFA", border: `1px solid ${done ? "#BBF7D0" : "#F1F5F9"}`, gap: 12 }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                            {/* Complete toggle */}
                            <button
                              onClick={() => toggleComplete(word.term)}
                              style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${done ? "#22C55E" : "#CBD5E1"}`, background: done ? "#22C55E" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
                            >
                              {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                            </button>
                            <span style={{ fontWeight: 600, fontSize: 14, color: done ? "#16A34A" : "#1A1A2E", textDecoration: done ? "line-through" : "none", fontFamily: "'DM Serif Display', serif" }}>
                              {word.term}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                            <Badge level={word.level}/>
                            <button
                              onClick={() => onOpenModal(words, i)}
                              style={{ width: 28, height: 28, borderRadius: 7, background: "#F1F5F9", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
