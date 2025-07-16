// src/pages/api/create-payment-intent.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// --- Firebase Admin SDK Initialization ---
const serviceAccount: ServiceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}
const db = getFirestore();

// --- Stripe Initialization ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // THE FIX IS HERE: Update to the version Vercel expects.
  apiVersion: '2025-06-30.basil',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { amount, requestId, businessName } = req.body;

  if (!amount || !requestId || !businessName) {
    return res.status(400).json({ error: 'Missing amount, requestId, or businessName' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        reviewpilot_request_id: requestId,
        reviewpilot_business_name: businessName,
      },
    });

    const paymentRef = db
      .collection('review_requests')
      .doc(requestId)
      .collection('payments')
      .doc(paymentIntent.id);

    await paymentRef.set({
      amount: paymentIntent.amount,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      created_at: new Date(),
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e: any) {
    console.error('API Error:', e.message);
    res.status(500).json({ statusCode: 500, message: e.message });
  }
}

