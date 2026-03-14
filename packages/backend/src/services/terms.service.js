import { prisma } from "../db/client.js";

// Business logic for term queries.
// Controllers call these — no Express req/res here.

export const termsService = {
  async getAll({ level, category, domain, q } = {}) {
    return prisma.term.findMany({
      where: {
        ...(level    && level    !== "All" ? { level }                        : {}),
        ...(category                       ? { category: { name: category } } : {}),
        ...(domain   && domain   !== "All" ? { category: { domain } }         : {}),
        ...(q ? {
          OR: [
            { term:         { contains: q, mode: "insensitive" } },
            { definition:   { contains: q, mode: "insensitive" } },
          ],
        } : {}),
      },
      include: { category: true },
      orderBy: { term: "asc" },
    });
  },

  async getById(idOrSlug) {
    return prisma.term.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: { category: true },
    });
  },
};
