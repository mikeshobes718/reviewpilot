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
export async function POST(request: NextRequest) {
  const stripe = getStripe();
  try {
    const { customerId, returnUrl } = await request.json();
    
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required.' }, { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${request.headers.get('origin')}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });

  } catch (error: any) {
    console.error('Error creating portal session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
