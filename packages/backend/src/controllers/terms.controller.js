import { termsService } from "../services/terms.service.js";
import { apiResponse }  from "../utils/apiResponse.js";

// Handles HTTP concerns for term routes.
// All business logic is in termsService.

export const termsController = {
  async getAll(req, res, next) {
    try {
      const { level, category, domain, q } = req.query;
      const data = await termsService.getAll({ level, category, domain, q });
      apiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const term = await termsService.getById(req.params.id);
      if (!term) return apiResponse.error(res, "Term not found", 404);
      apiResponse.success(res, term);
    } catch (err) {
      next(err);
    }
  },
};
