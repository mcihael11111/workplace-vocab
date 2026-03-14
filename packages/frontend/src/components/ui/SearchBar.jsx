// Search input with a leading magnifying glass icon.
// value + onChange are controlled by the parent (App).
export function SearchBar({ value, onChange }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 520 }}>
      <svg
        style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", opacity: 0.35, pointerEvents: "none" }}
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      >
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search any term — MVP, affinity map, design token…"
        style={{
          width: "100%", padding: "14px 16px 14px 44px",
          fontSize: 15, fontFamily: "inherit",
          border: "1.5px solid #E2E8F0", borderRadius: 12,
          outline: "none", background: "#FAFAFA", color: "#1A1A2E",
          transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box",
        }}
        onFocus={e => { e.target.style.borderColor = "#1A1A2E"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(26,26,46,0.06)"; }}
        onBlur={e  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#FAFAFA"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}
