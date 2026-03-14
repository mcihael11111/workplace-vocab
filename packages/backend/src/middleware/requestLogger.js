import { env } from "../config/env.js";

// Logs method, path, status code, and response time in development.
// Silent in production (use a hosted logging service instead).
export function requestLogger(req, res, next) {
  if (env.NODE_ENV !== "development") return next();

  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.path} → ${res.statusCode} (${ms}ms)`);
  });
  next();
}
