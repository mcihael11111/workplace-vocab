import { Router } from "express";
import healthRoutes     from "./health.routes.js";
import termsRoutes      from "./terms.routes.js";
import categoriesRoutes from "./categories.routes.js";

const router = Router();

router.use("/health",     healthRoutes);
router.use("/terms",      termsRoutes);
router.use("/categories", categoriesRoutes);

export default router;
