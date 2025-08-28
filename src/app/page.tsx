'use client';

import { useState, useEffect } from 'react';
import { m } from '@/components/ui/motion';
import { 
  Star, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  MessageSquare, 
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

export default function Home() {
  const { user, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Automated Review Collection",
      description: "Send personalized review requests automatically after successful transactions"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Track your review performance with detailed insights and metrics"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Customer Segmentation",
      description: "Target specific customer groups for maximum review success"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Smart Follow-ups",
      description: "Intelligent reminder system that increases review completion rates"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Reputation Management",
      description: "Monitor and respond to reviews across all major platforms"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "5-Star Optimization",
      description: "Proven strategies to maximize your 5-star review potential"
    }
  ];

  const stats = [
    { number: "500+", label: "Businesses Trust Us" },
    { number: "50,000+", label: "Reviews Generated" },
    { number: "95%", label: "Customer Satisfaction" },
    { number: "3x", label: "Review Increase" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      business: "Local Coffee Shop",
      content: "Our review count went from 12 to 89 in just 3 months. This platform is a game-changer!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      business: "Auto Repair Service",
      content: "The automated follow-ups have increased our review response rate by 300%. Incredible results!",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      business: "Beauty Salon",
      content: "Finally, a tool that actually helps us collect reviews without being pushy. Love it!",
      rating: 5
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" aria-label="Go to Reviews & Marketing homepage">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center" role="img" aria-label="Star icon representing Reviews & Marketing">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Reviews & Marketing</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors">Success Stories</a>
          </div>
          <div className="flex items-center space-x-4">
            {!loading && user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/auth" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  Sign Out
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
                  Sign In
                </Link>
                <Link href="/subscribe" className="btn-primary">
                  Get Started
              </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Menu</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-6 space-y-4">
              <a 
                href="#features" 
                className="block text-gray-600 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="block text-gray-600 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#testimonials" 
                className="block text-gray-600 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Success Stories
              </a>
              <div className="pt-4 border-t border-gray-200">
                {!loading && user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="block text-gray-600 hover:text-primary-600 transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        auth.signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-600 hover:text-red-600 transition-colors py-2"
                    >
              Sign Out
            </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/auth" 
                      className="block text-gray-600 hover:text-primary-600 transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/subscribe" 
                      className="btn-primary w-full mt-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-800 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                Trusted by 500+ businesses nationwide
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Turn Every Happy Customer Into a
                <span className="gradient-text"> 5-Star Advocate</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Automate your review collection and build unshakeable customer trust. 
                Our AI-powered platform helps businesses collect 3x more reviews while 
                maintaining authentic customer relationships.
              </p>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                <strong className="text-gray-900">Problem we solve:</strong> 89% of customers don't leave reviews because they're never asked. 
                We automatically request reviews from satisfied customers, making it effortless to build your online reputation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth" className="btn-primary text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <button 
                  onClick={() => window.open('https://youtu.be/1KjxVwnzMYw?si=7qOVbMQR6ad9DRaG', '_blank')}
                  className="btn-secondary text-lg px-8 py-4 group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
              </div>
            </div>
          </m.div>

          {/* Hero Stats */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </m.div>
            </div>

                  {/* Hero Visual */}
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="mt-16 max-w-5xl mx-auto">
              <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-success-100 rounded-3xl transform rotate-1"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
                {/* Workflow Animation */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-3" role="img" aria-label="Customer purchase step">
                        <Users className="w-8 h-8 text-blue-600" aria-hidden="true" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Customer Purchase</h4>
                      <p className="text-sm text-gray-600">Customer completes transaction</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-3" role="img" aria-label="Automated review request step">
                        <MessageSquare className="w-8 h-8 text-green-600" aria-hidden="true" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Auto Review Request</h4>
                      <p className="text-sm text-gray-600">We send personalized request</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mb-3" role="img" aria-label="Five-star review result">
                        <Star className="w-8 h-8 text-yellow-600" aria-hidden="true" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">5-Star Review</h4>
                      <p className="text-sm text-gray-600">Customer leaves positive review</p>
                    </div>
                  </div>
                </div>
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Your Review Dashboard
                  </h3>
            <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success-500" />
                      <span className="text-gray-700">Automated review requests sent</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success-500" />
                      <span className="text-gray-700">Real-time performance tracking</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success-500" />
                      <span className="text-gray-700">Customer satisfaction insights</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-success-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">89</div>
                  <div className="text-gray-600 mb-4">Total Reviews</div>
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-warning-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">4.8/5 Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </m.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 lg:py-32 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Everything You Need to Build
                <span className="gradient-text"> Customer Trust</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Our comprehensive platform provides all the tools you need to automate 
                review collection and build a stellar online reputation.
              </p>
            </div>
          </m.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="card card-hover p-8 text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <div className="text-primary-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </m.div>
            ))}
          </div>
          
          {/* Footnotes */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-500 text-center">
              <p role="note" className="text-xs leading-relaxed">
                Conversions measure customers who open the Google review form from your link. We never post on your behalf.
              </p>
              <p role="note" className="text-xs leading-relaxed">
                We follow Google's policy (no review gating). Every customer can leave a public review or message you privately.
              </p>
              <p role="note" className="text-xs leading-relaxed">
                Messaging costs (if any) are billed by your connected provider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20 lg:py-32 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Start free and scale as you grow. No hidden fees, no surprises.
              </p>
            </div>
          </m.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="card p-8 h-full">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                  <p className="text-gray-600 mb-6">Perfect for small businesses getting started</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">Free</span>
                    <span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-success-600 font-medium text-sm">Free forever. Includes a 30‑day Pro trial.</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start space-x-3" data-testid="starter-bullet-1">
                    <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-success-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">Up to 25 review requests per month</span>
                  </li>
                  <li className="flex items-start space-x-3" data-testid="starter-bullet-2">
                    <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-success-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">Public rating link & QR code downloads (print‑ready signage)</span>
                  </li>
                  <li className="flex items-start space-x-3" data-testid="starter-bullet-3">
                    <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-success-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">Google review link with Test Redirect (policy‑safe flow)</span>
                  </li>
                  <li className="flex items-start space-x-3" data-testid="starter-bullet-4">
                    <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-success-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">Feedback Inbox with Statuses & Private Notes</span>
                  </li>
                  <li className="flex items-start space-x-3" data-testid="starter-bullet-5">
                    <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-success-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">Basic analytics: KPIs + star distribution (last 30 days)</span>
                  </li>
                  <li className="flex items-start space-x-3" data-testid="starter-bullet-6">
                    <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-success-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">Manual sharing (link/QR)</span>
                  </li>
                  <li className="flex items-start space-x-3" data-testid="starter-bullet-7">
                    <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-success-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">Basic integrations: Zapier/Make & CSV import</span>
                  </li>
                  <li className="flex items-start space-x-3" data-testid="starter-bullet-8">
                    <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-success-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">Email support</span>
                  </li>
                </ul>

                <div className="mt-auto">
                  <Link href="/subscribe" className="btn-secondary w-full group" data-testid="starter-cta">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </m.div>

            {/* Pro Plan */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-warning-500 to-warning-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center" aria-label="Most Popular Plan" data-testid="pro-badge-most-popular">
                    <Star className="w-4 h-4 mr-2" />
                    Most Popular
                  </div>
                </div>
                
                <div className="card p-8 h-full ring-2 ring-primary-200">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                    <p className="text-gray-600 mb-6">For growing businesses ready to scale</p>
                                           <div className="mb-6">
                         <span className="text-5xl font-bold text-gray-900">$49.99</span>
                         <span className="text-lg text-gray-500">/month</span>
                       </div>
                       <p className="text-primary-600 font-medium text-sm">No setup fees. 30‑day free trial.</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-1">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">Unlimited review requests</span>
                    </li>
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-2">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">Automations: POS auto‑send (Square), send delays & 1 follow‑up reminder</span>
                    </li>
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-3">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">Advanced analytics & insights: trends, keyword cloud, peak times</span>
                    </li>
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-4">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">Team collaboration (up to 5 seats)</span>
                    </li>
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-5">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">Custom branding for public page + custom domain</span>
                    </li>
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-6">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">Full CSV exports (all time)</span>
                    </li>
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-7">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">Advanced integrations: Square (Toast/Clover as they roll out)</span>
                    </li>
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-8">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">Priority support</span>
                    </li>
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-9">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">API access</span>
                    </li>
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-10">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">Extras (Beta): AI reply assistant, Slack/MS Teams alerts, multi‑language templates, testimonial widget, kiosk mode<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">Beta</span></span>
                    </li>
                    <li className="flex items-start space-x-3" data-testid="pro-bullet-11">
                      <div className="w-5 h-5 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-success-600" />
                      </div>
                      <span className="text-gray-700 text-sm leading-relaxed">White‑label options (add‑on)</span>
                    </li>
                  </ul>

                                         <div className="mt-auto">
                         <Link href="/subscribe" className="btn-primary w-full group" data-testid="pro-cta">
                           Start Pro Free
                           <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                         </Link>
                       </div>
                </div>
              </div>
            </m.div>
          </div>
          
          {/* Footnotes */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-500 text-center">
              <p role="note" className="text-xs leading-relaxed">
                Conversions measure customers who open the Google review form from your link. We never post on your behalf.
              </p>
              <p role="note" className="text-xs leading-relaxed">
                We follow Google's policy (no review gating). Every customer can leave a public review or message you privately.
              </p>
              <p role="note" className="text-xs leading-relaxed">
                Messaging costs (if any) are billed by your connected provider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="px-6 py-20 lg:py-32 lg:px-8 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Trusted by Businesses Like Yours
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how real businesses are transforming their online reputation 
                with our platform.
              </p>
            </div>
          </m.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="card card-hover p-8">
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-warning-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-primary-600 text-sm">
                      {testimonial.business}
                    </div>
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:py-32 lg:px-8 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
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
              <Link href="/auth" className="text-white border border-white/30 hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all duration-200">
                Sign In
              </Link>
            </div>
            <p className="text-primary-200 text-sm mt-6">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </m.div>
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
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Reviews & Marketing. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
  );
}

