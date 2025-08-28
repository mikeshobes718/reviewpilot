'use client';

import { useState, useEffect } from 'react';

import { 
  Star, 
  Plus, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Trash2, 
  Edit3, 
  Eye, 
  TrendingUp, 
  Calendar, 
  Target, 
  Clock, 
  CheckCircle,
  X,
  Activity,
  PieChart,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'free';
  stripeCustomerId?: string;
  businessName?: string;
  squareConnected?: boolean;
  email?: string;
  emailVerified?: boolean;
  createdAt?: any; // Firestore Timestamp or Date
}

interface Feedback {
  id: string;
  rating: number;
  comment?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  source: string;
  submittedAt: Date;
  googleClicked: boolean;
}

interface ReviewRequest {
  id: string;
  customerName?: string;
  email?: string;
  phone?: string;
  channel: string;
  source: string;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedGoogleAt?: Date;
  status: string;
  createdAt: Date;
}

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Mock data for development
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setUserProfile({
        businessName: 'Sample Business',
        email: 'user@example.com',
        subscriptionStatus: 'free',
        emailVerified: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      });

      // Mock feedback data
      setFeedback([
        {
          id: '1',
          rating: 5,
          comment: 'Amazing service! Will definitely come back.',
          customerName: 'John Doe',
          email: 'john@example.com',
          source: 'link',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          googleClicked: true
        },
        {
          id: '2',
          rating: 4,
          comment: 'Good experience overall.',
          customerName: 'Jane Smith',
          email: 'jane@example.com',
          source: 'pos',
          submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          googleClicked: false
        },
        {
          id: '3',
          rating: 5,
          comment: 'Excellent!',
          customerName: 'Bob Wilson',
          email: 'bob@example.com',
          source: 'link',
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          googleClicked: true
        }
      ]);

      // Mock review requests
      setReviewRequests([
        {
          id: '1',
          customerName: 'Alice Johnson',
          email: 'alice@example.com',
          channel: 'email',
          source: 'pos',
          status: 'sent',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ]);

      // Mock recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'feedback_received',
          message: 'New 5-star feedback received',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: Star
        },
        {
          id: '2',
          type: 'review_request_sent',
          message: 'Review request sent to customer',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          icon: MessageSquare
        },
        {
          id: '3',
          type: 'google_review_clicked',
          message: 'Customer clicked Google review link',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          icon: TrendingUp
        }
      ]);

      setLoadingProfile(false);
    }, 1000);
  }, []);

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const totalFeedback = feedback.length;
  const last30DaysFeedback = feedback.filter(f => 
    f.submittedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  const averageRating = feedback.length > 0 
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : '0.0';
  
  const fiveStarReviews = feedback.filter(f => f.rating === 5).length;
  const last30DaysFiveStar = feedback.filter(f => 
    f.rating === 5 && f.submittedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  const googleClicks = feedback.filter(f => f.googleClicked).length;
  const last30DaysGoogleClicks = feedback.filter(f => 
    f.googleClicked && f.submittedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  const conversionRate = fiveStarReviews > 0 
    ? ((googleClicks / fiveStarReviews) * 100).toFixed(1)
    : '0.0';

  // Feedback distribution for funnel
  const ratingDistribution = {
    5: feedback.filter(f => f.rating === 5).length,
    4: feedback.filter(f => f.rating === 4).length,
    3: feedback.filter(f => f.rating === 3).length,
    2: feedback.filter(f => f.rating === 2).length,
    1: feedback.filter(f => f.rating === 1).length
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.businessName || 'Business Owner'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your business reputation today.
          </p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Feedback Received */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-3xl font-bold text-gray-900">{totalFeedback}</p>
              <p className="text-sm text-gray-500">Last 30 days: {last30DaysFeedback}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
              <p className="text-sm text-gray-500">Based on {totalFeedback} reviews</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* 5-Star Reviews Sent to Google */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">5★ → Google</p>
              <p className="text-3xl font-bold text-gray-900">{googleClicks}</p>
              <p className="text-sm text-gray-500">Last 30 days: {last30DaysGoogleClicks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* 5★ Conversion Rate */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">5★ Conversion</p>
              <p className="text-3xl font-bold text-gray-900">{conversionRate}%</p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Funnel & Recent Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback Funnel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Funnel (Last 30 Days)</h3>
          <div className="space-y-4">
            {Object.entries(ratingDistribution).reverse().map(([rating, count]) => (
              <div key={rating} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    {[...Array(parseInt(rating))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{rating}★</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{count}</span>
                  {rating === '5' && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {count > 0 ? Math.round((googleClicks / count) * 100) : 0}% to Google
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

                 {/* Recent Feedback Ticker */}
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
          <div className="space-y-3">
            {feedback.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex space-x-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.customerName || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {item.comment || 'No comment'}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {item.submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link 
              href="/dashboard/inbox" 
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Feedback →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State or CTA */}
      {totalFeedback === 0 && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-200 p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-primary-900 mb-2">
            Ready to collect your first review?
          </h3>
          <p className="text-primary-700 mb-6">
            Connect your Google Business profile and start collecting reviews from satisfied customers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard/setup" className="btn-primary">
              <Settings className="w-4 h-4 mr-2" />
              Get Started
            </Link>
            <Link href="/dashboard/integrations" className="btn-secondary">
              <Zap className="w-4 h-4 mr-2" />
              Connect POS
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
