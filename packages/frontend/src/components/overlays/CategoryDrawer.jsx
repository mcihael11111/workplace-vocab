import { useEffect } from "react";
import { ALL_WORDS } from "../../data/words.js";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { DrawerWordRow } from "./DrawerWordRow.jsx";
import { AdSlot } from "../ui/AdSlot.jsx";

// Right-side panel (desktop) / bottom sheet (mobile) showing all terms in a category.
// onOpenCard(words, index) — called when a term row is clicked.
export function CategoryDrawer({ cat, onClose, onOpenCard }) {
  const words = ALL_WORDS.filter(w => w.category === cat.name);
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

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(10,15,30,0.55)", backdropFilter: "blur(6px)", animation: "overlayIn 0.2s ease forwards" }}
      />
      <div style={{
        position: "fixed", background: "#fff", zIndex: 910,
        display: "flex", flexDirection: "column",
        ...(isMobile ? {
          left: 0, right: 0, bottom: 0, top: "auto",
          borderRadius: "20px 20px 0 0", maxHeight: "88vh",
          boxShadow: "0 -16px 60px rgba(0,0,0,0.18)",
          animation: "sheetUp 0.32s cubic-bezier(0.32,0.72,0,1)",
        } : {
          top: 0, right: 0, bottom: 0,
          width: "min(560px, 92vw)",
          boxShadow: "-24px 0 80px rgba(0,0,0,0.18)",
          animation: "drawerIn 0.3s cubic-bezier(0.32,0.72,0,1)",
        }),
      }}>
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 99, background: "#E2E8F0" }}/>
          </div>
        )}
        <div style={{ padding: "28px 28px 24px", borderBottom: "1px solid #F1F5F9", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: cat.color, borderRadius: 12 }}>
                {cat.icon}
              </span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: cat.accent, margin: 0, marginBottom: 2 }}>
                  {words.length} terms
                </p>
                <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: 0 }}>
                  {cat.name}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ width: 36, height: 36, borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.55 }}>{cat.description}</p>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px 32px" }}>
          {words.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 15, fontWeight: 500 }}>More terms coming soon</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {words.map((word, i) => (
                <>
                  <DrawerWordRow
                    key={word.term}
                    word={word}
                    cat={cat}
                    onOpen={() => onOpenCard(words, i)}
                  />
                  {i === 3 && <AdSlot key="ad-drawer" slot="1205581780" variant="drawer"/>}
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
