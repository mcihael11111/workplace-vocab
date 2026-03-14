import { useEffect, useRef } from "react";

// AdSlot — renders a Google AdSense responsive display ad.
// publisher: ca-pub-2271448286841066
//
// slot prop: paste the data-ad-slot value from your AdSense dashboard
//   (Ads > By ad unit > create a "Responsive display ad", copy the slot ID)
//
// variant="grid"   — fits inside the category card grid
// variant="drawer" — fits inside the category drawer word list
export function AdSlot({ slot = "1205581780", variant = "grid" }) {
  const insRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // adsbygoogle not loaded (e.g. blocked by ad blocker) — silently ignore
    }
  }, []);

  const containerStyle = variant === "drawer"
    ? { borderRadius: 12, overflow: "hidden", minHeight: 80 }
    : { borderRadius: 14, overflow: "hidden", minHeight: 130 };

  return (
    <div style={containerStyle}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2271448286841066"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
