import { Router } from "express";
import { termsController } from "../controllers/terms.controller.js";

const router = Router();

// GET /api/v1/terms?level=&category=&domain=&q=
router.get("/", termsController.getAll);

// GET /api/v1/terms/:id  (id or slug)
router.get("/:id", termsController.getById);

export default router;
