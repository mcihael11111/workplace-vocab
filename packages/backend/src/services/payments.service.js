import Stripe from "stripe";
import { env } from "../config/env.js";
import { adminDb } from "../config/firebase-admin.js";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const FRONTEND_URL = env.CORS_ORIGIN; // https://workvocab.com in production

export const paymentsService = {
  async createCheckoutSession({ uid, email }) {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
      client_reference_id: uid,
      customer_email: email || undefined,
      metadata: { firebaseUid: uid },
      success_url: `${FRONTEND_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${FRONTEND_URL}/`,
    });
    return session.url;
  },

  async handleWebhook(rawBody, signature) {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const uid = session.metadata?.firebaseUid || session.client_reference_id;
      if (!uid) throw new Error("No Firebase UID found on Stripe session");

      await adminDb.doc(`users/${uid}`).set(
        {
          isPro: true,
          stripeCustomerId: session.customer,
          subscribedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    // TODO: handle customer.subscription.deleted → set isPro: false for cancellations
  },
};
