// useProgress — loads and syncs a user's completed terms and viewed terms with Firestore.
// Firestore path: users/{uid}/progress/data
//
// Free tier: users can view up to FREE_VIEW_LIMIT unique cards.
//   After that, new cards are locked behind an upgrade wall.
//   Already-viewed cards can always be re-opened.
//
// Gamification:
//   streakDays / longestStreak / todayCount / lastActivityDate — daily streaks
//   viewedTerms — Set of terms ever opened (persists across sessions)
//
// Guest (no user): progress + views stored in localStorage.
// On login: guest data is merged into Firestore and localStorage is cleared.
import { useEffect, useState } from "react";
import {
  doc, getDoc, setDoc, updateDoc,
  arrayUnion, arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase.js";

export const DAILY_GOAL      = 3;
export const FREE_VIEW_LIMIT = 9;   // unique cards before paywall
export const CONFETTI_AT     = 3;   // celebrate on 3rd unique view

const STREAK_MILESTONES  = new Set([3, 7, 14, 30, 60, 100]);
const GUEST_KEY          = "wv_guest_progress";
const GUEST_VIEWS_KEY    = "wv_guest_views";

function todayStr() { return new Date().toISOString().slice(0, 10); }
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadGuest(key) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : []; }
  catch { return []; }
}

export function useProgress(user, { onMilestone, onNudge } = {}) {
  const [completedTerms,   setCompletedTerms]   = useState(() => new Set(loadGuest(GUEST_KEY)));
  const [viewedTerms,      setViewedTerms]      = useState(() => new Set(loadGuest(GUEST_VIEWS_KEY)));
  const [streakDays,       setStreakDays]       = useState(0);
  const [longestStreak,    setLongestStreak]    = useState(0);
  const [todayCount,       setTodayCount]       = useState(0);
  const [lastActivityDate, setLastActivityDate] = useState(null);

  // ── Load on login ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setCompletedTerms(new Set(loadGuest(GUEST_KEY)));
      setViewedTerms(new Set(loadGuest(GUEST_VIEWS_KEY)));
      setStreakDays(0); setLongestStreak(0); setTodayCount(0); setLastActivityDate(null);
      return;
    }

    const ref        = doc(db, "users", user.uid, "progress", "data");
    const guestTerms = loadGuest(GUEST_KEY);
    const guestViews = loadGuest(GUEST_VIEWS_KEY);

    getDoc(ref).then(snap => {
      const today    = todayStr();
      const existing = snap.exists() ? snap.data() : {};

      const merged      = [...new Set([...(existing.completedTerms || []), ...guestTerms])];
      const mergedViews = [...new Set([...(existing.viewedTerms    || []), ...guestViews])];

      setCompletedTerms(new Set(merged));
      setViewedTerms(new Set(mergedViews));
      setStreakDays(existing.streakDays || 0);
      setLongestStreak(existing.longestStreak || 0);
      setLastActivityDate(existing.lastActivityDate || null);
      setTodayCount(existing.lastActivityDate === today ? (existing.todayCount || 0) : 0);

      const needsMerge = guestTerms.length > 0 || guestViews.length > 0;
      if (needsMerge) {
        setDoc(ref, { ...existing, completedTerms: merged, viewedTerms: mergedViews }, { merge: true });
        localStorage.removeItem(GUEST_KEY);
        localStorage.removeItem(GUEST_VIEWS_KEY);
      }
    });
  }, [user?.uid]);

  // ── Track a card view ───────────────────────────────────────────────────
  // Only counts the first time a term is opened. Re-views are free.
  async function trackView(termName) {
    if (viewedTerms.has(termName)) return;

    const newViewed = new Set(viewedTerms);
    newViewed.add(termName);
    setViewedTerms(newViewed);

    // Milestone: celebrate on CONFETTI_AT
    if (newViewed.size === CONFETTI_AT) {
      onMilestone?.({ type: "confetti", count: newViewed.size });
    }

    if (!user) {
      localStorage.setItem(GUEST_VIEWS_KEY, JSON.stringify([...newViewed]));
      // Nudge after free limit is reached
      if (newViewed.size === NUDGE_AT) onNudge?.();
      return;
    }

    const ref = doc(db, "users", user.uid, "progress", "data");
    try {
      await updateDoc(ref, { viewedTerms: arrayUnion(termName) });
    } catch {
      await setDoc(ref, { viewedTerms: [termName] }, { merge: true });
    }
  }

  // ── Toggle term completion ───────────────────────────────────────────────
  async function toggleComplete(termName) {
    const isDone = completedTerms.has(termName);

    // Guest path — localStorage only
    if (!user) {
      setCompletedTerms(prev => {
        const next = new Set(prev);
        isDone ? next.delete(termName) : next.add(termName);
        localStorage.setItem(GUEST_KEY, JSON.stringify([...next]));
        if (!isDone && next.size === NUDGE_AT) onNudge?.();
        return next;
      });
      return;
    }

    const ref = doc(db, "users", user.uid, "progress", "data");

    setCompletedTerms(prev => {
      const next = new Set(prev);
      isDone ? next.delete(termName) : next.add(termName);
      return next;
    });

    const streakFields = {};
    if (!isDone) {
      const today   = todayStr();
      let newStreak = streakDays;
      let newToday  = todayCount;

      if (lastActivityDate === today) {
        newToday = todayCount + 1;
      } else if (lastActivityDate === yesterdayStr()) {
        newStreak = streakDays + 1; newToday = 1;
      } else {
        newStreak = 1; newToday = 1;
      }

      const newLongest = Math.max(longestStreak, newStreak);
      streakFields.streakDays = newStreak; streakFields.longestStreak = newLongest;
      streakFields.todayCount = newToday; streakFields.lastActivityDate = today;

      setStreakDays(newStreak); setLongestStreak(newLongest);
      setTodayCount(newToday); setLastActivityDate(today);

      if (onMilestone) {
        if (newToday === DAILY_GOAL) onMilestone({ type: "dailyGoal", streakDays: newStreak });
        if (STREAK_MILESTONES.has(newStreak) && lastActivityDate !== today) onMilestone({ type: "streak", days: newStreak });
      }
    }

    try {
      await updateDoc(ref, {
        completedTerms: isDone ? arrayRemove(termName) : arrayUnion(termName),
        ...streakFields,
      });
    } catch {
      await setDoc(ref, { completedTerms: isDone ? [] : [termName], ...streakFields });
    }
  }

  return {
    completedTerms, toggleComplete,
    viewedTerms, trackView,
    viewedCount: viewedTerms.size,
    isViewLimitReached: viewedTerms.size >= FREE_VIEW_LIMIT,
    streakDays, longestStreak, todayCount,
  };
}

// NUDGE_AT kept in sync with completion nudge
const NUDGE_AT = 5;
