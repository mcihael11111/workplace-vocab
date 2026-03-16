import { Link } from "react-router-dom";

// Site footer with logo, credit, and nav links.
export function Footer() {
  return (
    <footer
      id="contact"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px", borderTop: "1px solid #F1F5F9", marginTop: 72, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" }}>
        <div style={{ width: 24, height: 24, background: "#1A1A2E", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "serif" }}>W</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Workplace Vocab</span>
      </Link>
      <p style={{ fontSize: 13, color: "#94A3B8" }}>
        Built by{" "}
        <a href="https://www.madebymichael.com.au/uxuidesignportfolio" style={{ color: "#475569", fontWeight: 600, textDecoration: "none" }}>
          Michael Papanikolaou
        </a>{" "}
        · delightfuldesign.com.au
      </p>
      <div style={{ display: "flex", gap: 20 }}>
        <Link to="/categories" style={{ fontSize: 13, color: "#94A3B8", textDecoration: "none", fontWeight: 500 }}>Categories</Link>
        <a href="/#flashcards" style={{ fontSize: 13, color: "#94A3B8", textDecoration: "none", fontWeight: 500 }}>Flashcards</a>
        <Link to="/about" style={{ fontSize: 13, color: "#94A3B8", textDecoration: "none", fontWeight: 500 }}>About</Link>
      </div>
    </footer>
  );
}
