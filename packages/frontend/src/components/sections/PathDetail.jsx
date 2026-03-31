import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, CheckCircle2, Circle, Lock, Play, Trophy, Clock, BarChart3 } from "lucide-react";
import { LEARNING_PATHS } from "../../data/learningPaths.js";
import { ALL_WORDS } from "../../data/words.js";
import { CAT_MAP } from "../../utils/termLookup.js";
import { SEOHead } from "../ui/SEOHead.jsx";

const DIFFICULTY_COLOR = {
  Beginner: "#22C55E",
  Intermediate: "#F59E0B",
  Advanced: "#EF4444",
};

export function PathDetail({ completedTerms = new Set(), isPro, onOpenModal, user }) {
  const { pathSlug } = useParams();
  const navigate = useNavigate();
  const path = LEARNING_PATHS.find(p => p.id === pathSlug);

  if (!path) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E" }}>Path not found</p>
        <button onClick={() => navigate("/paths")} style={{ marginTop: 16, background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          View all paths
        </button>
      </div>
    );
  }

  const termMap = Object.fromEntries(ALL_WORDS.map(w => [w.term, w]));
  const pathTerms = path.terms.map(name => termMap[name]).filter(Boolean);
  const done = pathTerms.filter(t => completedTerms.has(t.term)).length;
  const total = pathTerms.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isComplete = pct === 100;

  // Free users see first 3 terms only
  const FREE_PREVIEW = 3;
  const isLocked = (i) => !isPro && !user && i >= FREE_PREVIEW;
  const isFreeLocked = (i) => user && !isPro && i >= FREE_PREVIEW;

  // Find next incomplete term index
  const nextIncompleteIndex = pathTerms.findIndex(t => !completedTerms.has(t.term));

  const handleContinue = () => {
    const startIdx = nextIncompleteIndex >= 0 ? nextIncompleteIndex : 0;
    onOpenModal?.(pathTerms, startIdx);
  };

  const handleOpenTerm = (index) => {
    if (!isPro && index >= FREE_PREVIEW) return;
    onOpenModal?.(pathTerms, index);
  };

  return (
    <>
      <SEOHead title={path.name} description={path.description} />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px 80px" }}>
        {/* Header */}
        <button onClick={() => navigate("/paths")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "0 0 20px", color: "#64748B", fontSize: 13, fontWeight: 500 }}>
          <ChevronLeft size={16} /> All paths
        </button>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            {path.name}
          </h1>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 16px", lineHeight: 1.6 }}>
            {path.description}
          </p>
          <div style={{ display: "flex", gap: 16, fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 16 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><BarChart3 size={12} /> {total} terms</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> ~{path.estimatedMinutes} min</span>
            <span style={{ color: DIFFICULTY_COLOR[path.difficulty] }}>{path.difficulty}</span>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>{done} of {total} complete</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: isComplete ? "#22C55E" : "#6366F1" }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", background: isComplete ? "#22C55E" : "#6366F1", borderRadius: 99, width: `${pct}%`, transition: "width 0.3s ease" }} />
            </div>
          </div>

          {/* Continue button */}
          {isComplete ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#F0FDF4", borderRadius: 12, border: "1.5px solid #BBF7D0", marginTop: 16 }}>
              <Trophy size={18} color="#22C55E" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#16A34A" }}>Path complete!</span>
            </div>
          ) : (
            <button
              onClick={handleContinue}
              style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
            >
              <Play size={16} fill="#fff" />
              {done > 0 ? "Continue" : "Start path"}
            </button>
          )}
        </div>

        {/* Term list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {pathTerms.map((term, i) => {
            const isDone = completedTerms.has(term.term);
            const cat = CAT_MAP[term.category];
            const locked = !isPro && i >= FREE_PREVIEW;

            return (
              <button
                key={term.term}
                onClick={() => handleOpenTerm(i)}
                disabled={locked}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", borderRadius: 12,
                  background: isDone ? "#F0FDF4" : locked ? "#F8FAFC" : "#fff",
                  border: "none", cursor: locked ? "default" : "pointer",
                  transition: "all 0.15s", textAlign: "left", width: "100%",
                  opacity: locked ? 0.6 : 1,
                }}
                onMouseEnter={e => { if (!locked) e.currentTarget.style.background = isDone ? "#DCFCE7" : "#F8FAFC"; }}
                onMouseLeave={e => { if (!locked) e.currentTarget.style.background = isDone ? "#F0FDF4" : "#fff"; }}
              >
                {/* Number */}
                <span style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: isDone ? "#22C55E" : "#F1F5F9", flexShrink: 0,
                }}>
                  {isDone ? <CheckCircle2 size={14} color="#fff" /> : locked ? <Lock size={12} color="#94A3B8" /> : <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>{i + 1}</span>}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: locked ? "#94A3B8" : "#1A1A2E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {term.term}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginTop: 2 }}>
                    {term.category}
                  </div>
                </div>

                {cat && (
                  <span style={{
                    width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
                    background: cat.color, borderRadius: 6, flexShrink: 0,
                  }}>
                    <cat.icon size={12} color={cat.accent} strokeWidth={1.75} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Upgrade nudge for free users */}
        {!isPro && (
          <div style={{
            marginTop: 24, padding: "20px", borderRadius: 16,
            background: "linear-gradient(135deg, #EEF2FF 0%, #FDF4FF 100%)",
            border: "1.5px solid #E0E7FF", textAlign: "center",
          }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", margin: "0 0 6px", fontFamily: "'DM Serif Display', serif" }}>
              Unlock the full path
            </p>
            <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 16px", lineHeight: 1.5 }}>
              Free users can preview the first {FREE_PREVIEW} terms. Upgrade to complete all {total}.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
