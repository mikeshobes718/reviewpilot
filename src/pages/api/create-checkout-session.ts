// src/pages/api/create-checkout-session.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// --- Initialize Services ---
const serviceAccount: ServiceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // --- Security Check: Verify the user making the request ---
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).send('Authentication required.');
    }
    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const { priceId } = req.body;
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required.' });
    }

    // --- Create a Checkout Session ---
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: uid,
      success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
    });

    if (!checkoutSession.url) {
        return res.status(500).json({ error: 'Could not create checkout session.' });
    }

    res.status(200).json({ sessionId: checkoutSession.id, url: checkoutSession.url });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Internal Server Error');
  }
}

