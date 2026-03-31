// useProgress — loads and syncs a user's completed terms, viewed terms, and review schedule with Firestore.
// Firestore path: users/{uid}/progress/data
//
// Content is free for everyone. Pro features gate the learning system:
//   - Spaced repetition (review schedule)
//   - Unlimited quizzes
//   - Full learning paths
//   - Advanced progress analytics
//
// Gamification:
//   streakDays / longestStreak / todayCount / lastActivityDate — daily streaks
//   viewedTerms — Set of terms ever opened (persists across sessions)
//   reviewSchedule — SM-2 spaced repetition data per term
//
// Guest (no user): progress + views stored in localStorage.
// On login: guest data is merged into Firestore and localStorage is cleared.
import { useEffect, useState } from "react";
import {
  doc, getDoc, setDoc, updateDoc,
  arrayUnion, arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { calculateNextReview, createNewScheduleEntry, getDueTerms } from "../utils/spacedRepetition.js";

export const DAILY_GOAL      = 3;
export const CONFETTI_AT     = 3;   // celebrate on 3rd unique view
export const FREE_COMPLETION_LIMIT = 30; // free users can mark up to 30 terms complete

const STREAK_MILESTONES  = new Set([3, 7, 14, 30, 60, 100]);
const GUEST_KEY          = "wv_guest_progress";
const GUEST_VIEWS_KEY    = "wv_guest_views";
const GUEST_REVIEWS_KEY  = "wv_guest_reviews";

function todayStr() { return new Date().toISOString().slice(0, 10); }
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadGuest(key) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : []; }
  catch { return []; }
}

function loadGuestObj(key) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}

export function useProgress(user, { onMilestone, onNudge } = {}) {
  const [completedTerms,      setCompletedTerms]      = useState(() => new Set(loadGuest(GUEST_KEY)));
  const [viewedTerms,         setViewedTerms]         = useState(() => new Set(loadGuest(GUEST_VIEWS_KEY)));
  const [reviewSchedule,      setReviewSchedule]      = useState(() => loadGuestObj(GUEST_REVIEWS_KEY));
  const [streakDays,          setStreakDays]          = useState(0);
  const [longestStreak,       setLongestStreak]       = useState(0);
  const [todayCount,          setTodayCount]          = useState(0);
  const [lastActivityDate,    setLastActivityDate]    = useState(null);

  // ── Load on login ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setViewedTerms(new Set(loadGuest(GUEST_VIEWS_KEY)));
      setCompletedTerms(new Set(loadGuest(GUEST_KEY)));
      setReviewSchedule(loadGuestObj(GUEST_REVIEWS_KEY));
      setStreakDays(0); setLongestStreak(0); setTodayCount(0); setLastActivityDate(null);
      return;
    }

    const ref        = doc(db, "users", user.uid, "progress", "data");
    const guestTerms = loadGuest(GUEST_KEY);
    const guestViews = loadGuest(GUEST_VIEWS_KEY);
    const guestReviews = loadGuestObj(GUEST_REVIEWS_KEY);

    getDoc(ref).then(snap => {
      const today    = todayStr();
      const existing = snap.exists() ? snap.data() : {};

      const merged      = [...new Set([...(existing.completedTerms || []), ...guestTerms])];
      const mergedViews = [...new Set([...(existing.viewedTerms    || []), ...guestViews])];
      const mergedReviews = { ...(existing.reviewSchedule || {}), ...guestReviews };

      setCompletedTerms(new Set(merged));
      setViewedTerms(new Set(mergedViews));
      setReviewSchedule(mergedReviews);
      setStreakDays(existing.streakDays || 0);
      setLongestStreak(existing.longestStreak || 0);
      setLastActivityDate(existing.lastActivityDate || null);
      setTodayCount(existing.lastActivityDate === today ? (existing.todayCount || 0) : 0);

      const needsMerge = guestTerms.length > 0 || guestViews.length > 0 || Object.keys(guestReviews).length > 0;
      if (needsMerge) {
        setDoc(ref, { ...existing, completedTerms: merged, viewedTerms: mergedViews, reviewSchedule: mergedReviews }, { merge: true });
        localStorage.removeItem(GUEST_KEY);
        localStorage.removeItem(GUEST_VIEWS_KEY);
        localStorage.removeItem(GUEST_REVIEWS_KEY);
      }
    });
  }, [user?.uid]);

  // ── Track a card view ───────────────────────────────────────────────────
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

  // ── Mark complete (one-way, used by auto-complete) ─────────────────────
  async function markComplete(termName) {
    if (completedTerms.has(termName)) return;
    toggleComplete(termName);
  }

  // ── Record a spaced repetition review ──────────────────────────────────
  async function recordReview(termName, quality) {
    const current = reviewSchedule[termName] || createNewScheduleEntry();
    const updated = calculateNextReview(current, quality);

    const newSchedule = { ...reviewSchedule, [termName]: updated };
    setReviewSchedule(newSchedule);

    if (!user) {
      localStorage.setItem(GUEST_REVIEWS_KEY, JSON.stringify(newSchedule));
      return;
    }

    const ref = doc(db, "users", user.uid, "progress", "data");
    try {
      await updateDoc(ref, { [`reviewSchedule.${termName}`]: updated });
    } catch {
      await setDoc(ref, { reviewSchedule: newSchedule }, { merge: true });
    }
  }

  // ── Due count for nav badge ────────────────────────────────────────────
  const dueCount = getDueTerms(reviewSchedule).length;

  return {
    completedTerms, toggleComplete, markComplete,
    viewedTerms, trackView,
    viewedCount: viewedTerms.size,
    reviewSchedule, recordReview, dueCount,
    streakDays, longestStreak, todayCount,
  };
}

// NUDGE_AT kept in sync with completion nudge
const NUDGE_AT = 5;
