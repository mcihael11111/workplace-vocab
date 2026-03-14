import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";

// Singleton Prisma client — re-used across all requests.
// In development, prevents a new connection pool on every hot-reload.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
