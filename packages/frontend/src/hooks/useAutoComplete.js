// useAutoComplete — automatically marks a term as "done" based on engagement.
//
// Engagement signals (each worth 1 point):
//   - scrolledPast60  — user scrolled past 60% of the card body
//   - openedAccordion — user opened the Example or Conversation accordion
//   - dwellTime       — user spent ≥ 4s on the card
//
// A term is auto-completed when the user navigates away (next/prev/close)
// AND scored ≥ 2 engagement points. Already-completed terms are skipped.

import { useRef, useCallback, useEffect } from "react";

const DWELL_MS   = 4000;  // minimum time on card to count as engaged
const MIN_POINTS = 2;     // engagement signals required
const SCROLL_PCT = 0.6;   // scroll depth threshold

export function useAutoComplete(termName, { isComplete, onComplete }) {
  const points    = useRef(0);
  const startTime = useRef(Date.now());
  const flushed   = useRef(false);

  // Reset on card change
  useEffect(() => {
    points.current    = 0;
    startTime.current = Date.now();
    flushed.current   = false;
  }, [termName]);

  // ── Signal: scroll depth ─────────────────────────────────────────────────
  const handleScroll = useCallback((e) => {
    const el = e.currentTarget || e.target;
    if (!el) return;
    const pct = (el.scrollTop + el.clientHeight) / el.scrollHeight;
    if (pct >= SCROLL_PCT && !(points.current & 1)) {
      points.current |= 1; // bit 0
    }
  }, []);

  // ── Signal: accordion opened ─────────────────────────────────────────────
  const trackAccordion = useCallback(() => {
    points.current |= 2; // bit 1
  }, []);

  // ── Flush: evaluate and auto-complete on leave ───────────────────────────
  const flush = useCallback(() => {
    if (flushed.current || isComplete) return;
    flushed.current = true;

    // Check dwell time (bit 2)
    if (Date.now() - startTime.current >= DWELL_MS) {
      points.current |= 4;
    }

    // Count set bits
    let p = points.current;
    let count = 0;
    while (p) { count += p & 1; p >>= 1; }

    if (count >= MIN_POINTS) {
      onComplete?.();
    }
  }, [isComplete, onComplete]);

  return { handleScroll, trackAccordion, flush };
}
