// src/components/CheckoutForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Props {
  amount: number;
  requestId: string;
  businessName: string;
}

function Inner({ amount, requestId, businessName }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');

  async function handleSendReviewLink() {
    if (!paymentIntentId || !customerEmail) {
      setError('Please enter a customer email.');
      return;
    }
    setBusy(true);
    setError(null);

    const res = await fetch('/api/send-review-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        paymentIntentId,
        customerEmail,
        businessName,
      }),
    });

    if (res.ok) {
      setLinkSent(true);
    } else {
      const { error } = await res.json();
      setError(error || 'Failed to send link.');
    }
    setBusy(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);

    // This is the API call that was failing.
    const { clientSecret, error: apiErr } = await fetch(
      '/api/create-payment-intent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // THE FIX IS HERE: We now include businessName in the body.
        body: JSON.stringify({ amount, requestId, businessName }),
      }
    ).then((r) => r.json());

    if (apiErr || !clientSecret) {
      setError(apiErr ?? 'Server error');
      setBusy(false);
      return;
    }

    const { paymentIntent, error: confErr } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card: elements.getElement(CardElement)! },
        // We'll also add the customer's email here so Stripe can send a receipt
        // and our webhook can read it.
        receipt_email: customerEmail, 
      }
    );

    if (confErr) {
      setError(confErr.message ?? 'Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setPaymentIntentId(paymentIntent.id);
      setFinished(true);
    } else {
      setError('An unexpected error occurred during payment confirmation.');
    }
    setBusy(false);
  }

  // --- UI Logic ---

  if (finished) {
    return (
      <div className="text-center space-y-4 max-w-sm mx-auto">
        <p className="text-blue-600 text-lg">
          🚀 Invite Sent to {customerEmail}!
        </p>
        <p className="text-sm text-gray-500">The automated webhook is now processing.</p>
      </div>
    );
  }

  // This is the new combined form for payment AND email collection
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <input
        type="email"
        value={customerEmail}
        onChange={(e) => setCustomerEmail(e.target.value)}
        placeholder="Enter customer's email first"
        className="w-full p-2 border rounded-md"
        required
      />
      <CardElement
        options={{
          hidePostalCode: true,
          style: { base: { fontSize: '16px' } },
          disabled: !customerEmail, // Disable card field until email is entered
        }}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || busy || !customerEmail}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {busy ? 'Processing…' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}

export default function CheckoutForm(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <Inner {...props} />
    </Elements>
  );
}

