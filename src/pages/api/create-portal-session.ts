// src/pages/api/create-portal-session.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
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

    // --- Logic: Find the user's Stripe Customer ID ---
    const userDocRef = db.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();

    if (!userDocSnap.exists) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const stripeCustomerId = userDocSnap.data()?.stripeCustomerId;

    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'Stripe customer ID not found for this user.' });
    }

    // --- Create a Portal Session ---
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      // This is the URL the user will be sent back to after they're done managing their subscription.
      return_url: `${req.headers.origin}/`,
    });

    res.status(200).json({ url: portalSession.url });

  } catch (error: any) {
    console.error('Error creating portal session:', error);
    res.status(500).send('Internal Server Error');
  }
}

