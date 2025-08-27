'use client';

import { motion } from 'framer-motion';
import { Star, Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Reviews & Marketing</span>
            </Link>
          </div>

          {/* 404 Content */}
          <div className="mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl font-bold text-primary-600">404</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Page Not Found
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/" 
              className="btn-primary flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="btn-secondary flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 mr-2 text-primary-600" />
              Looking for something specific?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/about" 
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                  <Star className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">About Us</p>
                  <p className="text-sm text-gray-600">Learn about our company</p>
                </div>
              </Link>
              
              <Link 
                href="/contact" 
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                  <Search className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Contact</p>
                  <p className="text-sm text-gray-600">Get in touch with us</p>
                </div>
              </Link>
              
              <Link 
                href="/subscribe" 
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                  <Star className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Pricing</p>
                  <p className="text-sm text-gray-600">View our plans</p>
                </div>
              </Link>
              
              <Link 
                href="/privacy" 
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                  <Search className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Privacy</p>
                  <p className="text-sm text-gray-600">Privacy policy</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-gray-500">
            <p className="text-sm">
              Still can't find what you're looking for?{' '}
              <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
