import { Users, BookOpen, Layers } from "lucide-react";
import { ALL_WORDS } from "../../data/words.js";
import { CATEGORIES } from "../../data/categories.js";

// Lightweight social proof section for the home page.
// Shows stats and a community message.

const DOMAINS = [...new Set(CATEGORIES.map(c => c.domain))];

export function SocialProofStrip() {
  return (
    <div style={{
      background: "#F8FAFC", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9",
      padding: "28px 24px",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#64748B", margin: "0 0 20px" }}>
          Join designers, PMs, and developers learning the language of work
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
          <StatBadge icon={BookOpen} value={`${ALL_WORDS.length}+`} label="terms" />
          <StatBadge icon={Layers} value={CATEGORIES.length} label="categories" />
          <StatBadge icon={Users} value={DOMAINS.length} label="domains" />
        </div>
      </div>
    </div>
  );
}

function StatBadge({ icon: Icon, value, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon size={16} color="#6366F1" strokeWidth={2} />
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>{label}</div>
      </div>
    </div>
  );
}
