// AuthContext — provides { user, isPro, signInWithGoogle, signOut } to the whole app.
// user === undefined  →  still loading (auth state unknown)
// user === null       →  logged out
// user === object     →  logged in (Firebase User)
// isPro               →  true when Firestore users/{uid}.isPro is true (live via onSnapshot)
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(undefined);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    let unsubFirestore = null;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);

      // Clean up previous Firestore listener when auth state changes
      if (unsubFirestore) {
        unsubFirestore();
        unsubFirestore = null;
      }

      if (u) {
        // Listen to users/{uid} in real-time — updates within seconds after Stripe webhook fires
        unsubFirestore = onSnapshot(
          doc(db, "users", u.uid),
          (snap) => setIsPro(snap.data()?.isPro ?? false),
          () => setIsPro(false)
        );
      } else {
        setIsPro(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
  const signOut          = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, isPro, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);