import { paymentsService } from "../services/payments.service.js";
import { apiResponse } from "../utils/apiResponse.js";

export const paymentsController = {
  async createCheckoutSession(req, res, next) {
    try {
      const { uid, email } = req.body;
      if (!uid) return apiResponse.error(res, "uid is required", 400);
      const url = await paymentsService.createCheckoutSession({ uid, email });
      apiResponse.success(res, { url });
    } catch (err) {
      next(err);
    }
  },

  async handleWebhook(req, res) {
    try {
      await paymentsService.handleWebhook(req.body, req.headers["stripe-signature"]);
      res.json({ received: true });
    } catch (err) {
      // Return 400 so Stripe knows to retry
      res.status(400).json({ error: err.message });
    }
  },
};
