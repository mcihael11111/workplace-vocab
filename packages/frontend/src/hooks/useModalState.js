import { useState, useCallback } from "react";

// Manages all flashcard modal state: which words are displayed, which index is active.
// Returns open/close/prev/next/openRelated handlers plus current state values.
export function useModalState() {
  const [modalWords, setModalWords] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);

  const openModal = useCallback((words, i) => {
    setModalWords(words);
    setModalIndex(i);
  }, []);

  const closeModal = useCallback(() => {
    setModalWords(null);
    setModalIndex(null);
  }, []);

  const prevCard = useCallback(() => {
    setModalIndex(i => Math.max(0, i - 1));
  }, []);

  const nextCard = useCallback(() => {
    setModalIndex(i => Math.min((modalWords?.length ?? 1) - 1, i + 1));
  }, [modalWords]);

  // Navigate modal to a single related term
  const openRelated = useCallback(relatedWord => {
    setModalWords([relatedWord]);
    setModalIndex(0);
  }, []);

  return { modalWords, modalIndex, openModal, closeModal, prevCard, nextCard, openRelated };
}
