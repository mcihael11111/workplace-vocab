// LoginModal — Google sign-in overlay.
// Shown when an unauthenticated user clicks "Start learning".
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export function LoginModal({ onClose }) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose(); // Popup complete — close the modal
    } catch (e) {
      if (e.code !== "auth/popup-closed-by-user") {
        setError("Sign-in failed — please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,15,30,0.72)", backdropFilter: "blur(8px)", animation: "overlayIn 0.2s ease forwards" }}
      />

      {/* Card */}
      <div style={{
        position: "fixed", zIndex: 1005,
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: "min(420px, calc(100vw - 48px))",
        background: "#fff", borderRadius: 20,
        padding: "40px 36px 36px",
        boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
        animation: "cardIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Logo mark */}
        <div style={{ width: 44, height: 44, background: "#1A1A2E", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <span style={{ color: "#fff", fontSize: 20, fontWeight: 700, fontFamily: "serif" }}>W</span>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "#1A1A2E", marginBottom: 8, fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Start learning
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, marginBottom: 28 }}>
          Sign in to track your progress, mark terms as complete, and pick up where you left off.
        </p>

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            border: "1.5px solid #E2E8F0", borderRadius: 10, padding: "12px 20px",
            background: loading ? "#F8FAFC" : "#fff", cursor: loading ? "not-allowed" : "pointer",
            fontSize: 15, fontWeight: 600, color: "#1A1A2E",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#F8FAFC"; }}
          onMouseLeave={e => { e.currentTarget.style.background = loading ? "#F8FAFC" : "#fff"; }}
        >
          {/* Google G logo */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {loading ? "Signing in…" : "Continue with Google"}
        </button>

        {error && (
          <p style={{ fontSize: 13, color: "#EF4444", textAlign: "center", marginTop: 12 }}>{error}</p>
        )}

        <p style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", marginTop: 20, lineHeight: 1.5 }}>
          By signing in you agree to our terms. Your progress is stored securely and never shared.
        </p>
      </div>
    </>
  );
}
