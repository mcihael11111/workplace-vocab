import { Router } from "express";
import { categoriesController } from "../controllers/categories.controller.js";

const router = Router();

// GET /api/v1/categories?domain=
router.get("/", categoriesController.getAll);

// GET /api/v1/categories/:id
router.get("/:id", categoriesController.getById);

// GET /api/v1/categories/:id/terms
router.get("/:id/terms", categoriesController.getTerms);

export default router;
