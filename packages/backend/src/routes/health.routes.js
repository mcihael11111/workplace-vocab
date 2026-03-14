import { Router } from "express";

const router = Router();

// GET /api/v1/health — uptime check for load balancers and deployment pipelines
router.get("/", (req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

export default router;
