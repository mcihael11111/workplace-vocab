import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { env } from "./env.js";

// Supports two formats for FIREBASE_SERVICE_ACCOUNT env var:
//   1. Raw JSON string  (paste the whole service account JSON)
//   2. Base64-encoded JSON  (useful on platforms with env var length limits)
function getServiceAccount() {
  const raw = env.FIREBASE_SERVICE_ACCOUNT;
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  }
}

if (!getApps().length) {
  initializeApp({
    credential: cert(getServiceAccount()),
    projectId: env.FIREBASE_PROJECT_ID,
  });
}

export const adminDb = getFirestore();
