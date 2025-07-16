// src/pages/api/stripe-webhook.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { Resend } from 'resend';
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// --- Initialize All Services ---
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
  // This is the fix for the Vercel build error.
  apiVersion: '2025-06-30.basil',
});
const resend = new Resend(process.env.RESEND_API_KEY);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY!;

export const config = {
  api: {
    bodyParser: false,
  },
};

// --- Helper function to get the real review URL ---
async function getGoogleReviewUrl(businessName: string): Promise<string | null> {
  if (!googleApiKey) {
    console.error('Google Places API key is not configured.');
    return null;
  }
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    businessName
  )}&key=${googleApiKey}`;

  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const placeId = data.results[0].place_id;
      return `https://search.google.com/local/writereview?placeid=${placeId}`;
    }
    return null;
  } catch (error) {
    console.error('Error fetching from Google Places API:', error);
    return null;
  }
}


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

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log(`✅ PaymentIntent succeeded: ${paymentIntent.id}`);

    const requestId = paymentIntent.metadata.reviewpilot_request_id;
    const businessName = paymentIntent.metadata.reviewpilot_business_name;
    const customerEmail = paymentIntent.receipt_email;

    if (!requestId || !businessName || !customerEmail) {
      console.error('❌ Webhook missing necessary metadata or receipt email.');
      return res.status(200).json({ received: true, message: "Missing metadata." });
    }

    console.log(`🔎 Searching for Google Review Link for: ${businessName}`);
    const reviewUrl = await getGoogleReviewUrl(businessName);

    if (!reviewUrl) {
      console.warn(`Could not find a review link for ${businessName}. Email will not be sent.`);
      return res.status(200).json({ received: true, message: "No review link found." });
    }
    console.log(`✅ Found review link: ${reviewUrl}`);

    try {
      await resend.emails.send({
        from: `The Team @ ${businessName} <onboarding@resend.dev>`,
        to: [customerEmail],
        subject: `Thanks for visiting ${businessName}!`,
        html: `<p>We'd love it if you could leave a review of your experience at ${businessName}!</p><a href="${reviewUrl}">Leave a Review</a>`,
      });
      console.log(`📧 Review email sent to ${customerEmail} for ${businessName}`);

      const paymentRef = db
        .collection('review_requests').doc(requestId)
        .collection('payments').doc(paymentIntent.id);
      
      await paymentRef.update({ 'invite.webhook_processed_at': new Date(), 'invite.review_url': reviewUrl });

    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }
  }

  res.status(200).json({ received: true });
};

export default handler;

