import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, XCircle, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { generateQuiz } from "../../utils/quizGenerator.js";
import { SEOHead } from "../ui/SEOHead.jsx";

export function QuizSession({ user, isPro, reviewSchedule, completedTerms, onRecordReview }) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [quizzesToday, setQuizzesToday] = useState(0);
  const startTime = useRef(Date.now());

  const FREE_QUIZ_LIMIT = 1;
  const FREE_QUESTION_COUNT = 5;
  const PRO_QUESTION_COUNT = 10;

  useEffect(() => {
    const todayKey = `wv_quiz_${new Date().toISOString().slice(0, 10)}`;
    const count = parseInt(localStorage.getItem(todayKey) || "0", 10);
    setQuizzesToday(count);
  }, []);

  const startQuiz = () => {
    const count = isPro ? PRO_QUESTION_COUNT : FREE_QUESTION_COUNT;
    const q = generateQuiz({ reviewSchedule, completedTerms, count });
    setQuestions(q);
    setCurrentIndex(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    setDone(false);
    startTime.current = Date.now();
  };

  useEffect(() => { startQuiz(); }, []);

  const q = questions[currentIndex];

  const handleSelect = (answerIndex) => {
    if (answered) return;
    setSelected(answerIndex);
    setAnswered(true);

    const isCorrect = q.answers[answerIndex].correct;
    const elapsed = Date.now() - startTime.current;
    const hesitated = elapsed > 5000;

    setResults(prev => [...prev, { termName: q.termName, correct: isCorrect, hesitated }]);

    // Feed into spaced repetition
    if (onRecordReview) {
      if (isCorrect && !hesitated) onRecordReview(q.termName, 2); // Good
      else if (isCorrect && hesitated) onRecordReview(q.termName, 1); // Hard
      else onRecordReview(q.termName, 0); // Forgot
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setDone(true);
      // Record quiz taken today
      const todayKey = `wv_quiz_${new Date().toISOString().slice(0, 10)}`;
      const count = parseInt(localStorage.getItem(todayKey) || "0", 10) + 1;
      localStorage.setItem(todayKey, String(count));
      setQuizzesToday(count);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setAnswered(false);
      startTime.current = Date.now();
    }
  };

  // Gate: must be logged in
  if (!user) {
    return (
      <>
        <SEOHead title="Quiz" description="Test your knowledge with daily quizzes." />
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <Lock size={32} color="#94A3B8" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E", marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>Sign in to take quizzes</p>
          <p style={{ fontSize: 14, color: "#64748B" }}>Test how well you remember what you've learned.</p>
        </div>
      </>
    );
  }

  // Gate: free tier limit
  if (!isPro && quizzesToday >= FREE_QUIZ_LIMIT && !done) {
    return (
      <>
        <SEOHead title="Quiz" />
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <Sparkles size={32} color="#7C3AED" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 17, fontWeight: 700, color: "#1A1A2E", marginBottom: 8, fontFamily: "'DM Serif Display', serif" }}>You've used your free quiz today</p>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, marginBottom: 24 }}>Upgrade to Pro for unlimited quizzes with more questions.</p>
        </div>
      </>
    );
  }

  // Done — summary
  if (done) {
    const correct = results.filter(r => r.correct).length;
    const total = results.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <>
        <SEOHead title="Quiz Complete" />
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📚"}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", marginBottom: 8 }}>
            {pct >= 80 ? "Excellent!" : pct >= 50 ? "Good effort!" : "Keep learning!"}
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", marginBottom: 8 }}>
            {correct} of {total} correct
          </p>

          {/* Score ring */}
          <div style={{ width: 120, height: 120, margin: "24px auto", position: "relative" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#F1F5F9" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={pct >= 80 ? "#22C55E" : pct >= 50 ? "#F59E0B" : "#EF4444"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 327} 327`}
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dasharray 0.8s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#1A1A2E" }}>{pct}%</span>
            </div>
          </div>

          {/* Wrong answers review */}
          {results.filter(r => !r.correct).length > 0 && (
            <div style={{ textAlign: "left", marginTop: 24, marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 12 }}>Review these</p>
              {results.filter(r => !r.correct).map(r => (
                <div key={r.termName} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
                  <XCircle size={14} color="#EF4444" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>{r.termName}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => navigate("/")}
              style={{ flex: 1, background: "#F8FAFC", border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#1A1A2E", cursor: "pointer" }}
            >
              Home
            </button>
            <button
              onClick={startQuiz}
              style={{ flex: 1, background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "14px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              Quiz again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!q) return null;

  return (
    <>
      <SEOHead title="Quiz" description="Test your knowledge." />
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px 40px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <ChevronLeft size={20} color="#64748B" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.04em" }}>
              QUIZ · {currentIndex + 1} of {questions.length}
            </div>
            <div style={{ height: 4, background: "#F1F5F9", borderRadius: 99, marginTop: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#7C3AED", borderRadius: 99, width: `${((currentIndex + 1) / questions.length) * 100}%`, transition: "width 0.3s ease" }} />
            </div>
          </div>
        </div>

        {/* Question card */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ padding: "24px 20px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#7C3AED", marginBottom: 12 }}>
              {q.prompt}
            </p>
            <p style={{
              fontSize: q.type === "term" ? 24 : 15,
              fontWeight: q.type === "term" ? 700 : 400,
              fontFamily: q.type === "term" ? "'DM Serif Display', serif" : "inherit",
              color: "#1A1A2E",
              lineHeight: q.type === "term" ? 1.2 : 1.65,
              margin: 0,
            }}>
              {q.question}
            </p>
          </div>

          {/* Answers */}
          <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {q.answers.map((answer, i) => {
              const isSelected = selected === i;
              const isCorrectAnswer = answer.correct;
              let bg = "#F8FAFC";
              let border = "#E2E8F0";
              let color = "#1A1A2E";

              if (answered) {
                if (isCorrectAnswer) {
                  bg = "#F0FDF4";
                  border = "#22C55E";
                  color = "#166534";
                } else if (isSelected && !isCorrectAnswer) {
                  bg = "#FEF2F2";
                  border = "#EF4444";
                  color = "#991B1B";
                }
              } else if (isSelected) {
                border = "#7C3AED";
                bg = "#EEF2FF";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 12,
                    border: `1.5px solid ${border}`, background: bg,
                    cursor: answered ? "default" : "pointer",
                    transition: "all 0.15s", textAlign: "left",
                    fontSize: q.type === "term" ? 14 : 13,
                    fontWeight: 500, color, lineHeight: 1.5,
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: answered && isCorrectAnswer ? "#22C55E" : answered && isSelected ? "#EF4444" : "#E2E8F0",
                    color: answered && (isCorrectAnswer || isSelected) ? "#fff" : "#64748B",
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    {answered && isCorrectAnswer ? <CheckCircle2 size={14} /> : answered && isSelected ? <XCircle size={14} /> : String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ flex: 1 }}>
                    {q.type === "term" ? answer.text : (answer.text.length > 120 ? answer.text.slice(0, 120) + "…" : answer.text)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Next button */}
          {answered && (
            <div style={{ padding: "16px 20px", borderTop: "1px solid #F1F5F9", background: "#FAFAFA" }}>
              <button
                onClick={handleNext}
                style={{ width: "100%", background: "#1A1A2E", color: "#fff", border: "none", borderRadius: 12, padding: "14px 16px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
              >
                {currentIndex + 1 >= questions.length ? "See results" : "Next question"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
