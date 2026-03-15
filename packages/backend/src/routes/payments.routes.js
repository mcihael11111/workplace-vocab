import { Router } from "express";
import express from "express";
import { paymentsController } from "../controllers/payments.controller.js";

const router = Router();

// POST /api/v1/payments/create-checkout-session
router.post("/create-checkout-session", paymentsController.createCheckoutSession);

// POST /api/v1/payments/webhook
// Must use express.raw() here — Stripe signature verification requires the raw body bytes.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentsController.handleWebhook
);

export default router;
