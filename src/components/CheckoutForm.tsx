// src/components/CheckoutForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { 
  CreditCard, 
  Mail, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Star,
  ArrowRight
} from 'lucide-react';

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

    try {
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
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);

    try {
      const { clientSecret, error: apiErr } = await fetch(
        '/api/create-payment-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, requestId, businessName }),
        }
      ).then((r) => r.json());

      if (apiErr || !clientSecret) {
        setError(apiErr ?? 'Server error');
        return;
      }

      const { paymentIntent, error: confErr } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: elements.getElement(CardElement)! },
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
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-success-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Payment Successful! 🎉
            </h3>
            <p className="text-gray-600">
              Your payment has been processed. Now let's send the review link to your customer.
            </p>
          </div>
          
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-primary-900">Send Review Link</span>
            </div>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter customer's email address"
              className="input-field mb-4"
              required
            />
            <button
              onClick={handleSendReviewLink}
              disabled={busy || !customerEmail}
              className="btn-primary w-full"
            >
              {busy ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Review Link
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (linkSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto">
            <Star className="w-10 h-10 text-success-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Review Link Sent! 🚀
            </h3>
            <p className="text-gray-600 mb-4">
              We've sent a review request to <span className="font-medium text-gray-900">{customerEmail}</span>
            </p>
            <p className="text-sm text-gray-500">
              The automated system will now track the review process and notify you of any updates.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-success-500" />
              <span>Payment processed successfully</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
              <CheckCircle className="w-4 h-4 text-success-500" />
              <span>Review link sent to customer</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
              <CheckCircle className="w-4 h-4 text-success-500" />
              <span>Automated follow-ups enabled</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-md mx-auto">
      <div className="card p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Complete Your Payment
          </h3>
          <p className="text-gray-600">
            Process payment and send review request to your customer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Email */}
          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="input-field pl-10"
                required
                disabled={busy}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              We'll send the review request to this email address
            </p>
          </div>

          {/* Payment Amount Display */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Payment Amount</p>
            <p className="text-3xl font-bold text-gray-900">
              ${(amount / 100).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              For {businessName} review request
            </p>
          </div>

          {/* Card Element */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credit Card Information
            </label>
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#374151',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                  },
                  disabled: !customerEmail || busy,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your payment information is secure and encrypted
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!stripe || busy || !customerEmail}
            className="btn-primary w-full group"
          >
            {busy ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                Pay ${(amount / 100).toFixed(2)}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secure payment powered by Stripe</span>
            </div>
          </div>
        </form>
      </div>
        </div>
      </motion.div>
  );
}

export default function CheckoutForm(props: Props) {
  return (
    <Elements stripe={stripePromise}>
      <Inner {...props} />
    </Elements>
  );
}

// Missing icon components
const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

