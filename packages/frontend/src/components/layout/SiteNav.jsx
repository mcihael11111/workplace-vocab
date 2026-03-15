import { useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize.js";

const NAV_LINKS = [
  ["Categories", "#categories"],
  ["Flashcards",  "#flashcards"],
  ["About",       "#about"],
];

// Sticky top nav. Shows user avatar + progress link when logged in.
export function SiteNav({ user, onOpenLogin, onOpenProgress, onSignOut, signingOut }) {
  const isMobile  = useWindowSize() < 768;
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropOpen, setDropOpen]       = useState(false);

  const isLoading = user === undefined;
  const isLoggedIn = !!user;

  // Avatar: Google photo or initials
  const initials = user?.displayName
    ? user.displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const UserAvatar = () => (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setDropOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1.5px solid #E2E8F0", borderRadius: 99, padding: "4px 12px 4px 4px", cursor: "pointer" }}
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}/>
        ) : (
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1A1A2E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{initials}</span>
          </div>
        )}
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>
          {user?.displayName?.split(" ")[0] || "Account"}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 0.2s", transform: dropOpen ? "rotate(180deg)" : "none" }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {dropOpen && (
        <>
          <div onClick={() => setDropOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 200 }}/>
          <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "6px", minWidth: 180, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 201 }}>
            <button
              onClick={() => { setDropOpen(false); onOpenProgress(); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#1A1A2E", textAlign: "left" }}
              onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              My Progress
            </button>
            <div style={{ height: 1, background: "#F1F5F9", margin: "4px 0" }}/>
            <button
              onClick={() => { setDropOpen(false); onSignOut(); }}
              disabled={signingOut}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, background: "none", border: "none", cursor: signingOut ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 500, color: signingOut ? "#94A3B8" : "#64748B", textAlign: "left" }}
              onMouseEnter={e => { if (!signingOut) e.currentTarget.style.background = "#F8FAFC"; }}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </>
      )}
    </div>
  );

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
              {isLoggedIn ? (
                <>
                  <button onClick={() => { setMenuOpen(false); onOpenProgress(); }} style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>
                    My Progress
                  </button>
                  <button onClick={() => { setMenuOpen(false); onSignOut(); }} disabled={signingOut} style={{ background: "none", color: signingOut ? "#94A3B8" : "#64748B", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "11px 16px", fontSize: 14, fontWeight: 600, cursor: signingOut ? "not-allowed" : "pointer" }}>
                    {signingOut ? "Signing out…" : "Sign out"}
                  </button>
                </>
              ) : (
                <button onClick={() => { setMenuOpen(false); onOpenLogin(); }} style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 8, padding: "12px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>
                  Start learning
                </button>
              )}
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

          {isLoading ? (
            <div style={{ width: 90, height: 34, borderRadius: 8, background: "#F1F5F9", marginLeft: 8 }}/>
          ) : isLoggedIn ? (
            <div style={{ marginLeft: 8 }}><UserAvatar/></div>
          ) : (
            <button
              onClick={onOpenLogin}
              style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginLeft: 8 }}
            >
              Start learning
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
