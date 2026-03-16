import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Breadcrumb navigation. Items: [{ label, to? }]
// Last item is plain text (current page), earlier items are links.
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "#94A3B8", flexWrap: "wrap", marginBottom: 24 }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <ChevronRight size={12} strokeWidth={2.5} />}
            {isLast || !item.to ? (
              <span style={{ color: isLast ? "#1A1A2E" : "#94A3B8", fontWeight: isLast ? 600 : 500 }}>{item.label}</span>
            ) : (
              <Link to={item.to} style={{ color: "#94A3B8", textDecoration: "none", transition: "color 0.15s" }} onMouseEnter={e => e.currentTarget.style.color = "#475569"} onMouseLeave={e => e.currentTarget.style.color = "#94A3B8"}>
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
