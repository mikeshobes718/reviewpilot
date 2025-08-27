'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Check, 
  Crown, 
  ArrowRight, 
  Sparkles, 
  Loader2,
  Zap,
  Users,
  BarChart3,
  MessageSquare,
  Shield,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

export default function SubscribePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('starter');

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small businesses getting started',
      price: 'Free',
      period: '/month',
      features: [
        'Up to 100 review requests per month',
        'Basic analytics dashboard',
        'Email support',
        'Review request templates',
        'Basic integrations'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For growing businesses ready to scale',
      price: '$49.99',
      period: '/month',
      features: [
        'Unlimited review requests',
        'Advanced analytics & insights',
        'Priority support',
        'Custom branding',
        'Advanced integrations',
        'Team collaboration',
        'API access',
        'White-label options'
      ],
      popular: true
    }
  ];

  const handleSubscribe = async () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }

    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          plan: selectedPlan,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/subscribe`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.assign(url);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Reviews & Marketing</span>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                Dashboard
              </Link>
            )}
            <Link href="/auth" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Sign In
            </Link>
            <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 lg:py-32 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Start your 30-day free trial today
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Choose Your
                <span className="gradient-text"> Success Path</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Whether you're just starting out or ready to scale, we have the perfect plan 
                to help you build your business reputation and collect more reviews.
              </p>
            </div>
          </motion.div>

          {/* Plan Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex justify-center mb-12">
              <div className="bg-white p-1 rounded-2xl shadow-soft border border-gray-200">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id as 'starter' | 'pro')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      selectedPlan === plan.id
                        ? 'bg-primary-600 text-white shadow-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-20 lg:pb-32 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className={`relative ${plan.popular ? 'lg:-mt-8 lg:mb-8' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-warning-500 to-warning-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                        <Crown className="w-4 h-4 mr-2" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className={`card p-8 h-full ${plan.popular ? 'ring-2 ring-primary-200' : ''}`}>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 mb-6">{plan.description}</p>
                      <div className="mb-6">
                        <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-lg text-gray-500">{plan.period}</span>
                      </div>
                      {plan.id === 'starter' && (
                        <p className="text-success-600 font-medium">30-day free trial</p>
                      )}
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-success-600" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      {plan.id === 'starter' ? (
                        <Link href="/auth" className="btn-secondary w-full group">
                          Get Started Free
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
          <button
            onClick={handleSubscribe}
            disabled={loading || !user}
                          className="btn-primary w-full group"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              {user ? 'Start Pro Trial' : 'Sign In to Subscribe'}
                              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="px-6 py-20 lg:py-32 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Compare Plans
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See exactly what's included in each plan to make the right choice for your business.
              </p>
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-soft border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-3 divide-x divide-gray-200">
                <div className="p-6 text-center bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Feature</h3>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900">Starter</h3>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900">Pro</h3>
                </div>
              </div>
              
              {[
                { feature: 'Review Requests', starter: '100/month', pro: 'Unlimited' },
                { feature: 'Analytics', starter: 'Basic', pro: 'Advanced' },
                { feature: 'Support', starter: 'Email', pro: 'Priority' },
                { feature: 'Integrations', starter: 'Basic', pro: 'Advanced + API' },
                { feature: 'Team Members', starter: '1', pro: 'Unlimited' },
                { feature: 'Custom Branding', starter: 'No', pro: 'Yes' },
                { feature: 'White-label', starter: 'No', pro: 'Yes' }
              ].map((item, index) => (
                <div key={index} className="grid grid-cols-3 divide-x divide-gray-200">
                  <div className="p-6 bg-gray-50">
                    <span className="font-medium text-gray-900">{item.feature}</span>
                  </div>
                  <div className="p-6 text-center">
                    <span className="text-gray-600">{item.starter}</span>
                  </div>
                  <div className="p-6 text-center">
                    <span className="text-gray-600">{item.pro}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 lg:py-32 lg:px-8 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to know about our pricing and plans.
              </p>
            </div>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Can I change my plan later?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "What happens after my free trial?",
                answer: "After your 30-day free trial, you'll be automatically charged for the plan you selected. You can cancel anytime."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund."
              },
              {
                question: "Can I cancel my subscription?",
                answer: "Absolutely. You can cancel your subscription at any time from your dashboard with no cancellation fees."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:py-32 lg:px-8 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses that are already collecting more reviews 
              and building stronger customer relationships.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-large">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link href="/" className="text-white border border-white/30 hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all duration-200">
                Learn More
              </Link>
            </div>
            <p className="text-primary-200 text-sm mt-6">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Reviews & Marketing</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Turn every satisfied customer into a 5-star advocate with our 
                automated review management platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Reviews & Marketing. All rights reserved.</p>
        </div>
      </div>
      </footer>
    </div>
  );
}
