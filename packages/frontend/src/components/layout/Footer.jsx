const FOOTER_LINKS = [
  ["Categories", "#categories"],
  ["Flashcards",  "#flashcards"],
  ["About",       "#about"],
  ["Contact",     "#contact"],
];

// Site footer with logo, credit, and anchor nav links.
export function Footer() {
  return (
    <footer
      id="contact"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px", borderTop: "1px solid #F1F5F9", marginTop: 72, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, background: "#1A1A2E", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "serif" }}>W</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Workplace Vocab</span>
      </div>
      <p style={{ fontSize: 13, color: "#94A3B8" }}>
        Built by{" "}
        <a href="https://www.madebymichael.com.au/uxuidesignportfolio" style={{ color: "#475569", fontWeight: 600, textDecoration: "none" }}>
          Michael Papanikolaou
        </a>{" "}
        · delightfuldesign.com.au
      </p>
      <div style={{ display: "flex", gap: 20 }}>
        {FOOTER_LINKS.map(([item, href]) => (
          <a key={item} href={href} style={{ fontSize: 13, color: "#94A3B8", textDecoration: "none", fontWeight: 500 }}>
            {item}
          </a>
        ))}
      </div>
    </footer>
  );
}
