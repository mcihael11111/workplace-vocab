// Quiz question generator.
// Produces multiple-choice questions from the term database.
// Question types: definition-match, term-match, scenario-match, conversation-fill

import { ALL_WORDS } from "../data/words.js";

const QUESTION_TYPES = ["definition", "term", "scenario", "conversation"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(correctTerm, count = 3) {
  // Prefer same-category terms for plausible distractors
  const sameCategory = ALL_WORDS.filter(
    w => w.category === correctTerm.category && w.term !== correctTerm.term
  );
  const others = ALL_WORDS.filter(
    w => w.category !== correctTerm.category && w.term !== correctTerm.term
  );

  const pool = shuffle(sameCategory).concat(shuffle(others));
  return pool.slice(0, count);
}

function makeQuestion(term) {
  const type = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];
  const distractors = pickDistractors(term);

  switch (type) {
    case "definition": {
      // Show definition, pick the correct term
      const answers = shuffle([
        { text: term.term, correct: true },
        ...distractors.map(d => ({ text: d.term, correct: false })),
      ]);
      return {
        type,
        question: term.definition,
        prompt: "Which term matches this definition?",
        answers,
        termName: term.term,
        category: term.category,
      };
    }
    case "term": {
      // Show term, pick the correct definition
      const answers = shuffle([
        { text: term.definition, correct: true },
        ...distractors.map(d => ({ text: d.definition, correct: false })),
      ]);
      return {
        type,
        question: term.term,
        prompt: `What does "${term.term}" mean?`,
        answers,
        termName: term.term,
        category: term.category,
      };
    }
    case "scenario": {
      // Show scenario, pick the term
      if (!term.scenario) return makeQuestion({ ...term, __fallback: true }); // retry with different type
      const answers = shuffle([
        { text: term.term, correct: true },
        ...distractors.map(d => ({ text: d.term, correct: false })),
      ]);
      return {
        type,
        question: term.scenario,
        prompt: "Which term does this scenario describe?",
        answers,
        termName: term.term,
        category: term.category,
      };
    }
    case "conversation": {
      // Show conversation with blank, pick the term
      if (!term.example) return makeQuestion({ ...term, __fallback: true });
      const blanked = term.example.replace(
        new RegExp(term.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
        "______"
      );
      const answers = shuffle([
        { text: term.term, correct: true },
        ...distractors.map(d => ({ text: d.term, correct: false })),
      ]);
      return {
        type,
        question: blanked !== term.example ? blanked : term.example,
        prompt: "Fill in the blank:",
        answers,
        termName: term.term,
        category: term.category,
      };
    }
    default:
      return makeQuestion(term);
  }
}

export function generateQuiz(options = {}) {
  const {
    reviewSchedule = {},
    completedTerms = new Set(),
    count = 10,
    pathTermNames = null, // optional: limit to specific terms
  } = options;

  const today = new Date().toISOString().slice(0, 10);
  let pool = pathTermNames
    ? ALL_WORDS.filter(w => pathTermNames.includes(w.term))
    : [...ALL_WORDS];

  // Prioritise due review terms (60%), then completed, then new
  const dueNames = new Set(
    Object.entries(reviewSchedule)
      .filter(([, e]) => e.nextReview <= today)
      .map(([name]) => name)
  );
  const completedNames = completedTerms;

  const due = shuffle(pool.filter(w => dueNames.has(w.term)));
  const completed = shuffle(pool.filter(w => completedNames.has(w.term) && !dueNames.has(w.term)));
  const fresh = shuffle(pool.filter(w => !completedNames.has(w.term) && !dueNames.has(w.term)));

  const dueCount = Math.min(due.length, Math.ceil(count * 0.6));
  const completedCount = Math.min(completed.length, Math.ceil((count - dueCount) * 0.5));
  const freshCount = count - dueCount - completedCount;

  const selected = [
    ...due.slice(0, dueCount),
    ...completed.slice(0, completedCount),
    ...fresh.slice(0, freshCount),
  ];

  // Fill remaining if not enough
  while (selected.length < count && selected.length < pool.length) {
    const remaining = pool.filter(w => !selected.some(s => s.term === w.term));
    if (remaining.length === 0) break;
    selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }

  return shuffle(selected).map(makeQuestion);
}
