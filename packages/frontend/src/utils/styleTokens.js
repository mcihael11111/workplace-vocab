// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
// Shared style constants used across components.
// When a token system or CSS variables are added, source values from here.

export const LEVEL_COLORS = {
  Beginner:     { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
  Intermediate: { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA" },
  Advanced:     { bg: "#FDF4FF", text: "#9333EA", border: "#E9D5FF" },
};

export const BRAND = {
  navy:    "#1A1A2E",
  slate:   "#64748B",
  muted:   "#94A3B8",
  border:  "#E2E8F0",
  surface: "#F8FAFC",
  white:   "#FFFFFF",
};

export const TRANSITIONS = {
  fast:   "all 0.15s",
  medium: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
  slow:   "all 0.3s ease",
};
