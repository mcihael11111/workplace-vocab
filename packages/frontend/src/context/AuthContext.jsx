// AuthContext — provides { user, signInWithGoogle, signOut } to the whole app.
// user === undefined  →  still loading (auth state unknown)
// user === null       →  logged out
// user === object     →  logged in (Firebase User)
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // Process any pending redirect result (fires after returning from Google)
    getRedirectResult(auth).catch(() => {});
    return onAuthStateChanged(auth, setUser);
  }, []);

  // signInWithRedirect navigates to Google then returns — no popup, works on all browsers/domains
  const signInWithGoogle = () => signInWithRedirect(auth, googleProvider);
  const signOut          = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);