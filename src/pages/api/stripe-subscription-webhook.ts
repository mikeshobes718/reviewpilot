// src/pages/api/stripe-subscription-webhook.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// --- Initialize Services ---
const serviceAccount: ServiceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}
const db = getFirestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Use the new, specific secret for this webhook
const webhookSecret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // --- Handle Specific Stripe Events ---

  try {
    // Event #1: A user successfully completes the checkout process.
    // This is where we create the link between our Firebase user and the new Stripe customer.
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.client_reference_id;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (uid && customerId && subscriptionId) {
        const userRef = db.collection('users').doc(uid);
        await userRef.set({
          stripeCustomerId: customerId,
          subscriptionId: subscriptionId,
        }, { merge: true });
        console.log(`✅ Linked user ${uid} with Stripe customer ${customerId}`);
      }
    }

    // Event #2: A subscription is updated (e.g., a payment succeeds, fails, or it's canceled).
    // This is where we update the user's "VIP pass" (their subscription status).
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Find the user in our database who has this Stripe Customer ID.
      const usersQuery = db.collection('users').where('stripeCustomerId', '==', customerId);
      const querySnapshot = await usersQuery.get();

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const uid = userDoc.id;
        
        // Update their subscription status in our database.
        await userDoc.ref.update({
          subscriptionStatus: subscription.status, // e.g., 'active', 'canceled', 'past_due'
        });
        console.log(`✅ Updated subscription status for user ${uid} to ${subscription.status}`);
      }
    }
  } catch (error) {
      console.error("Error handling webhook event:", error);
  }


  res.status(200).json({ received: true });
};

