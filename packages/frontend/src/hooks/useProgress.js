// useProgress — loads and syncs a user's completed terms with Firestore.
// Firestore path: users/{uid}/progress/data → { completedTerms: string[] }
//
// Returns:
//   completedTerms  — Set<string> of completed term names
//   toggleComplete  — (termName: string) => void
import { useEffect, useState } from "react";
import {
  doc, getDoc, setDoc, updateDoc,
  arrayUnion, arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase.js";

export function useProgress(user) {
  const [completedTerms, setCompletedTerms] = useState(new Set());

  // Load on login
  useEffect(() => {
    if (!user) { setCompletedTerms(new Set()); return; }
    const ref = doc(db, "users", user.uid, "progress", "data");
    getDoc(ref).then(snap => {
      if (snap.exists()) {
        setCompletedTerms(new Set(snap.data().completedTerms || []));
      }
    });
  }, [user?.uid]);

  async function toggleComplete(termName) {
    if (!user) return;
    const ref       = doc(db, "users", user.uid, "progress", "data");
    const isDone    = completedTerms.has(termName);
    const transform = isDone ? arrayRemove(termName) : arrayUnion(termName);

    // Optimistic UI update
    setCompletedTerms(prev => {
      const next = new Set(prev);
      isDone ? next.delete(termName) : next.add(termName);
      return next;
    });

    // Persist — updateDoc fails if doc doesn't exist yet, so fall back to setDoc
    try {
      await updateDoc(ref, { completedTerms: transform });
    } catch {
      await setDoc(ref, { completedTerms: isDone ? [] : [termName] });
    }
  }

  return { completedTerms, toggleComplete };
}
