import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, RotateCcw, Zap, Brain, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { CAT_MAP } from "../../utils/termLookup.js";
import { ALL_WORDS } from "../../data/words.js";
import { getDueTerms, getNewTermsForToday, getReviewStats } from "../../utils/spacedRepetition.js";
import { SEOHead } from "../ui/SEOHead.jsx";

const QUALITY_BUTTONS = [
  { quality: 0, label: "Forgot",  color: "#EF4444", bg: "#FEF2F2", icon: RotateCcw },
  { quality: 1, label: "Hard",    color: "#F59E0B", bg: "#FFFBEB", icon: Brain },
  { quality: 2, label: "Good",    color: "#22C55E", bg: "#F0FDF4", icon: CheckCircle2 },
  { quality: 3, label: "Easy",    color: "#6366F1", bg: "#EEF2FF", icon: Zap },
];

export function ReviewSession({ user, isPro, reviewSchedule, onRecordReview, completedTerms }) {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const dueNames = getDueTerms(reviewSchedule);
    const newNames = getNewTermsForToday(ALL_WORDS, reviewSchedule, completedTerms, 5);
    const allNames = [...dueNames.slice(0, 15), ...newNames.slice(0, Math.max(5, 20 - dueNames.length))];

    const termMap = Object.fromEntries(ALL_WORDS.map(w => [w.term, w]));
    const reviewCards = allNames.map(n => termMap[n]).filter(Boolean);
    setCards(reviewCards);
    setCurrentIndex(0);
    setRevealed(false);
    setResults([]);
    setDone(false);
  }, [reviewSchedule]);

  const card = cards[currentIndex];
  const cat = card ? (CAT_MAP[card.category] || { accent: "#1A1A2E", color: "#F8FAFC" }) : null;
  const stats = getReviewStats(reviewSchedule);

  const handleRate = (quality) => {
    onRecordReview?.(card.term, quality);
    setResults(prev => [...prev, { term: card.term, quality }]);

    if (currentIndex + 1 >= cards.length) {
      setDone(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setRevealed(false);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  };

  if (!user) {
    return (
      <>
        <SEOHead title="Review" description="Review terms with spaced repetition." />
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <Lock size={32} color="#94A3B8" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E", marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>Sign in to start reviewing</p>
          <p style={{ fontSize: 14, color: "#64748B" }}>Spaced repetition remembers what you forget. Sign in to unlock smart reviews.</p>
        </div>
      </>
    );
  }

  if (!isPro) {
    return (
      <>
        <SEOHead title="Review" description="Smart reviews with spaced repetition." />
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <Lock size={32} color="#7C3AED" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E", marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>Smart Reviews are a Pro feature</p>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>Spaced repetition shows you terms right before you forget them. Upgrade to unlock.</p>
        </div>
      </>
    );
  }

  // Done state — session summary
  if (done) {
    const forgot = results.filter(r => r.quality === 0).length;
    const hard = results.filter(r => r.quality === 1).length;
    const good = results.filter(r => r.quality === 2).length;
    const easy = results.filter(r => r.quality === 3).length;

    return (
      <>
        <SEOHead title="Review Complete" />
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {forgot === 0 ? "🎯" : "💪"}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", marginBottom: 8 }}>
            Review complete
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", marginBottom: 32 }}>
            {results.length} cards reviewed
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
            {[
              { label: "Easy", count: easy, color: "#6366F1" },
              { label: "Good", count: good, color: "#22C55E" },
              { label: "Hard", count: hard, color: "#F59E0B" },
              { label: "Forgot", count: forgot, color: "#EF4444" },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px 12px" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color }}>{count}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => navigate("/")}
              style={{ flex: 1, background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#1A1A2E", cursor: "pointer" }}
            >
              Home
            </button>
            <button
              onClick={() => { setDone(false); setCurrentIndex(0); setResults([]); setRevealed(false); }}
              style={{ flex: 1, background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "14px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Review again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (cards.length === 0) {
    return (
      <>
        <SEOHead title="Review" />
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", marginBottom: 8 }}>
            Nothing to review
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>
            Browse some terms first, then come back. Spaced repetition kicks in after you start learning.
          </p>
          <button
            onClick={() => navigate("/categories")}
            style={{ marginTop: 24, background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            Browse categories
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Review" description="Review terms with spaced repetition." />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px 40px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <ChevronLeft size={20} color="#64748B" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.04em" }}>
              REVIEW · {currentIndex + 1} of {cards.length}
            </div>
            <div style={{ height: 4, background: "#F1F5F9", borderRadius: 99, marginTop: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#6366F1", borderRadius: 99, width: `${((currentIndex + 1) / cards.length) * 100}%`, transition: "width 0.3s ease" }} />
            </div>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: 20, border: "1.5px solid #E2E8F0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden",
        }}>
          {/* Category bar */}
          <div style={{ padding: "16px 20px", background: cat.color, display: "flex", alignItems: "center", gap: 8 }}>
            {cat.icon && <cat.icon size={14} color={cat.accent} strokeWidth={1.75} />}
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: cat.accent }}>{card.category}</span>
            <div style={{ marginLeft: "auto" }}><Badge level={card.level} /></div>
          </div>

          {/* Term */}
          <div ref={scrollRef} style={{ padding: "24px 20px" }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 20px", letterSpacing: "-0.02em" }}>
              {card.term}
            </h2>

            {!revealed ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 16 }}>Do you remember what this means?</p>
                <button
                  onClick={() => setRevealed(true)}
                  style={{ background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                >
                  Show answer
                </button>
              </div>
            ) : (
              <>
                <section style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Definition</p>
                  <p style={{ fontSize: 16, color: "#1A1A2E", lineHeight: 1.72, margin: 0 }}>{card.definition}</p>
                </section>
                <div style={{ height: 1, background: "#F1F5F9", marginBottom: 16 }} />
                <section>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Why it matters</p>
                  <p style={{ fontSize: 15, color: "#1E293B", lineHeight: 1.72, margin: 0 }}>{card.whyItMatters}</p>
                </section>
              </>
            )}
          </div>

          {/* Rating buttons */}
          {revealed && (
            <div style={{ padding: "16px 20px", borderTop: "1px solid #F1F5F9", background: "#FAFAFA" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 12, textAlign: "center" }}>How well did you remember?</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {QUALITY_BUTTONS.map(({ quality, label, color, bg, icon: Icon }) => (
                  <button
                    key={quality}
                    onClick={() => handleRate(quality)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      padding: "12px 8px", borderRadius: 12, border: `1.5px solid ${color}20`,
                      background: bg, cursor: "pointer", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}20`; e.currentTarget.style.transform = "none"; }}
                  >
                    <Icon size={18} color={color} strokeWidth={2} />
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24 }}>
          {[
            { label: "Due", value: stats.due, color: "#F59E0B" },
            { label: "Learning", value: stats.learning, color: "#6366F1" },
            { label: "Mastered", value: stats.mastered, color: "#22C55E" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
