// Confetti — lightweight celebration burst, no external library.
// Renders 60 pieces that fall, rotate, and fade over ~2s then calls onDone.
import { useEffect, useState } from "react";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EC4899", "#3B82F6", "#A855F7", "#F97316"];

function makePieces(count = 60) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color:    COLORS[Math.floor(Math.random() * COLORS.length)],
    left:     Math.random() * 100,
    size:     6 + Math.random() * 8,
    delay:    Math.random() * 0.5,
    duration: 1.4 + Math.random() * 0.8,
    rotation: Math.random() * 360,
    isRect:   Math.random() > 0.5,
  }));
}

export function Confetti({ onDone }) {
  const [pieces] = useState(makePieces);

  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, pointerEvents: "none", overflow: "hidden" }}>
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position:     "absolute",
            top:          0,
            left:         `${p.left}%`,
            width:        p.isRect ? p.size * 0.55 : p.size,
            height:       p.size,
            borderRadius: p.isRect ? 2 : "50%",
            background:   p.color,
            animation:    `confettiFall ${p.duration}s ease-in ${p.delay}s both`,
            willChange:   "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
