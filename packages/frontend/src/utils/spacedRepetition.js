// Simplified SM-2 spaced repetition algorithm.
// Quality ratings: 0 = Forgot, 1 = Hard, 2 = Good, 3 = Easy

const MIN_EASE = 1.3;
const MAX_INTERVAL = 60; // days

function todayStr() { return new Date().toISOString().slice(0, 10); }

export function createNewScheduleEntry() {
  return {
    interval: 0,
    easeFactor: 2.5,
    nextReview: todayStr(),
    repetitions: 0,
    lastReviewed: null,
  };
}

// quality: 0 = Forgot, 1 = Hard, 2 = Good, 3 = Easy
export function calculateNextReview(entry, quality) {
  const today = todayStr();
  let { interval, easeFactor, repetitions } = entry;

  if (quality <= 0) {
    // Forgot — reset
    return {
      interval: 1,
      easeFactor: Math.max(MIN_EASE, easeFactor - 0.2),
      nextReview: addDays(today, 1),
      repetitions: 0,
      lastReviewed: today,
    };
  }

  if (quality === 1) {
    // Hard — same interval, ease decreases
    const newEase = Math.max(MIN_EASE, easeFactor - 0.15);
    const newInterval = Math.max(1, interval);
    return {
      interval: newInterval,
      easeFactor: newEase,
      nextReview: addDays(today, newInterval),
      repetitions: repetitions + 1,
      lastReviewed: today,
    };
  }

  // Good or Easy
  let newInterval;
  if (repetitions === 0) {
    newInterval = 1;
  } else if (repetitions === 1) {
    newInterval = 3;
  } else {
    newInterval = Math.round(interval * easeFactor);
  }

  if (quality === 3) {
    // Easy bonus
    newInterval = Math.round(newInterval * 1.3);
  }

  newInterval = Math.min(MAX_INTERVAL, Math.max(1, newInterval));

  const newEase = quality === 3
    ? Math.min(3.0, easeFactor + 0.1)
    : easeFactor;

  return {
    interval: newInterval,
    easeFactor: newEase,
    nextReview: addDays(today, newInterval),
    repetitions: repetitions + 1,
    lastReviewed: today,
  };
}

export function getDueTerms(reviewSchedule, today) {
  if (!reviewSchedule) return [];
  const t = today || todayStr();
  return Object.entries(reviewSchedule)
    .filter(([, entry]) => entry.nextReview <= t)
    .sort((a, b) => a[1].nextReview.localeCompare(b[1].nextReview))
    .map(([termName]) => termName);
}

export function getNewTermsForToday(allTerms, reviewSchedule, completedTerms, limit = 5) {
  const scheduled = new Set(Object.keys(reviewSchedule || {}));
  return allTerms
    .filter(w => !scheduled.has(w.term) && !completedTerms?.has(w.term))
    .slice(0, limit)
    .map(w => w.term);
}

export function getReviewStats(reviewSchedule) {
  if (!reviewSchedule) return { total: 0, mastered: 0, learning: 0, due: 0 };
  const today = todayStr();
  let mastered = 0, learning = 0, due = 0;
  for (const entry of Object.values(reviewSchedule)) {
    if (entry.interval >= 21) mastered++;
    else learning++;
    if (entry.nextReview <= today) due++;
  }
  return { total: Object.keys(reviewSchedule).length, mastered, learning, due };
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
