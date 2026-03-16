import { Link } from "react-router-dom";
import { SEOHead } from "../components/ui/SEOHead.jsx";

export function NotFoundPage() {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
      <SEOHead title="Page not found" description="The page you're looking for doesn't exist." />
      <p style={{ fontSize: 64, fontWeight: 700, color: "#E2E8F0", margin: "0 0 16px", fontFamily: "'DM Serif Display', serif" }}>404</p>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1A1A2E", marginBottom: 12, fontFamily: "'DM Serif Display', serif" }}>Page not found</h1>
      <p style={{ fontSize: 15, color: "#64748B", marginBottom: 32, lineHeight: 1.6 }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" style={{ display: "inline-block", background: "#1A1A2E", color: "#fff", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
        Back to home
      </Link>
    </div>
  );
}
