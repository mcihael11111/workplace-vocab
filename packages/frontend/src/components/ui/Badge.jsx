import { LEVEL_COLORS } from "../../utils/styleTokens.js";

// Level badge pill — Beginner / Intermediate / Advanced
export function Badge({ level }) {
  const c = LEVEL_COLORS[level] || LEVEL_COLORS.Beginner;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 11px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
      backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {level}
    </span>
  );
}
