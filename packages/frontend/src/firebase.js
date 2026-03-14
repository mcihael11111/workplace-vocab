// Firebase initialisation — Auth + Firestore
// Web config is intentionally public (security is enforced by Firestore Rules).
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyAmOVLwaqXwB3W3OUg6-ep-BfcoQxt-YkY",
  authDomain:        "workplace-vocab.firebaseapp.com",
  projectId:         "workplace-vocab",
  storageBucket:     "workplace-vocab.firebasestorage.app",
  messagingSenderId: "331972724033",
  appId:             "1:331972724033:web:6d4f37a8f08e1c73d08dc0",
};

const app = initializeApp(firebaseConfig);

export const auth           = getAuth(app);
export const db             = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
