// Dark navy CTA block shown above the footer. Entry point to the About page.
export function CtaSection({ onOpenLogin, onOpenAbout }) {
  return (
    <section
      id="about"
      style={{ maxWidth: 1200, margin: "72px auto 0", padding: "0 24px" }}
    >
      <div style={{
        background: "#1A1A2E", borderRadius: 20,
        padding: "clamp(32px,6vw,56px) clamp(24px,5vw,48px)",
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: 32,
      }}>
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif", color: "#fff", marginBottom: 12 }}>
            The words you learn today<br/>
            <span style={{ fontStyle: "italic", color: "#94A3B8" }}>are the ideas you'll lead with tomorrow.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", maxWidth: 460, lineHeight: 1.6 }}>
            Built for designers, product managers, developers, and anyone who works in product — at any stage of their career.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 200 }}>
          <button
            onClick={onOpenLogin}
            style={{ background: "#fff", color: "#1A1A2E", border: "none", borderRadius: 10, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
          >
            Start learning →
          </button>
          <button
            onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "none", color: "#64748B", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "13px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
          >
            Browse all categories
          </button>
          <button
            onClick={onOpenAbout}
            style={{ background: "none", color: "#475569", border: "none", padding: "8px 0", fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
          >
            Our story →
          </button>
        </div>
      </div>
    </section>
  );
}
