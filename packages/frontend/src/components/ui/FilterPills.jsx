// Reusable pill-group filter (used for levels and domains).
// options: Array<{ id: string, name: string }>
// active: currently selected id
// onChange: (id) => void
export function FilterPills({ options, active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 6, flexWrap: "wrap",
      background: "#F8FAFC", padding: 4,
      borderRadius: 10, border: "1px solid #E2E8F0",
    }}>
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          style={{
            background: active === opt.id ? "#1A1A2E" : "none",
            color: active === opt.id ? "#fff" : "#64748B",
            border: "none", borderRadius: 7,
            padding: "6px 14px", fontSize: 13, fontWeight: 600,
            cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
          }}
        >
          {opt.name}
        </button>
      ))}
    </div>
  );
}
