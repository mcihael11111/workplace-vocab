// useProgress — loads and syncs a user's completed terms with Firestore.
// Firestore path: users/{uid}/progress/data
//
// Guest (no user): progress is stored in localStorage under GUEST_KEY.
// On login: guest progress is merged into Firestore, then localStorage is cleared.
//
// Gamification fields (written alongside completedTerms):
//   streakDays       — current consecutive day streak
//   longestStreak    — all-time best streak
//   todayCount       — terms completed today (resets when date changes)
//   lastActivityDate — "YYYY-MM-DD" of last completion
//
// Returns:
//   completedTerms  — Set<string>
//   toggleComplete  — (termName: string) => void
//   streakDays      — number
//   longestStreak   — number
//   todayCount      — number
import { useEffect, useState } from "react";
import {
  doc, getDoc, setDoc, updateDoc,
  arrayUnion, arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase.js";

export const DAILY_GOAL    = 3;
export const NUDGE_AT      = 5; // show sign-in nudge after this many guest completions
const STREAK_MILESTONES    = new Set([3, 7, 14, 30, 60, 100]);
const GUEST_KEY            = "wv_guest_progress";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function loadGuestTerms() {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestTerms(set) {
  localStorage.setItem(GUEST_KEY, JSON.stringify([...set]));
}

export function useProgress(user, { onMilestone, onNudge } = {}) {
  const [completedTerms,   setCompletedTerms]   = useState(() => new Set(loadGuestTerms()));
  const [streakDays,       setStreakDays]       = useState(0);
  const [longestStreak,    setLongestStreak]    = useState(0);
  const [todayCount,       setTodayCount]       = useState(0);
  const [lastActivityDate, setLastActivityDate] = useState(null);

  useEffect(() => {
    // Guest — keep using localStorage, nothing to load from Firestore
    if (!user) {
      const guest = new Set(loadGuestTerms());
      setCompletedTerms(guest);
      setStreakDays(0);
      setLongestStreak(0);
      setTodayCount(0);
      setLastActivityDate(null);
      return;
    }

    // Logged in — load Firestore and merge any guest progress
    const ref        = doc(db, "users", user.uid, "progress", "data");
    const guestTerms = loadGuestTerms();

    getDoc(ref).then(snap => {
      const today          = todayStr();
      const existing       = snap.exists() ? snap.data() : {};
      const firestoreTerms = existing.completedTerms || [];

      // Merge guest terms into Firestore set
      const merged = [...new Set([...firestoreTerms, ...guestTerms])];
      const mergeNeeded = guestTerms.length > 0;

      setCompletedTerms(new Set(merged));
      setStreakDays(existing.streakDays || 0);
      setLongestStreak(existing.longestStreak || 0);
      setLastActivityDate(existing.lastActivityDate || null);
      setTodayCount(existing.lastActivityDate === today ? (existing.todayCount || 0) : 0);

      if (mergeNeeded) {
        setDoc(ref, { ...existing, completedTerms: merged }, { merge: true });
        localStorage.removeItem(GUEST_KEY);
      }
    });
  }, [user?.uid]);

  async function toggleComplete(termName) {
    const isDone = completedTerms.has(termName);

    // Guest path — localStorage only
    if (!user) {
      setCompletedTerms(prev => {
        const next = new Set(prev);
        isDone ? next.delete(termName) : next.add(termName);
        saveGuestTerms(next);
        // Nudge after NUDGE_AT completions
        if (!isDone && next.size === NUDGE_AT) onNudge?.();
        return next;
      });
      return;
    }

    // Logged-in path — Firestore
    const ref = doc(db, "users", user.uid, "progress", "data");

    // Optimistic UI update
    setCompletedTerms(prev => {
      const next = new Set(prev);
      isDone ? next.delete(termName) : next.add(termName);
      return next;
    });

    // Streak logic — only fires when marking done, not un-done
    const streakFields = {};
    if (!isDone) {
      const today     = todayStr();
      let newStreak   = streakDays;
      let newToday    = todayCount;

      if (lastActivityDate === today) {
        newToday = todayCount + 1;
      } else if (lastActivityDate === yesterdayStr()) {
        newStreak = streakDays + 1;
        newToday  = 1;
      } else {
        newStreak = 1;
        newToday  = 1;
      }

      const newLongest = Math.max(longestStreak, newStreak);

      streakFields.streakDays       = newStreak;
      streakFields.longestStreak    = newLongest;
      streakFields.todayCount       = newToday;
      streakFields.lastActivityDate = today;

      setStreakDays(newStreak);
      setLongestStreak(newLongest);
      setTodayCount(newToday);
      setLastActivityDate(today);

      if (onMilestone) {
        if (newToday === DAILY_GOAL) {
          onMilestone({ type: "dailyGoal", streakDays: newStreak });
        }
        if (STREAK_MILESTONES.has(newStreak) && lastActivityDate !== today) {
          onMilestone({ type: "streak", days: newStreak });
        }
      }
    }

    try {
      await updateDoc(ref, {
        completedTerms: isDone ? arrayRemove(termName) : arrayUnion(termName),
        ...streakFields,
      });
    } catch {
      await setDoc(ref, {
        completedTerms: isDone ? [] : [termName],
        ...streakFields,
      });
    }
  }

  return { completedTerms, toggleComplete, streakDays, longestStreak, todayCount };
}
