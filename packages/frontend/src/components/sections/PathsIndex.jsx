import { Link } from "react-router-dom";
import { LEARNING_PATHS } from "../../data/learningPaths.js";
import { Map, Clock, BarChart3, ChevronRight } from "lucide-react";
import { SEOHead } from "../ui/SEOHead.jsx";

const DIFFICULTY_COLOR = {
  Beginner: "#22C55E",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

export function PathsIndex({ completedTerms = new Set() }) {
  return (
    <>
      <SEOHead title="Learning Paths" description="Structured learning paths to guide your vocabulary journey." />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Map size={28} color="#6366F1" style={{ marginBottom: 12 }} />
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Learning Paths
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", margin: 0, maxWidth: 400, marginInline: "auto", lineHeight: 1.6 }}>
            Structured sequences of terms, ordered for learning. Pick a path that matches your role.
          </p>
        </div>

        {/* Path cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {LEARNING_PATHS.map(path => {
            const done = path.terms.filter(t => completedTerms.has(t)).length;
            const total = path.terms.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <Link
                key={path.id}
                to={`/paths/${path.id}`}
                style={{
                  display: "block", textDecoration: "none", color: "inherit",
                  background: "#fff", borderRadius: 16, border: "1.5px solid #E2E8F0",
                  padding: "20px 20px", transition: "all 0.15s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#94A3B8"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 6px" }}>
                      {path.name}
                    </h3>
                    <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 12px", lineHeight: 1.5 }}>
                      {path.description}
                    </p>
                    <div style={{ display: "flex", gap: 16, fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <BarChart3 size={12} />
                        {total} terms
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={12} />
                        ~{path.estimatedMinutes} min
                      </span>
                      <span style={{ color: DIFFICULTY_COLOR[path.difficulty] || "#94A3B8" }}>
                        {path.difficulty}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#CBD5E1" style={{ marginTop: 4, flexShrink: 0 }} />
                </div>

                {/* Progress bar */}
                {done > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>{done}/{total} complete</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? "#22C55E" : "#6366F1" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: pct === 100 ? "#22C55E" : "#6366F1", borderRadius: 99, width: `${pct}%`, transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
