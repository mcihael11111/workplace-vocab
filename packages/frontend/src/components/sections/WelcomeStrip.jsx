// WelcomeStrip — shown between Hero and Ticker when a user is logged in.
// Surfaces their overall progress and a "Resume" CTA.
import { ALL_WORDS } from "../../data/words.js";

export function WelcomeStrip({ user, completedTerms, onResume }) {
  const total     = ALL_WORDS.length;
  const done      = completedTerms.size;
  const pct       = total > 0 ? Math.round((done / total) * 100) : 0;
  const firstName = user?.displayName?.split(" ")[0] || "there";

  // Find the first uncompleted word to resume at
  const nextWord  = ALL_WORDS.find(w => !completedTerms.has(w.term));

  const handleResume = () => {
    if (!nextWord) return;
    const wordsInCat = ALL_WORDS.filter(w => w.category === nextWord.category);
    const idx        = wordsInCat.findIndex(w => w.term === nextWord.term);
    onResume(wordsInCat, idx >= 0 ? idx : 0);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
        borderRadius: 16, padding: "20px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16, marginTop: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Avatar */}
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.2)" }}/>
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.2)" }}>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>
                {user?.displayName?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() || "?"}
              </span>
            </div>
          )}
          <div>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0, marginBottom: 2 }}>Welcome back</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
              {firstName} · {done}/{total} terms complete
            </p>
          </div>
          {/* Progress bar */}
          <div style={{ width: 120, height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden", display: "flex" }}>
            <div style={{ height: "100%", borderRadius: 99, background: pct === 100 ? "#22C55E" : "#6366F1", width: `${pct}%`, transition: "width 0.5s ease" }}/>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#6366F1" }}>{pct}%</span>
        </div>

        {pct < 100 && nextWord && (
          <button
            onClick={handleResume}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", color: "#1A1A2E", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Resume — {nextWord.term}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        )}
        {pct === 100 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#22C55E", color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            All done!
          </div>
        )}
      </div>
    </div>
  );
}
