import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useWindowSize } from "../../hooks/useWindowSize.js";
import { ALL_WORDS } from "../../data/words.js";

const ANCHOR_LINKS = [
  ["Categories", "/categories"],
  ["Flashcards",  "/#flashcards"],
];

export function SiteNav({ user, onOpenLogin, onOpenProgress, onSignOut, signingOut, completedTerms = new Set() }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile   = useWindowSize() < 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const isLoading  = user === undefined;
  const isLoggedIn = !!user;

  const total = ALL_WORDS.length;
  const done  = completedTerms.size;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  const initials = user?.displayName
    ? user.displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  // ── Bottom sheet drag-to-dismiss ──────────────────────────────────────────
  const sheetRef     = useRef(null);
  const dragStartY   = useRef(null);
  const dragPrevY    = useRef(null);
  const dragVelocity = useRef(0);
  const isDragging   = useRef(false);

  const applyTransform = (offsetY) => {
    if (!sheetRef.current) return;
    if (offsetY > 0) {
      sheetRef.current.style.transform  = `translateY(${offsetY}px)`;
      sheetRef.current.style.transition = "none";
    } else {
      sheetRef.current.style.transform  = "";
      sheetRef.current.style.transition = "";
    }
  };

  const onTouchStart = (e) => {
    dragStartY.current   = e.touches[0].clientY;
    dragPrevY.current    = e.touches[0].clientY;
    dragVelocity.current = 0;
    isDragging.current   = true;
  };
  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    const y = e.touches[0].clientY;
    dragVelocity.current = y - dragPrevY.current;
    dragPrevY.current    = y;
    const dy = Math.max(0, y - dragStartY.current);
    applyTransform(dy);
  };
  const onTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dy  = Math.max(0, (dragPrevY.current ?? 0) - (dragStartY.current ?? 0));
    const vel = dragVelocity.current;
    if (vel > 4 || dy > window.innerHeight * 0.15) {
      setMenuOpen(false);
    } else {
      applyTransform(0);
    }
    dragStartY.current = null;
  };

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const h = e => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [menuOpen]);

  // ── Desktop user avatar dropdown ─────────────────────────────────────────
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
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" }}>
        <div style={{ width: 28, height: 28, background: "#1A1A2E", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "serif" }}>W</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>Workplace Vocab</span>
      </Link>

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

          {/* Bottom sheet — portalled to body to escape nav's backdrop-filter stacking context */}
          {menuOpen && createPortal(
            <>
              <div
                onClick={() => setMenuOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,15,30,0.55)", backdropFilter: "blur(6px)", animation: "overlayIn 0.2s ease forwards" }}
              />

              {/* Sheet */}
              <div
                ref={sheetRef}
                style={{
                  position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 201,
                  background: "#fff",
                  borderRadius: "20px 20px 0 0",
                  boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
                  animation: "sheetUp 0.32s cubic-bezier(0.32,0.72,0,1)",
                  paddingBottom: "env(safe-area-inset-bottom, 20px)",
                }}
              >
                {/* Drag handle */}
                <div
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 36, cursor: "grab", touchAction: "none" }}
                >
                  <div style={{ width: 40, height: 4, borderRadius: 99, background: "#CBD5E1" }}/>
                </div>

                {/* Nav links */}
                <div style={{ padding: "0 20px 16px" }}>
                  {ANCHOR_LINKS.map(([label, href]) => (
                    <Link
                      key={label} to={href}
                      onClick={() => setMenuOpen(false)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 4px", fontSize: 17, fontWeight: 600, color: "#1A1A2E", textDecoration: "none", borderBottom: "1px solid #F1F5F9" }}
                    >
                      {label}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  ))}
                  <Link
                    to="/about"
                    onClick={() => setMenuOpen(false)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", borderBottom: "1px solid #F1F5F9", padding: "14px 4px", fontSize: 17, fontWeight: 600, color: "#1A1A2E", cursor: "pointer", textAlign: "left", textDecoration: "none" }}
                  >
                    About
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>

                {/* Conversion section */}
                <div style={{ padding: "12px 20px 4px", borderTop: "1px solid #F1F5F9" }}>
                  {isLoggedIn ? (
                    <>
                      {/* Mini progress strip */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <div style={{ flex: 1, height: 5, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 99, background: pct === 100 ? "#22C55E" : "#6366F1", width: `${pct}%`, transition: "width 0.5s ease" }}/>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#6366F1", whiteSpace: "nowrap" }}>
                          {done}/{total} · {pct}%
                        </span>
                      </div>
                      <button
                        onClick={() => { setMenuOpen(false); onOpenProgress(); }}
                        style={{ width: "100%", background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "14px 16px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}
                      >
                        My Progress
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); onSignOut(); }}
                        disabled={signingOut}
                        style={{ width: "100%", background: "none", color: signingOut ? "#94A3B8" : "#94A3B8", border: "none", padding: "10px 16px", fontSize: 14, fontWeight: 500, cursor: signingOut ? "not-allowed" : "pointer" }}
                      >
                        {signingOut ? "Signing out…" : "Sign out"}
                      </button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 12px", textAlign: "center", fontWeight: 500 }}>
                        Save progress &amp; track your streaks
                      </p>
                      <button
                        onClick={() => { setMenuOpen(false); onOpenLogin(); }}
                        style={{ width: "100%", background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "14px 16px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                      >
                        Sign in — it's free
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>,
            document.body
          )}
        </>
      ) : (
        /* Desktop nav */
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {ANCHOR_LINKS.map(([item, href]) => (
            <Link
              key={item} to={href}
              style={{ padding: "6px 12px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#64748B", textDecoration: "none", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#1A1A2E"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none";    e.currentTarget.style.color = "#64748B"; }}
            >
              {item}
            </Link>
          ))}
          <Link
            to="/about"
            style={{ padding: "6px 12px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#64748B", background: "none", border: "none", cursor: "pointer", transition: "all 0.15s", textDecoration: "none" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#1A1A2E"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none";    e.currentTarget.style.color = "#64748B"; }}
          >
            About
          </Link>

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
