import { env } from "../config/env.js";
import { apiResponse } from "../utils/apiResponse.js";

// Global error handler — must be mounted last with four parameters.
// In production, hides internal error details from the response.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);

  const message = env.NODE_ENV === "production"
    ? "Internal server error"
    : err.message || "Internal server error";

  apiResponse.error(res, message, err.status || 500);
}
