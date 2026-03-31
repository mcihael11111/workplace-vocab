import { Sparkles } from "lucide-react";

// Contextual, non-annoying upgrade prompt. Shows at moments of motivation.
export function UpgradeNudge({ message, description, onUpgrade, style: customStyle }) {
  return (
    <div style={{
      padding: "20px", borderRadius: 16,
      background: "linear-gradient(135deg, #EEF2FF 0%, #FDF4FF 100%)",
      border: "1.5px solid #E0E7FF", textAlign: "center",
      ...customStyle,
    }}>
      <Sparkles size={20} color="#7C3AED" style={{ marginBottom: 8 }} />
      <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", margin: "0 0 4px", fontFamily: "'DM Serif Display', serif" }}>
        {message}
      </p>
      {description && (
        <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 14px", lineHeight: 1.5 }}>
          {description}
        </p>
      )}
      {onUpgrade && (
        <button
          onClick={onUpgrade}
          style={{
            background: "#7C3AED", color: "#fff", border: "none", borderRadius: 10,
            padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}
        >
          Upgrade to Pro
        </button>
      )}
    </div>
  );
}
