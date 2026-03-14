import { useState, useEffect } from "react";

// Returns the current window.innerWidth and updates on resize.
// Defaults to 1200 on SSR/non-browser environments.
export function useWindowSize() {
  const [w, setW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return w;
}
