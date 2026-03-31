import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LEARNING_PATHS, ROLE_PATH_MAP } from "../../data/learningPaths.js";
import { Compass, ChevronRight, Sparkles } from "lucide-react";

const ROLES = [
  "Designer", "Product Manager", "Developer",
  "Marketer", "Founder / Business", "Career Switcher",
  "Student", "Just Curious",
];

const EXPERIENCE_LEVELS = [
  { id: "new",    label: "New to the field" },
  { id: "junior", label: "1\u20133 years" },
  { id: "senior", label: "3+ years" },
];

export function OnboardingModal({ onComplete, onSkip }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [experience, setExperience] = useState(null);

  const recommendedPathId = role ? ROLE_PATH_MAP[role] : null;
  const recommendedPath = LEARNING_PATHS.find(p => p.id === recommendedPathId);

  const handleFinish = () => {
    onComplete?.({ role, experience });
    if (recommendedPath) {
      navigate(`/paths/${recommendedPath.id}`);
    }
  };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(10,15,30,0.72)", backdropFilter: "blur(8px)", animation: "overlayIn 0.2s ease forwards" }} />

      <div style={{
        position: "fixed", zIndex: 2005, top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: "min(480px, calc(100vw - 48px))",
        background: "#fff", borderRadius: 24, overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.35)",
        animation: "cardIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "20px 24px 0" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 99,
              background: i <= step ? "#1A1A2E" : "#E2E8F0",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        <div style={{ padding: "24px 28px 28px" }}>
          {/* Step 0: Role */}
          {step === 0 && (
            <>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Compass size={28} color="#6366F1" style={{ marginBottom: 12 }} />
                <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 8px" }}>
                  What's your role?
                </h2>
                <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
                  We'll personalise your learning path
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {ROLES.map(r => (
                  <button
                    key={r}
                    onClick={() => { setRole(r); setStep(1); }}
                    style={{
                      padding: "14px 12px", borderRadius: 12,
                      border: `1.5px solid ${role === r ? "#1A1A2E" : "#E2E8F0"}`,
                      background: role === r ? "#F8FAFC" : "#fff",
                      cursor: "pointer", fontSize: 14, fontWeight: 600,
                      color: "#1A1A2E", transition: "all 0.15s",
                      textAlign: "center",
                    }}
                    onMouseEnter={e => { if (role !== r) e.currentTarget.style.borderColor = "#94A3B8"; }}
                    onMouseLeave={e => { if (role !== r) e.currentTarget.style.borderColor = "#E2E8F0"; }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 1: Experience */}
          {step === 1 && (
            <>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 8px" }}>
                  How experienced are you?
                </h2>
                <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
                  This helps us calibrate difficulty
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {EXPERIENCE_LEVELS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => { setExperience(l.id); setStep(2); }}
                    style={{
                      padding: "16px 20px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between",
                      border: `1.5px solid ${experience === l.id ? "#1A1A2E" : "#E2E8F0"}`,
                      background: experience === l.id ? "#F8FAFC" : "#fff",
                      cursor: "pointer", fontSize: 15, fontWeight: 600, color: "#1A1A2E", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#94A3B8"}
                    onMouseLeave={e => { if (experience !== l.id) e.currentTarget.style.borderColor = "#E2E8F0"; }}
                  >
                    {l.label}
                    <ChevronRight size={16} color="#94A3B8" />
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(0)} style={{ marginTop: 16, background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                ← Back
              </button>
            </>
          )}

          {/* Step 2: Recommendation */}
          {step === 2 && (
            <>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Sparkles size={28} color="#22C55E" style={{ marginBottom: 12 }} />
                <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 8px" }}>
                  Your path is ready
                </h2>
              </div>

              {recommendedPath && (
                <div style={{
                  background: "#F8FAFC", borderRadius: 16, padding: "20px",
                  border: "1.5px solid #E2E8F0", marginBottom: 20,
                }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 6px" }}>
                    {recommendedPath.name}
                  </h3>
                  <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 12px", lineHeight: 1.5 }}>
                    {recommendedPath.description}
                  </p>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>
                    <span>{recommendedPath.terms.length} terms</span>
                    <span>·</span>
                    <span>~{recommendedPath.estimatedMinutes} min</span>
                    <span>·</span>
                    <span>{recommendedPath.difficulty}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleFinish}
                style={{
                  width: "100%", background: "#1A1A2E", color: "#fff", border: "none",
                  borderRadius: 12, padding: "14px 16px", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", marginBottom: 10,
                }}
              >
                Start learning →
              </button>
              <button
                onClick={() => { onComplete?.({ role, experience }); navigate("/categories"); }}
                style={{ width: "100%", background: "none", border: "none", color: "#64748B", fontSize: 13, cursor: "pointer", fontWeight: 500, padding: "10px 16px" }}
              >
                Browse all categories instead
              </button>
              <button onClick={() => setStep(1)} style={{ marginTop: 4, background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer", fontWeight: 500, display: "block", margin: "4px auto 0" }}>
                ← Back
              </button>
            </>
          )}

          {/* Skip */}
          {step === 0 && (
            <button
              onClick={onSkip}
              style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer", fontWeight: 500 }}
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </>
  );
}
