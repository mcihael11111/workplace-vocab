import express from "express";
import { corsMiddleware } from "./middleware/cors.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { notFound }      from "./middleware/notFound.js";
import { errorHandler }  from "./middleware/errorHandler.js";
import apiRoutes         from "./routes/index.js";

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/v1", apiRoutes);

// ── Error handlers (must be last) ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
