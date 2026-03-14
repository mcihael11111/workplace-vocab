// AuthContext — provides { user, signInWithGoogle, signOut } to the whole app.
// user === undefined  →  still loading (auth state unknown)
// user === null       →  logged out
// user === object     →  logged in (Firebase User)
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
  const signOut          = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);