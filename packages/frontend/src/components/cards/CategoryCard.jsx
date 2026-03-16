import { useState } from "react";
import { Trophy } from "lucide-react";

export function CategoryCard({ cat, onClick, completedCount, totalCount }) {
  const [hov,     setHov]     = useState(false);
  const [pressed, setPressed] = useState(false);

  const hasProgress = completedCount !== undefined && totalCount > 0;
  const allDone     = hasProgress && completedCount === totalCount;
  const pct         = hasProgress ? Math.round((completedCount / totalCount) * 100) : 0;

  const scale = pressed ? "scale(0.97)" : hov ? "translateY(-2px)" : "none";
  const shadow = pressed
    ? "0 1px 4px rgba(0,0,0,0.06)"
    : hov
    ? "0 8px 24px rgba(0,0,0,0.09)"
    : "0 1px 4px rgba(0,0,0,0.05)";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setPressed(false); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick?.()}
      aria-label={`Browse ${cat.name} — ${totalCount ?? cat.count} terms`}
      style={{
        background: allDone ? "#F0FDF4" : "#fff",
        border: `1.5px solid ${allDone ? "#86EFAC" : hov ? cat.accent : "#E2E8F0"}`,
        borderRadius: 14,
        padding: "18px 20px 16px",
        cursor: "pointer",
        alignSelf: "start",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background 0.15s ease",
        transform: scale,
        boxShadow: shadow,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        outline: "none",
      }}
    >
      {/* Top row: icon + complete badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: cat.color, borderRadius: 10, flexShrink: 0 }}>
          <cat.icon size={20} color={cat.accent} strokeWidth={1.75} />
        </span>
        {allDone && (
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#16A34A", background: "#DCFCE7", border: "1px solid #86EFAC", padding: "3px 9px", borderRadius: 99, display: "flex", alignItems: "center", gap: 4 }}>
            <Trophy size={11} color="#16A34A" strokeWidth={2.5} /> Complete
          </span>
        )}
      </div>

      {/* Name + description */}
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1A1A2E", marginBottom: 3, letterSpacing: "-0.01em" }}>
          {cat.name}
        </div>
        <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
          {cat.description}
        </div>
      </div>

      {/* Progress bar */}
      {hasProgress && !allDone && completedCount > 0 && (
        <div style={{ height: 3, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 99, background: cat.accent, width: `${pct}%`, transition: "width 0.4s ease" }}/>
        </div>
      )}

      {/* Footer: term count + arrow */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: hov ? cat.accent : "#94A3B8", transition: "color 0.15s" }}>
          {hasProgress ? `${completedCount} / ${totalCount} terms` : `${cat.count} terms`}
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: hov ? cat.accent : "#F1F5F9",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.15s",
          flexShrink: 0,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov ? "#fff" : "#94A3B8"} strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
