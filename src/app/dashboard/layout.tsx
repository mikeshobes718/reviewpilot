'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  Inbox, 
  Settings, 
  Zap, 
  User, 
  Home,
  Bell,
  HelpCircle,
  CheckCircle,
  X
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the dashboard.</p>
          <Link href="/auth" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Setup', href: '/dashboard/setup', icon: Settings },
    { name: 'Integrations', href: '/dashboard/integrations', icon: Zap },
    { name: 'Account', href: '/dashboard/account', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Reviews & Marketing</span>
              </Link>
            </div>

            {/* Right side - Notifications, Help, User */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              {/* Help */}
              <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{user.email}</p>
                </div>
                <button 
                  onClick={() => {/* TODO: Implement sign out */}}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-6 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-gray-200">
              <Link
                href="/"
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Context Rail (Right Side) */}
          <div className="hidden xl:block xl:fixed xl:right-0 xl:top-16 xl:w-80 xl:h-full xl:bg-white xl:border-l xl:border-gray-200 xl:shadow-sm">
            <div className="p-6 space-y-6">
              {/* Onboarding Checklist */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-3">Onboarding Checklist</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">Connect Google Business</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-300 rounded-full"></div>
                    <span className="text-sm text-blue-700">Share review link</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-300 rounded-full"></div>
                    <span className="text-sm text-blue-700">Connect POS system</span>
                  </div>
                </div>
              </div>

              {/* Usage Meter */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Usage This Month</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Review Requests</span>
                    <span className="font-medium">0 / 25</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500">Free plan limit</p>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Notifications</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">No new notifications</p>
                </div>
              </div>

              {/* Help */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">Get started with our quick setup guide</p>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View Guide →
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 xl:mr-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
