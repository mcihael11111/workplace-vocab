import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Crown, Mail, BarChart3, Trophy, ChevronRight, Lock } from "lucide-react";
import { SEOHead } from "../ui/SEOHead.jsx";
import { LEARNING_PATHS } from "../../data/learningPaths.js";

// Team dashboard — scaffolded UI for B2B team plans.
// This is a visual scaffold. Full functionality requires the backend (Phase 2).
// For now it shows the UI structure and a "coming soon" state.

export function TeamDashboard({ user, isPro }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("members");

  if (!user) {
    return (
      <>
        <SEOHead title="Teams" description="Team learning plans for organisations." />
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <Lock size={32} color="#94A3B8" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E", marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>Sign in to access Teams</p>
          <p style={{ fontSize: 14, color: "#64748B" }}>Team plans let you track learning across your organisation.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Teams" description="Team learning dashboard." />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 4px" }}>
              Team Dashboard
            </h1>
            <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>Track learning across your team</p>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 10,
            padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>
            <Mail size={14} /> Invite member
          </button>
        </div>

        {/* Pricing cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { name: "Pro", price: "$8/mo", desc: "Full learning system for individuals", features: ["Unlimited reviews", "Unlimited quizzes", "All learning paths", "Progress analytics"], accent: "#6366F1" },
            { name: "Team", price: "$6/seat/mo", desc: "Everything in Pro, plus team features", features: ["Team dashboard", "Assigned paths", "Leaderboard", "Bulk invites"], accent: "#7C3AED", popular: true },
            { name: "Enterprise", price: "Custom", desc: "For large organisations", features: ["SSO integration", "Custom content", "API access", "Analytics export"], accent: "#1A1A2E" },
          ].map(plan => (
            <div key={plan.name} style={{
              background: "#fff", borderRadius: 16, border: `1.5px solid ${plan.popular ? plan.accent : "#E2E8F0"}`,
              padding: "24px 20px", position: "relative",
            }}>
              {plan.popular && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.accent, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99 }}>
                  Most popular
                </div>
              )}
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E", margin: "0 0 4px" }}>{plan.name}</h3>
              <div style={{ fontSize: 24, fontWeight: 700, color: plan.accent, marginBottom: 4 }}>{plan.price}</div>
              <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 16px", lineHeight: 1.4 }}>{plan.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569", padding: "4px 0" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: "1.5px solid #F1F5F9", marginBottom: 24 }}>
          {["members", "paths", "leaderboard"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 16px", fontSize: 13, fontWeight: 600,
                color: activeTab === tab ? "#1A1A2E" : "#94A3B8",
                background: "none", border: "none", cursor: "pointer",
                borderBottom: activeTab === tab ? "2px solid #1A1A2E" : "2px solid transparent",
                textTransform: "capitalize", transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "members" && (
          <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "40px 24px", textAlign: "center" }}>
            <Users size={32} color="#94A3B8" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>No team members yet</p>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>Invite your team to start tracking learning together.</p>
            <button style={{
              background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 10,
              padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>
              Send invites
            </button>
          </div>
        )}

        {activeTab === "paths" && (
          <div>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>Assign learning paths to team members.</p>
            {LEARNING_PATHS.slice(0, 4).map(path => (
              <div key={path.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderBottom: "1px solid #F1F5F9",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>{path.name}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{path.terms.length} terms · {path.difficulty}</div>
                </div>
                <button style={{
                  background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 8,
                  padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#64748B", cursor: "pointer",
                }}>
                  Assign
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div style={{ background: "#F8FAFC", borderRadius: 16, padding: "40px 24px", textAlign: "center" }}>
            <Trophy size={32} color="#F59E0B" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 6 }}>Leaderboard coming soon</p>
            <p style={{ fontSize: 13, color: "#64748B" }}>See who's learning the most on your team.</p>
          </div>
        )}

        {/* Coming soon banner */}
        <div style={{
          marginTop: 32, padding: "20px 24px", borderRadius: 16,
          background: "linear-gradient(135deg, #FEF9C3 0%, #FEF3C7 100%)",
          border: "1.5px solid #FDE68A",
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#92400E", margin: "0 0 4px" }}>
            Team plans launching soon
          </p>
          <p style={{ fontSize: 13, color: "#A16207", margin: 0, lineHeight: 1.5 }}>
            Team dashboard, assigned paths, and leaderboards are in development. Individual Pro plans are available now.
          </p>
        </div>
      </div>
    </>
  );
}
