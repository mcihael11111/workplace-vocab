// Scrolling marquee of term names — purely decorative, no interaction.
// Animation defined in src/styles/animations.css (@keyframes ticker).
const TICKER_WORDS = [
  "Affinity map", "Design token", "Cognitive load", "MVP", "WCAG", "Persona",
  "Pain point", "Heuristics", "A/B testing", "Design sprint", "User flow",
  "Prototype", "KPI", "NPS", "Design debt", "Affordance", "Gestalt",
  "Breakpoints", "Tone of voice", "Component library",
];

export function Ticker() {
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", padding: "12px 0", background: "#FAFAFA" }}>
      <div style={{ display: "flex", gap: 40, whiteSpace: "nowrap", animation: "ticker 32s linear infinite" }}>
        {[...TICKER_WORDS, ...TICKER_WORDS].map((w, i) => (
          <span key={i} style={{ fontSize: 13, color: "#94A3B8", fontWeight: 400 }}>
            {w} <span style={{ color: "#CBD5E1", margin: "0 8px" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
