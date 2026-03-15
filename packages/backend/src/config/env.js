import "dotenv/config";

// Validates and exports all required environment variables.
// Throws on startup if a required variable is missing.

function required(key) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function optional(key, fallback) {
  return process.env[key] ?? fallback;
}

export const env = {
  NODE_ENV:     optional("NODE_ENV", "development"),
  PORT:         parseInt(optional("PORT", "3001"), 10),
  DATABASE_URL: optional("DATABASE_URL", ""),   // Required in production
  CORS_ORIGIN:  optional("CORS_ORIGIN", "http://localhost:5173"),

  // Stripe
  STRIPE_SECRET_KEY:     required("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: required("STRIPE_WEBHOOK_SECRET"),
  STRIPE_PRICE_ID:       required("STRIPE_PRICE_ID"),

  // Firebase Admin (for webhook to write isPro to Firestore)
  FIREBASE_PROJECT_ID:      required("FIREBASE_PROJECT_ID"),
  FIREBASE_SERVICE_ACCOUNT: required("FIREBASE_SERVICE_ACCOUNT"),
};
