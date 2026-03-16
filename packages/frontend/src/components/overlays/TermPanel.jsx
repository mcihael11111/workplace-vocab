import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Inbox } from "lucide-react";
import { Badge }        from "../ui/Badge.jsx";
import { RelatedChip }  from "../ui/RelatedChip.jsx";
import { CAT_MAP, findTermByName } from "../../utils/termLookup.js";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { ALL_WORDS }    from "../../data/words.js";
import { BookOpen }     from "lucide-react";

// TermPanel — category list (screen 1) + flashcard detail (screen 2).
// Mobile: smooth real-time drag gesture (sheet follows finger), scroll-area handoff.
// Inspired by Google Maps / Apple Maps bottom sheet pattern.
export function TermPanel({
  cat, onClose,
  isPro = false, unlockedTerms, viewedTerms = new Set(),
  isViewLimitReached = false, onView,
  user, completedTerms = new Set(), onToggleComplete, onUpgrade,
}) {
  const words    = ALL_WORDS.filter(w => w.category === cat.name);
  const isMobile = useWindowSize() < 768;

  const [view,             setView]             = useState("list");
  const [activeIndex,      setActiveIndex]      = useState(0);
  const [scenarioOpen,     setScenarioOpen]     = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);
  const [isExpanded,       setIsExpanded]       = useState(false);

  const panelRef        = useRef(null);
  const detailScrollRef = useRef(null);
  const listScrollRef   = useRef(null);

  // ── Real-time drag state (refs only — no re-renders during drag) ───────────
  const dragStartY   = useRef(null);
  const dragPrevY    = useRef(null);
  const dragVelocity = useRef(0);
  const isDragging   = useRef(false);

  // Apply transform directly to DOM — bypasses React render loop for 60fps
  const applyTransform = (offsetY) => {
    if (!panelRef.current) return;
    if (offsetY > 0) {
      panelRef.current.style.transform  = `translateY(${offsetY}px)`;
      panelRef.current.style.transition = "border-radius 0.35s ease"; // no height/transform transition while dragging
    } else {
      panelRef.current.style.transform  = "";
      panelRef.current.style.transition = ""; // restore CSS class transitions
    }
  };

  const snapOrClose = (isExpandedCurrent) => {
    applyTransform(0);
    if (isExpandedCurrent) {
      setIsExpanded(false);
      if (listScrollRef.current)   listScrollRef.current.scrollTop   = 0;
      if (detailScrollRef.current) detailScrollRef.current.scrollTop = 0;
    } else {
      onClose();
    }
  };

  // ── Handle / header drag (drag handle + list header + detail header) ───────
  const onHandleTouchStart = (e) => {
    dragStartY.current   = e.touches[0].clientY;
    dragPrevY.current    = e.touches[0].clientY;
    dragVelocity.current = 0;
    isDragging.current   = true;
  };
  const onHandleTouchMove = (e) => {
    if (!isDragging.current) return;
    const y  = e.touches[0].clientY;
    dragVelocity.current = y - dragPrevY.current;
    dragPrevY.current    = y;
    const dy = Math.max(0, y - dragStartY.current);
    applyTransform(dy);
  };
  const onHandleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dy  = Math.max(0, dragPrevY.current - dragStartY.current);
    const vel = dragVelocity.current;
    if (vel > 4 || dy > window.innerHeight * 0.18) snapOrClose(isExpanded);
    else applyTransform(0);
    dragStartY.current = null;
  };

  // ── Scroll-area drag handoff (non-passive so we can preventDefault) ────────
  // When content is at scroll-top and user drags down → hand off to sheet drag.
  useEffect(() => {
    if (!isMobile) return;

    const onScrollTouchStart = (e) => {
      dragStartY.current   = e.touches[0].clientY;
      dragPrevY.current    = e.touches[0].clientY;
      dragVelocity.current = 0;
      isDragging.current   = false; // not yet — wait for downward move at top
    };

    const onScrollTouchMove = (e) => {
      const scrollEl = e.currentTarget;
      const y   = e.touches[0].clientY;
      const dy  = y - (dragStartY.current ?? y);
      dragVelocity.current = y - (dragPrevY.current ?? y);
      dragPrevY.current    = y;

      if (!isDragging.current) {
        // Start sheet drag only when pulling down from the very top
        if (dy > 6 && scrollEl.scrollTop <= 0) {
          isDragging.current   = true;
          dragStartY.current   = y; // reset origin so drag starts from here
        }
        return; // let scroll behave normally otherwise
      }

      // Actively dragging the sheet — prevent scroll
      e.preventDefault();
      applyTransform(Math.max(0, y - dragStartY.current));
    };

    const onScrollTouchEnd = () => {
      if (!isDragging.current) { dragStartY.current = null; return; }
      isDragging.current = false;
      const dy  = Math.max(0, (dragPrevY.current ?? 0) - (dragStartY.current ?? 0));
      const vel = dragVelocity.current;
      if (vel > 4 || dy > window.innerHeight * 0.18) snapOrClose(isExpanded);
      else applyTransform(0);
      dragStartY.current = null;
    };

    const opts    = { passive: false };
    const optsP   = { passive: true  };
    const listEl  = listScrollRef.current;
    const detailEl = detailScrollRef.current;

    listEl?.addEventListener("touchstart", onScrollTouchStart, optsP);
    listEl?.addEventListener("touchmove",  onScrollTouchMove,  opts);
    listEl?.addEventListener("touchend",   onScrollTouchEnd,   optsP);

    detailEl?.addEventListener("touchstart", onScrollTouchStart, optsP);
    detailEl?.addEventListener("touchmove",  onScrollTouchMove,  opts);
    detailEl?.addEventListener("touchend",   onScrollTouchEnd,   optsP);

    return () => {
      listEl?.removeEventListener("touchstart", onScrollTouchStart);
      listEl?.removeEventListener("touchmove",  onScrollTouchMove);
      listEl?.removeEventListener("touchend",   onScrollTouchEnd);
      detailEl?.removeEventListener("touchstart", onScrollTouchStart);
      detailEl?.removeEventListener("touchmove",  onScrollTouchMove);
      detailEl?.removeEventListener("touchend",   onScrollTouchEnd);
    };
  }, [isMobile, isExpanded]); // re-bind when isExpanded changes so snapOrClose captures correct value

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Keyboard
  useEffect(() => {
    const h = e => {
      if (e.key !== "Escape") return;
      if (view === "detail") { setView("list"); setIsExpanded(false); }
      else onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [view, onClose]);

  const word   = words[activeIndex];
  const locked = word && !isPro && isViewLimitReached
    && !viewedTerms.has(word.term)
    && !unlockedTerms?.has(word.term);

  useEffect(() => {
    if (view !== "detail" || !word) return;
    setScenarioOpen(false);
    setConversationOpen(false);
    if (!locked) onView?.(word.term);
  }, [view, activeIndex]);

  useEffect(() => {
    if (detailScrollRef.current) detailScrollRef.current.scrollTop = 0;
  }, [activeIndex]);

  const handleListScroll = (e) => {
    if (!isExpanded && e.target.scrollTop > 20) setIsExpanded(true);
  };

  function openTerm(i) {
    setActiveIndex(i);
    setView("detail");
    if (isMobile) setIsExpanded(true);
  }

  const isDone  = word && completedTerms.has(word.term);
  const wordCat = (word && CAT_MAP[word.category]) || { accent: cat.accent, color: cat.color, icon: BookOpen };

  // ── Panel shell ───────────────────────────────────────────────────────────
  const panelStyle = {
    position: "fixed", background: "#fff", zIndex: 910,
    display: "flex", flexDirection: "column",
    // CSS transitions for snap-back and height changes
    transition: "height 0.35s cubic-bezier(0.32,0.72,0,1), border-radius 0.35s ease",
    ...(isMobile ? {
      left: 0, right: 0, bottom: 0, top: "auto",
      borderRadius: isExpanded ? "0" : "20px 20px 0 0",
      height: isExpanded ? "100dvh" : "80vh",
      boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
      animation: "sheetUp 0.32s cubic-bezier(0.32,0.72,0,1)",
    } : {
      top: 0, right: 0, bottom: 0,
      width: "min(560px, 92vw)",
      borderRadius: "24px 0 0 24px",
      boxShadow: "-24px 0 80px rgba(0,0,0,0.18)",
      animation: "drawerIn 0.3s cubic-bezier(0.32,0.72,0,1)",
    }),
  };

  const slideBase   = { position: "absolute", inset: 0, display: "flex", flexDirection: "column", transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden" };
  const listSlide   = { ...slideBase, transform: view === "list"   ? "translateX(0)" : "translateX(-100%)" };
  const detailSlide = { ...slideBase, transform: view === "detail" ? "translateX(0)" : "translateX(100%)"  };

  const P = isMobile ? 16 : 28;

  const CloseBtn = () => (
    <button
      onClick={onClose} aria-label="Close"
      style={{ width: 36, height: 36, borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(10,15,30,0.55)", backdropFilter: "blur(6px)", animation: "overlayIn 0.2s ease forwards" }}/>

      <div ref={panelRef} style={panelStyle}>

        {/* Drag handle */}
        {isMobile && (
          <div
            onTouchStart={onHandleTouchStart}
            onTouchMove={onHandleTouchMove}
            onTouchEnd={onHandleTouchEnd}
            role="button" aria-label="Drag to close or collapse"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 36, cursor: "grab", flexShrink: 0, touchAction: "none" }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 99, background: "#CBD5E1" }}/>
          </div>
        )}

        {/* Sliding viewport */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>

          {/* ── SCREEN 1: LIST ──────────────────────────────────────────── */}
          <div style={listSlide}>

            {/* List header — also a drag target */}
            <div
              onTouchStart={isMobile ? onHandleTouchStart : undefined}
              onTouchMove={isMobile ? onHandleTouchMove   : undefined}
              onTouchEnd={isMobile  ? onHandleTouchEnd    : undefined}
              style={{ padding: `${isMobile ? 16 : 24}px ${P}px 16px`, borderBottom: "1px solid #F1F5F9", flexShrink: 0, touchAction: "none" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: cat.color, borderRadius: 12, flexShrink: 0 }}>
                    <cat.icon size={22} color={cat.accent} strokeWidth={1.75}/>
                  </span>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: cat.accent, margin: "0 0 2px" }}>
                      {words.length} terms
                    </p>
                    <h3 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: 0 }}>
                      {cat.name}
                    </h3>
                  </div>
                </div>
                <CloseBtn/>
              </div>
              <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.5 }}>{cat.description}</p>
            </div>

            {/* List body — scroll handoff handled by useEffect */}
            <div
              ref={listScrollRef}
              onScroll={isMobile ? handleListScroll : undefined}
              style={{ flex: 1, overflowY: "auto", padding: `16px ${P}px`, WebkitOverflowScrolling: "touch" }}
            >
              {words.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <Inbox size={32} color="#CBD5E1" strokeWidth={1.5}/>
                  <p style={{ fontSize: 15, fontWeight: 500, color: "#94A3B8", margin: 0 }}>More terms coming soon</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: "env(safe-area-inset-bottom, 16px)" }}>
                  {words.map((w, i) => (
                    <TermRow key={w.term} word={w} cat={cat} onOpen={() => openTerm(i)}/>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── SCREEN 2: DETAIL ────────────────────────────────────────── */}
          <div style={detailSlide}>
            {word && (
              <>
                {/* Detail header — also a drag target */}
                <div
                  onTouchStart={isMobile ? onHandleTouchStart : undefined}
                  onTouchMove={isMobile ? onHandleTouchMove   : undefined}
                  onTouchEnd={isMobile  ? onHandleTouchEnd    : undefined}
                  style={{ padding: `${isMobile ? 12 : 20}px ${P}px 14px`, borderBottom: "1px solid #F1F5F9", flexShrink: 0, touchAction: "none" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <button
                      onClick={() => { setView("list"); setIsExpanded(false); }}
                      aria-label="Back to list"
                      style={{ display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: "4px 0", fontSize: 13, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}
                    >
                      <ChevronLeft size={15} strokeWidth={2.5}/> {cat.name}
                    </button>
                    <div style={{ flex: 1, height: 3, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, background: cat.accent, width: `${((activeIndex + 1) / words.length) * 100}%`, transition: "width 0.3s ease" }}/>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", whiteSpace: "nowrap" }}>{activeIndex + 1} / {words.length}</span>
                    <CloseBtn/>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: wordCat.color, borderRadius: 6 }}>
                        <wordCat.icon size={12} color={wordCat.accent} strokeWidth={1.75}/>
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: wordCat.accent }}>{word.category}</span>
                    </div>
                    <Badge level={word.level}/>
                  </div>
                  <h2 style={{ fontSize: isMobile ? "clamp(22px,5vw,28px)" : "clamp(24px,4vw,32px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#1A1A2E", fontFamily: "'DM Serif Display', Georgia, serif", margin: 0 }}>
                    {word.term}
                  </h2>
                </div>

                {/* Detail body */}
                {locked ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, padding: 20, filter: "blur(8px)", opacity: 0.35, userSelect: "none", pointerEvents: "none" }}>
                      <p style={{ fontSize: 15, color: "#1A1A2E", lineHeight: 1.72 }}>{word.definition}</p>
                    </div>
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </div>
                      <div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A2E", margin: "0 0 6px", fontFamily: "'DM Serif Display', serif" }}>You've read your 9 free cards</p>
                        <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.55 }}>Upgrade to Pro to unlock all cards.</p>
                      </div>
                      <button onClick={onUpgrade} style={{ background: "#7C3AED", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 44 }}>
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    ref={detailScrollRef}
                    style={{ flex: 1, overflowY: "auto", padding: `16px ${P}px 20px`, WebkitOverflowScrolling: "touch" }}
                  >
                    <section style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 10 }}>What it means</p>
                      <p style={{ fontSize: 16, color: "#1A1A2E", lineHeight: 1.72, margin: 0 }}>{word.definition}</p>
                    </section>
                    <div style={{ height: 1, background: "#F1F5F9", marginBottom: 16 }}/>
                    <section style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 10 }}>Why it matters</p>
                      <p style={{ fontSize: 16, color: "#1E293B", lineHeight: 1.72, margin: 0 }}>{word.whyItMatters}</p>
                    </section>
                    <div style={{ height: 1, background: "#F1F5F9", marginBottom: 12 }}/>
                    <section style={{ marginBottom: 12, border: "1.5px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
                      <button onClick={() => setScenarioOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: scenarioOpen ? "#F1F5F9" : "#F8FAFC", border: "none", padding: "14px 16px", cursor: "pointer", minHeight: 44 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#475569" }}>Example</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: scenarioOpen ? "rotate(180deg)" : "none", flexShrink: 0 }}><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      <div style={{ overflow: "hidden", maxHeight: scenarioOpen ? "600px" : 0, transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease", opacity: scenarioOpen ? 1 : 0 }}>
                        <div style={{ borderTop: "1.5px solid #E2E8F0", padding: "14px 16px", background: "#F8FAFC" }}>
                          <p style={{ fontSize: 15, color: "#1E293B", lineHeight: 1.72, margin: 0 }}>{word.scenario}</p>
                        </div>
                      </div>
                    </section>
                    <div style={{ height: 1, background: "#F1F5F9", marginBottom: 12 }}/>
                    <section style={{ marginBottom: 16, border: "1.5px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
                      <button onClick={() => setConversationOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: conversationOpen ? "#F1F5F9" : "#F8FAFC", border: "none", padding: "14px 16px", cursor: "pointer", minHeight: 44 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#475569" }}>In a real conversation</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: conversationOpen ? "rotate(180deg)" : "none", flexShrink: 0 }}><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      <div style={{ overflow: "hidden", maxHeight: conversationOpen ? "600px" : 0, transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease", opacity: conversationOpen ? 1 : 0 }}>
                        <div style={{ borderTop: "1.5px solid #E2E8F0", padding: "14px 16px", background: "#F8FAFC", borderLeft: `4px solid ${cat.accent}` }}>
                          <p style={{ fontSize: 15, color: "#1E293B", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>{word.example}</p>
                        </div>
                      </div>
                    </section>
                    {word.related?.length > 0 && (
                      <section style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 12 }}>Related terms</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {word.related.map(r => {
                            const linked = findTermByName(r);
                            const inCat  = linked && words.some(w => w.term === linked.term);
                            return (
                              <RelatedChip key={r} label={r} linked={!!linked} color={cat.color} accent={cat.accent}
                                onClick={inCat ? () => setActiveIndex(words.findIndex(w => w.term === linked.term)) : undefined}
                              />
                            );
                          })}
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {user && !locked && (
                  <div style={{ padding: isMobile ? "10px 16px" : "12px 28px", paddingBottom: isMobile ? "calc(10px + env(safe-area-inset-bottom, 0px))" : "12px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "center", flexShrink: 0, background: "#FAFAFA" }}>
                    <button
                      onClick={() => onToggleComplete(word.term)}
                      aria-label={isDone ? "Mark as not done" : "Mark as done"}
                      style={{ display: "flex", alignItems: "center", gap: 6, border: `1.5px solid ${isDone ? "#22C55E" : "#E2E8F0"}`, borderRadius: 8, padding: "0 20px", height: 44, fontSize: 13, fontWeight: 600, cursor: "pointer", background: isDone ? "#F0FDF4" : "#fff", color: isDone ? "#16A34A" : "#64748B", transition: "all 0.15s" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                      {isDone ? "Completed" : "Mark done"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Term row ─────────────────────────────────────────────────────────────────
function TermRow({ word, cat, onOpen }) {
  const [hov,     setHov]     = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onOpen?.()}
      aria-label={`Open ${word.term}`}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, minHeight: 44, gap: 12, border: `1.5px solid ${hov ? cat.accent : "#F1F5F9"}`, background: pressed ? cat.color : hov ? cat.color : "#FAFAFA", cursor: "pointer", transition: "border-color 0.15s, background 0.15s, transform 0.1s", transform: pressed ? "scale(0.98)" : "none", outline: "none" }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E", letterSpacing: "-0.01em", fontFamily: "'DM Serif Display', serif", marginBottom: 3 }}>{word.term}</div>
        <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{word.definition}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <Badge level={word.level}/>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: (hov || pressed) ? cat.accent : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s", flexShrink: 0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={(hov || pressed) ? "#fff" : "#94A3B8"} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>
  );
}
