'use client';

import { motion } from 'framer-motion';
import { Star, Users, Target, Shield, Award, Globe, Heart, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Reviews & Marketing</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 lg:py-32 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              About <span className="gradient-text">Reviews & Marketing</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to help businesses build trust, credibility, and growth 
              through authentic customer reviews and strategic reputation management.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-20 lg:py-32 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                In today's digital world, online reviews are the new word-of-mouth. 
                They can make or break a business. We believe every great business 
                deserves to be discovered and trusted by potential customers.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our platform democratizes reputation management, making it accessible 
                for businesses of all sizes to collect authentic reviews, build customer 
                trust, and drive sustainable growth.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8 lg:p-12">
                <div className="text-center">
                  <Star className="w-16 h-16 text-primary-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Why We Started
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    After seeing countless excellent businesses struggle with their 
                    online reputation, we knew there had to be a better way. 
                    Traditional review management was either too expensive, too 
                    complicated, or too impersonal.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-20 lg:py-32 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
                          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These principles guide everything we do, from product development 
                to customer support.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="card p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Customer-First Approach
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We believe that every business deserves to showcase their excellence. Our platform is built around the principle that satisfied customers are your best advocates.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="card p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Trust & Transparency
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We maintain the highest standards of data security and privacy. Your customer relationships and business data are protected with enterprise-grade security.
                </p>
              </div>
            </motion.div>
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
              Ready to Join Our Mission?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Start building trust with your customers today. Join hundreds of 
              businesses that are already transforming their online reputation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/subscribe" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-large">
                Start Free Trial
              </Link>
              <Link href="/contact" className="text-white border border-white/30 hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all duration-200">
                Get in Touch
              </Link>
            </div>
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
                <li><a href="/#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/#testimonials" className="hover:text-white transition-colors">Success Stories</a></li>
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
