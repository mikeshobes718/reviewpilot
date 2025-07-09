// File: src/pages/api/send-review-link.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';

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

// --- Resend Initialization ---
// Initialize Resend with the API key from your environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// --- API Handler ---
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Get all required data from the request body
  const { requestId, paymentIntentId, customerEmail, businessName } = req.body;

  // Validate that we received all the data we need
  if (!requestId || !paymentIntentId || !customerEmail || !businessName) {
    return res.status(400).json({ error: 'Missing required body parameters (requestId, paymentIntentId, customerEmail, businessName).' });
  }

  try {
    const googleReviewUrl = `https://g.page/r/${requestId}/review`; // Placeholder URL

    // 1. Update Firestore document with invite details
    const paymentRef = db
      .collection('review_requests')
      .doc(requestId)
      .collection('payments')
      .doc(paymentIntentId);

    await paymentRef.update({
      invite: {
        link: googleReviewUrl,
        sentAt: new Date(),
        sentTo: customerEmail, // Also save who we sent it to
      },
    });

    // 2. Send the email using Resend
    const { data, error } = await resend.emails.send({
      // For testing, you MUST use onboarding@resend.dev
      // For production, replace this with 'Your Name <you@your-verified-domain.com>'
      from: `The Team @ ${businessName} <onboarding@resend.dev>`,
      // The customer's email address, received from the frontend
      to: [customerEmail],
      subject: `How was your visit to ${businessName}?`,
      // You can use React to build beautiful emails later. For now, HTML is fine.
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Thanks for stopping by ${businessName}!</h2>
          <p>We'd love it if you could share your experience with others.</p>
          <p>Please take a moment to leave us a review by clicking the link below:</p>
          <a 
            href="${googleReviewUrl}" 
            style="display: inline-block; background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;"
          >
            Leave a Review
          </a>
          <p style="margin-top: 20px;">Thanks again!</p>
        </div>
      `,
    });

    if (error) {
      console.error({ error });
      return res.status(500).json({ error: 'Failed to send email.' });
    }

    res.status(200).json({ success: true, message: 'Invite sent successfully.' });

  } catch (err: any) {
    console.error('API Route Error:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}

