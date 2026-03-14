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
};
