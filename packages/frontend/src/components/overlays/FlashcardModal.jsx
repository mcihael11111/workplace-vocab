import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/Badge.jsx";
import { RelatedChip } from "../ui/RelatedChip.jsx";
import { ChevronBtn } from "../ui/ChevronBtn.jsx";
import { CAT_MAP, findTermByName, isTermLocked } from "../../utils/termLookup.js";
import { useWindowSize } from "../../hooks/useWindowSize.js";

// Full flashcard overlay.
// Desktop: centred modal with fixed ChevronBtns.
// Mobile: bottom sheet with swipe left/right to navigate.
export function FlashcardModal({ words, activeIndex, onClose, onPrev, onNext, onOpenRelated, onUpgrade, isPro = false, user, completedTerms = new Set(), onToggleComplete }) {
  const word   = words[activeIndex];
  const locked = isPro ? false : isTermLocked(word.term);
  const cat    = CAT_MAP[word.category] || { accent: "#1A1A2E", color: "#F8FAFC", icon: "📖" };
  const isDone = completedTerms.has(word.term);
  const total = words.length;
  const isMobile = useWindowSize() < 768;
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);

  useEffect(() => { setScenarioOpen(false); setConversationOpen(false); }, [activeIndex]);

  // Keyboard nav
  useEffect(() => {
    const h = e => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Reset scroll on card change
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [activeIndex]);

  // Touch swipe
  const touchStartX = useRef(null);
  const handleTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = e => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? onNext() : onPrev(); }
    touchStartX.current = null;
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,15,30,0.72)", backdropFilter: "blur(8px)", animation: "overlayIn 0.2s ease forwards" }}/>
      {!isMobile && <ChevronBtn direction="left"  disabled={activeIndex === 0}         onClick={onPrev}/>}
      {!isMobile && <ChevronBtn direction="right" disabled={activeIndex === total - 1} onClick={onNext}/>}

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "fixed", zIndex: 1005, background: "#fff",
          ...(isMobile ? {
            left: 0, right: 0, bottom: 0, top: "auto",
            borderRadius: "20px 20px 0 0", maxHeight: "92vh",
            transform: "none", width: "100%",
            animation: "sheetUp 0.32s cubic-bezier(0.32,0.72,0,1)",
          } : {
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: "min(680px, calc(100vw - 144px))", height: "80vh",
            borderRadius: 24,
            animation: "cardIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
          }),
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
        }}
      >
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 99, background: "#E2E8F0" }}/>
          </div>
        )}

        {/* Header */}
        <div style={{ padding: isMobile ? "16px 20px 16px" : "24px 28px 20px", borderBottom: "1px solid #F1F5F9", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 3, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, background: cat.accent, width: `${((activeIndex + 1) / total) * 100}%`, transition: "width 0.3s ease" }}/>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", whiteSpace: "nowrap" }}>{activeIndex + 1} / {total}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: cat.color, borderRadius: 8 }}>{cat.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: cat.accent }}>{word.category}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Badge level={word.level}/>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#1A1A2E", fontFamily: "'DM Serif Display', Georgia, serif", margin: 0 }}>
            {word.term}
          </h2>
        </div>

        {/* Scrollable body */}
        {locked ? (
          <div ref={scrollRef} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "32px 24px" : "40px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            {/* blurred ghost content */}
            <div style={{ position: "absolute", inset: 0, padding: isMobile ? "20px 20px 24px" : "28px 28px 24px", filter: "blur(8px)", opacity: 0.35, userSelect: "none", pointerEvents: "none" }}>
              <p style={{ fontSize: 17, color: "#1A1A2E", lineHeight: 1.72, marginBottom: 24 }}>{word.definition}</p>
              <p style={{ fontSize: 15, color: "#1E293B", lineHeight: 1.72 }}>{word.whyItMatters}</p>
            </div>
            {/* lock CTA */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E", margin: "0 0 6px", fontFamily: "'DM Serif Display', serif" }}>This card is locked</p>
                <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.55 }}>Upgrade to Pro to unlock all 200+ terms<br/>across every category.</p>
              </div>
              <button
                onClick={onUpgrade}
                style={{ background: "#7C3AED", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em" }}
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        ) : (
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 20px 24px" : "24px 24px 24px" }}>
          <section style={{ marginBottom: 26 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 10 }}>What it means</p>
            <p style={{ fontSize: 16, color: "#1A1A2E", lineHeight: 1.72, margin: 0 }}>{word.definition}</p>
          </section>
          <div style={{ height: 1, background: "#F1F5F9", marginBottom: 26 }}/>
          <section style={{ marginBottom: 26 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 10 }}>Why it matters</p>
            <p style={{ fontSize: 16, color: "#1E293B", lineHeight: 1.72, margin: 0 }}>{word.whyItMatters}</p>
          </section>
          <div style={{ height: 1, background: "#F1F5F9", marginBottom: 12 }}/>
          <section style={{ marginBottom: 12, border: "1.5px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
            <button onClick={() => setScenarioOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: scenarioOpen ? "#F1F5F9" : "#F8FAFC", border: "none", padding: "12px 16px", cursor: "pointer" }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#475569" }}>Example</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: scenarioOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div style={{ overflow: "hidden", maxHeight: scenarioOpen ? "600px" : "0", transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease", opacity: scenarioOpen ? 1 : 0 }}>
              <div style={{ borderTop: "1.5px solid #E2E8F0", padding: "14px 16px", background: "#F8FAFC" }}>
                <p style={{ fontSize: 15, color: "#1E293B", lineHeight: 1.72, margin: 0 }}>{word.scenario}</p>
              </div>
            </div>
          </section>
          <div style={{ height: 1, background: "#F1F5F9", marginBottom: 12 }}/>
          <section style={{ marginBottom: 26, border: "1.5px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
            <button onClick={() => setConversationOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: conversationOpen ? "#F1F5F9" : "#F8FAFC", border: "none", padding: "12px 16px", cursor: "pointer" }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#475569" }}>In a real conversation</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: conversationOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div style={{ overflow: "hidden", maxHeight: conversationOpen ? "600px" : "0", transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease", opacity: conversationOpen ? 1 : 0 }}>
              <div style={{ borderTop: "1.5px solid #E2E8F0", padding: "14px 16px", background: "#F8FAFC", borderLeft: `4px solid ${cat.accent}` }}>
                <p style={{ fontSize: 15, color: "#1E293B", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>{word.example}</p>
              </div>
            </div>
          </section>
          {word.related && (
            <section>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 12 }}>Related terms</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {word.related.map(r => {
                  const linked = findTermByName(r);
                  return (
                    <RelatedChip
                      key={r}
                      label={r}
                      linked={!!linked}
                      color={cat.color}
                      accent={cat.accent}
                      onClick={linked ? () => onOpenRelated(linked) : undefined}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>
        )}

        {/* Footer */}
        <div style={{ padding: "14px 28px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, background: "#FAFAFA", gap: 8 }}>
          <button onClick={onPrev} disabled={activeIndex === 0} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: activeIndex === 0 ? "#CBD5E1" : "#475569", cursor: activeIndex === 0 ? "not-allowed" : "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>Previous
          </button>

          {user && (
            <button
              onClick={() => onToggleComplete(word.term)}
              style={{ display: "flex", alignItems: "center", gap: 6, border: `1.5px solid ${isDone ? "#22C55E" : "#E2E8F0"}`, borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", background: isDone ? "#F0FDF4" : "#fff", color: isDone ? "#16A34A" : "#64748B", transition: "all 0.15s", whiteSpace: "nowrap" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              {isDone ? "Completed" : "Mark done"}
            </button>
          )}

          <button onClick={onNext} disabled={activeIndex === total - 1} style={{ display: "flex", alignItems: "center", gap: 6, background: activeIndex === total - 1 ? "#F8FAFC" : "#1A1A2E", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, color: activeIndex === total - 1 ? "#CBD5E1" : "#fff", cursor: activeIndex === total - 1 ? "not-allowed" : "pointer" }}>
            Next<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </>
  );
}
