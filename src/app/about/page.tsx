'use client';

import { motion } from 'framer-motion';
import { Star, Users, Target, Shield, Heart, Zap, Award, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer-First",
      description: "We believe every business deserves to shine. Your success is our mission."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Security",
      description: "Your data and reputation are sacred. We protect them with enterprise-grade security."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation",
      description: "We constantly evolve our platform to stay ahead of the competition."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "We don't just meet expectations—we exceed them, every single time."
    }
  ];

  const team = [
    {
      name: "Michael Rodriguez",
      role: "Founder & CEO",
      bio: "Former marketing executive with 15+ years building customer relationships and brand reputation.",
      image: "/team/mike.jpg"
    },
    {
      name: "Sarah Chen",
      role: "Head of Product",
      bio: "Product strategist passionate about creating intuitive solutions that solve real business problems.",
      image: "/team/sarah.jpg"
    },
    {
      name: "David Thompson",
      role: "CTO",
      bio: "Technology leader with expertise in scalable SaaS platforms and AI-driven automation.",
      image: "/team/david.jpg"
    }
  ];

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
              Our <span className="gradient-text">Story</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to help businesses build trust, one review at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-20 lg:px-8 bg-white">
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
                In today's digital world, your online reputation is everything. Yet most businesses struggle to collect and manage customer reviews effectively. We're changing that.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our platform makes it simple for businesses to collect authentic reviews, build customer trust, and drive growth through proven reputation management strategies.
              </p>
              <div className="flex items-center space-x-4">
                <Target className="w-8 h-8 text-primary-600" />
                <span className="text-lg font-semibold text-gray-900">Building Trust, One Review at a Time</span>
              </div>
            </motion.div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">500+ Businesses</h3>
                  <p className="text-gray-600">Trust us with their reputation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-6 py-20 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="text-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-6 py-20 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate professionals dedicated to revolutionizing how businesses manage their online reputation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <Users className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join hundreds of businesses already using our platform to build trust and drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/subscribe" className="btn-primary">
                Get Started Today
              </Link>
              <Link href="/contact" className="btn-secondary">
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
