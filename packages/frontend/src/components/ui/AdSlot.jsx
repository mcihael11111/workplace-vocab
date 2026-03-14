import { useEffect, useRef } from "react";

// AdSlot — renders a Google AdSense responsive display ad.
// publisher: ca-pub-2271448286841066
//
// slot prop: paste the data-ad-slot value from your AdSense dashboard
//   (Ads > By ad unit > create a "Responsive display ad", copy the slot ID)
//
// variant="banner" — full-width horizontal banner between page sections
export function AdSlot({ slot = "1205581780" }) {
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

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
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
