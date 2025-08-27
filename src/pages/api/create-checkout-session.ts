// src/pages/api/create-checkout-session.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Initialize Stripe with environment variable
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
    const { plan, successUrl, cancelUrl } = req.body;
    
    if (!plan) {
      return res.status(400).json({ error: 'Plan is required.' });
    }

    // Map plan to price ID
    let priceId: string;
    if (plan === 'pro') {
      priceId = 'price_1RtCwIHeDIfu648XMWOVdjQV'; // Your Pro plan price ID
    } else {
      return res.status(400).json({ error: 'Invalid plan selected.' });
    }

    // Create a Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/subscribe`,
    });

    if (!checkoutSession.url) {
      return res.status(500).json({ error: 'Could not create checkout session.' });
    }

    res.status(200).json({ url: checkoutSession.url });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

