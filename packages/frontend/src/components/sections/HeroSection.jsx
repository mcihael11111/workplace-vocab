import { SearchBar } from "../ui/SearchBar.jsx";
import { STATS } from "../../data/domains.js";

// Hero section — headline, search bar, and stat chips.
// search + onSearchChange are lifted to App.
export function HeroSection({ search, onSearchChange }) {
  return (
    <section
      id="hero"
      style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(40px,8vw,80px) 24px clamp(32px,6vw,64px)", textAlign: "center" }}
    >
      <div className="fade-up" style={{ animationDelay: "0ms" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 99, padding: "5px 14px", marginBottom: 28, fontSize: 12, fontWeight: 600, color: "#16A34A", letterSpacing: "0.04em" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }}/>
          100+ terms across 4 domains — V2 live
        </div>
      </div>
      <h1
        className="fade-up"
        style={{ animationDelay: "80ms", fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, fontFamily: "'DM Serif Display', Georgia, serif", color: "#1A1A2E", marginBottom: 24 }}
      >
        The vocabulary that<br/>
        <span style={{ fontStyle: "italic", color: "#64748B" }}>unlocks leadership.</span>
      </h1>
      <p
        className="fade-up"
        style={{ animationDelay: "160ms", fontSize: 18, color: "#475569", lineHeight: 1.65, maxWidth: 540, margin: "0 auto 40px", fontWeight: 400 }}
      >
        As you grow in your career, you learn the language of your field. This platform makes that process faster — one term at a time.
      </p>
      <div className="fade-up" style={{ animationDelay: "240ms", display: "flex", justifyContent: "center" }}>
        <SearchBar value={search} onChange={onSearchChange}/>
      </div>
      <div className="fade-up" style={{ animationDelay: "320ms", display: "flex", justifyContent: "center", gap: 48, marginTop: 48 }}>
        {STATS.map(stat => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", fontFamily: "'DM Serif Display', serif" }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
