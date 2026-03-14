import corsLib from "cors";
import { env } from "../config/env.js";

// CORS middleware — only allows requests from the configured frontend origin.
// In production, set CORS_ORIGIN to your deployed frontend URL.
export const corsMiddleware = corsLib({
  origin: env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
