import { prisma } from "../db/client.js";

// Business logic for category queries.

export const categoriesService = {
  async getAll({ domain } = {}) {
    return prisma.category.findMany({
      where: domain && domain !== "All" ? { domain } : {},
      orderBy: { name: "asc" },
    });
  },

  async getById(idOrSlug) {
    return prisma.category.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
  },

  async getTerms(idOrSlug) {
    return prisma.term.findMany({
      where: { category: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] } },
      orderBy: { term: "asc" },
    });
  },
};
