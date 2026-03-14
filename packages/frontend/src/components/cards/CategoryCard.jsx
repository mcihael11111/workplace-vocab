import { useState } from "react";

// Category grid card shown in the "Browse by category" section.
// Clicking triggers openDrawer(cat) via onClick.
export function CategoryCard({ cat, onClick }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#fff" : "#FAFAFA",
        border: `1.5px solid ${hov ? cat.accent : "#E2E8F0"}`,
        borderRadius: 14, padding: "20px 22px", cursor: "pointer",
        transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 22, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: cat.color, borderRadius: 10 }}>
          {cat.icon}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: hov ? cat.accent : "#94A3B8", background: hov ? cat.color : "transparent", padding: "3px 9px", borderRadius: 99, transition: "all 0.18s" }}>
          {cat.count} terms
        </span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, color: "#1A1A2E", marginBottom: 4, letterSpacing: "-0.01em" }}>
        {cat.name}
      </div>
      <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
        {cat.description}
      </div>
    </div>
  );
}
