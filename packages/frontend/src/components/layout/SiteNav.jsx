import { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize.js";

const NAV_LINKS = [
  ["Categories", "#categories"],
  ["Flashcards",  "#flashcards"],
  ["About",       "#about"],
];

// Sticky top nav. Collapses to a hamburger menu on mobile.
export function SiteNav() {
  const isMobile = useWindowSize() < 768;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F1F5F9", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, background: "#1A1A2E", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "serif" }}>W</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>Workplace Vocab</span>
      </div>

      {isMobile ? (
        <>
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5, alignItems: "center", justifyContent: "center" }}
          >
            <span style={{ display: "block", width: 22, height: 2, background: "#1A1A2E", borderRadius: 99, transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(4px,4px)" : "none" }}/>
            <span style={{ display: "block", width: 22, height: 2, background: "#1A1A2E", borderRadius: 99, transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }}/>
            <span style={{ display: "block", width: 22, height: 2, background: "#1A1A2E", borderRadius: 99, transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(4px,-4px)" : "none" }}/>
          </button>
          {menuOpen && (
            <div style={{ position: "fixed", top: 60, left: 0, right: 0, background: "#fff", borderBottom: "1px solid #F1F5F9", padding: "12px 24px 20px", zIndex: 99, display: "flex", flexDirection: "column", gap: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
              {NAV_LINKS.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setMenuOpen(false)} style={{ padding: "12px 8px", fontSize: 15, fontWeight: 600, color: "#1A1A2E", textDecoration: "none", borderBottom: "1px solid #F8FAFC", display: "block" }}>
                  {label}
                </a>
              ))}
              <button style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>
                Start learning
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {NAV_LINKS.map(([item, href]) => (
            <a
              key={item} href={href}
              style={{ padding: "6px 12px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#64748B", textDecoration: "none", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#1A1A2E"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none";    e.currentTarget.style.color = "#64748B"; }}
            >
              {item}
            </a>
          ))}
          <button style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginLeft: 8 }}>
            Start learning
          </button>
        </div>
      )}
    </nav>
  );
}
