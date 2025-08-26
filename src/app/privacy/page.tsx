'use client';

import { motion } from 'framer-motion';
import { Star, Shield, Lock, Eye, FileText, Calendar, Clock, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
         const lastUpdated = "August 26, 2025";
  
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
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're committed to protecting your privacy and being transparent about 
              how we collect, use, and safeguard your information.
            </p>
            <div className="flex items-center justify-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Last Updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Version 2.1</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-6 py-20 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Commitment to Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                At Reviews & Marketing, we believe that privacy is a fundamental human right. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you use our review management platform. We are committed to 
                being transparent about our data practices and giving you control over your information.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              This policy applies to all users of our platform, including customers, visitors, 
              and anyone who interacts with our services. By using our platform, you agree to 
              the collection and use of information in accordance with this policy.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the "Last Updated" 
              date. We encourage you to review this Privacy Policy periodically.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Compliance */}
      <section className="px-6 py-20 lg:py-32 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">
            Legal Compliance
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                GDPR Compliance
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We comply with the General Data Protection Regulation (GDPR) for users in the 
                European Union. This includes data subject rights, lawful processing, and 
                appropriate security measures.
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                CCPA Compliance
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We comply with the California Consumer Privacy Act (CCPA) for California residents. 
                This includes disclosure requirements and consumer rights regarding personal information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="px-6 py-20 lg:py-32 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
            Questions About Privacy?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
            If you have any questions about this Privacy Policy or our data practices, 
            please don't hesitate to contact us. We're here to help and ensure your privacy is protected.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <Mail className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <a 
                href="mailto:privacy@reviewsandmarketing.com" 
                className="text-primary-600 hover:underline"
              >
                privacy@reviewsandmarketing.com
              </a>
            </div>
            
            <div className="text-center">
              <Phone className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <a 
                href="tel:+15551234567" 
                className="text-primary-600 hover:underline"
              >
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:py-32 lg:px-8 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Your Privacy Matters to Us
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            We're committed to protecting your information and being transparent about 
            our data practices. Your trust is our priority.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-large">
              Contact Us
            </Link>
            <Link href="/about" className="text-white border border-white/30 hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-all duration-200">
              Learn More
            </Link>
          </div>
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
