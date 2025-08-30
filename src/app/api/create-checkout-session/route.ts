import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

let cachedStripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!cachedStripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY as string;
    if (!secretKey) { throw new Error("STRIPE_SECRET_KEY is not set"); }
    cachedStripe = new Stripe(secretKey, { apiVersion: "2025-06-30.basil" });
  }
  return cachedStripe;
}

// Initialize Stripe with environment variable
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  try {
    const { plan, successUrl, cancelUrl } = await request.json();
    
    if (!plan) {
      return NextResponse.json({ error: 'Plan is required.' }, { status: 400 });
    }

    // Map plan to price ID
    let priceId: string;
    if (plan === 'pro') {
      priceId = 'price_1RtCwIHeDIfu648XMWOVdjQV'; // Your Pro plan price ID
    } else {
      return NextResponse.json({ error: 'Invalid plan selected.' }, { status: 400 });
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
      success_url: successUrl || `${request.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.headers.get('origin')}/subscribe`,
    });

    if (!checkoutSession.url) {
      return NextResponse.json({ error: 'Could not create checkout session.' }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutSession.url });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
