import { categoriesService } from "../services/categories.service.js";
import { apiResponse }       from "../utils/apiResponse.js";

export const categoriesController = {
  async getAll(req, res, next) {
    try {
      const { domain } = req.query;
      const data = await categoriesService.getAll({ domain });
      apiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const cat = await categoriesService.getById(req.params.id);
      if (!cat) return apiResponse.error(res, "Category not found", 404);
      apiResponse.success(res, cat);
    } catch (err) {
      next(err);
    }
  },

  async getTerms(req, res, next) {
    try {
      const terms = await categoriesService.getTerms(req.params.id);
      apiResponse.success(res, terms);
    } catch (err) {
      next(err);
    }
  },
};
