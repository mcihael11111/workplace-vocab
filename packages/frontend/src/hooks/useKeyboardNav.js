import { useEffect } from "react";

// Attaches a keydown listener for the given key→callback map.
// Cleans up automatically on unmount or when dependencies change.
//
// Usage:
//   useKeyboardNav({
//     Escape:     onClose,
//     ArrowLeft:  onPrev,
//     ArrowRight: onNext,
//   }, [onClose, onPrev, onNext]);
export function useKeyboardNav(keyMap, deps = []) {
  useEffect(() => {
    const handler = e => {
      const cb = keyMap[e.key];
      if (cb) cb(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
