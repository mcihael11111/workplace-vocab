import { apiResponse } from "../utils/apiResponse.js";

// 404 handler — must be mounted AFTER all routes.
export function notFound(req, res) {
  apiResponse.error(res, `Route not found: ${req.method} ${req.path}`, 404);
}
