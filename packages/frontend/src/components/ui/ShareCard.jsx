import { useState, useRef } from "react";
import { Download, Share2, Twitter, Linkedin } from "lucide-react";

// Renders a styled achievement card and provides share/download options.
// Uses a hidden canvas to generate a PNG.

export function ShareCard({ title, subtitle, stat, statLabel, accentColor = "#6366F1" }) {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    const w = 600;
    const h = 340;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 20);
    ctx.fill();

    // Accent bar
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, w, 6);

    // Title
    ctx.fillStyle = "#1A1A2E";
    ctx.font = "bold 28px 'DM Serif Display', Georgia, serif";
    ctx.fillText(title, 40, 72);

    // Subtitle
    ctx.fillStyle = "#64748B";
    ctx.font = "500 16px 'DM Sans', sans-serif";
    ctx.fillText(subtitle, 40, 104);

    // Stat
    ctx.fillStyle = accentColor;
    ctx.font = "bold 64px 'DM Sans', sans-serif";
    ctx.fillText(stat, 40, 200);

    // Stat label
    ctx.fillStyle = "#94A3B8";
    ctx.font = "600 14px 'DM Sans', sans-serif";
    ctx.fillText(statLabel, 40, 228);

    // Branding
    ctx.fillStyle = "#1A1A2E";
    ctx.font = "bold 14px 'DM Sans', sans-serif";
    ctx.fillText("Workplace Vocab", 40, 300);
    ctx.fillStyle = "#94A3B8";
    ctx.font = "500 13px 'DM Sans', sans-serif";
    ctx.fillText("Learn the language of work", 40, 320);

    // Logo square
    ctx.fillStyle = "#1A1A2E";
    ctx.beginPath();
    ctx.roundRect(w - 80, h - 60, 40, 40, 8);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px serif";
    ctx.fillText("W", w - 68, h - 30);

    return canvas.toDataURL("image/png");
  };

  const handleDownload = () => {
    const url = generateImage();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `workplace-vocab-${title.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  };

  const shareText = `${title} — ${subtitle}. ${stat} ${statLabel}. Learn the language of work at workplacevocab.com`;

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://workplacevocab.com")}`, "_blank");
  };

  const handleNativeShare = async () => {
    const url = generateImage();
    if (navigator.share) {
      try {
        const blob = await (await fetch(url)).blob();
        const file = new File([blob], "achievement.png", { type: "image/png" });
        await navigator.share({ title, text: subtitle, files: [file] });
      } catch {
        // Fallback to link share
        navigator.share?.({ title, text: shareText, url: "https://workplacevocab.com" });
      }
    }
  };

  return (
    <div>
      {/* Preview card */}
      <div style={{
        background: "#fff", borderRadius: 16, border: "1.5px solid #E2E8F0",
        overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ height: 4, background: accentColor }} />
        <div style={{ padding: "24px 20px" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: "#1A1A2E", margin: "0 0 4px" }}>
            {title}
          </h3>
          <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 16px" }}>{subtitle}</p>
          <div style={{ fontSize: 40, fontWeight: 700, color: accentColor, lineHeight: 1 }}>{stat}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", marginTop: 4 }}>{statLabel}</div>
        </div>
        <div style={{ padding: "0 20px 16px", borderTop: "1px solid #F1F5F9", paddingTop: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>
          <div style={{ width: 20, height: 20, background: "#1A1A2E", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "serif" }}>W</span>
          </div>
          Workplace Vocab
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={handleDownload} style={btnStyle}>
          <Download size={14} /> Download
        </button>
        {typeof navigator !== "undefined" && navigator.share ? (
          <button onClick={handleNativeShare} style={btnStyle}>
            <Share2 size={14} /> Share
          </button>
        ) : (
          <>
            <button onClick={handleShareTwitter} style={btnStyle}>
              <Twitter size={14} /> Twitter
            </button>
            <button onClick={handleShareLinkedIn} style={btnStyle}>
              <Linkedin size={14} /> LinkedIn
            </button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

const btnStyle = {
  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  background: "#F8FAFC", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#1A1A2E",
};
