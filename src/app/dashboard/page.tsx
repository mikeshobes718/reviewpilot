'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, auth } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
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
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface ReviewRequest {
  id: string;
  business_name: string;
  owner_id: string;
  created_at: Timestamp;
  status?: string;
  customer_email?: string;
  review_link_sent?: boolean;
}

interface UserProfile {
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'free';
  stripeCustomerId?: string;
  businessName?: string;
  squareConnected?: boolean;
  email?: string;
  emailVerified?: boolean;
}

export default function Dashboard() {
  const { user, loading: loadingAuth } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isManagingBilling, setIsManagingBilling] = useState(false);

  // Effect 2: Handle user-specific data after authentication
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setUserProfile(null);
      setRequests([]);
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    
    // Add timeout fallback to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loadingProfile) {
        console.log('Profile loading timeout, setting default profile');
        setUserProfile({
          businessName: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || undefined,
          subscriptionStatus: 'free',
          emailVerified: user.emailVerified
        });
        setLoadingProfile(false);
      }
    }, 10000); // 10 second timeout

    // Fetch admin status
    user.getIdTokenResult(true).then((tokenResult) => {
      setIsAdmin(tokenResult.claims.admin === true);
    });

    // Real-time user profile listener
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
      console.log('Profile snapshot received:', docSnap.exists() ? 'exists' : 'not exists');
      if (docSnap.exists()) {
        const profileData = docSnap.data() as UserProfile;
        console.log('Profile data:', profileData);
        setUserProfile(profileData);
      } else {
        console.log('No profile document found, creating default profile');
        // Create a default profile if none exists
        setDoc(userDocRef, {
          businessName: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || undefined,
          createdAt: new Date(),
          subscriptionStatus: 'free',
          emailVerified: user.emailVerified
        }).then(() => {
          setUserProfile({
            businessName: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || undefined,
            subscriptionStatus: 'free',
            emailVerified: user.emailVerified
          });
        }).catch((error) => {
          console.error('Error creating profile:', error);
          setUserProfile({
            businessName: user.displayName || user.email?.split('@')[0] || 'User',
            email: user.email || undefined,
            subscriptionStatus: 'free',
            emailVerified: user.emailVerified
          });
        });
      }
      setLoadingProfile(false);
    }, (error) => {
      console.error('Profile listener error:', error);
      // Set default profile on error
      setUserProfile({
        businessName: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email || undefined,
        subscriptionStatus: 'free',
        emailVerified: user.emailVerified
      });
      setLoadingProfile(false);
    });

    // Real-time review requests listener
    const q = query(collection(db, 'review_requests'), where('owner_id', '==', user.uid));
    const unsubscribeRequests = onSnapshot(q, (querySnapshot) => {
      const requestsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ReviewRequest[];
      setRequests(requestsData);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribeProfile();
      unsubscribeRequests();
    };
  }, [user]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newBusinessName.trim() !== '') {
      await addDoc(collection(db, 'review_requests'), {
        business_name: newBusinessName.trim(),
        owner_id: user.uid,
        created_at: serverTimestamp(),
        status: 'pending',
        review_link_sent: false,
      });
      setNewBusinessName('');
      setShowCreateForm(false);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    await deleteDoc(doc(db, 'review_requests', id));
  };

  const redirectToCustomerPortal = async () => {
    if (!user) return;
    setIsManagingBilling(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to create portal session.');
      }
      const { url } = await response.json();
      window.location.assign(url);
    } catch (error) {
      console.error("Error redirecting to customer portal:", error);
      setIsManagingBilling(false);
    }
  };



  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 animate-pulse">Initializing Authentication...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  // Check if user has a valid subscription plan
  // Show upgrade prompt only for users who need premium features
  if (!loadingProfile && userProfile && userProfile.subscriptionStatus === 'free') {
    // Allow free users to access dashboard but show upgrade prompts for premium features
    // This will be handled in the main dashboard content below
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600 animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  const stats = [
    {
      label: 'Total Requests',
      value: requests.length,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'primary'
    },
    {
      label: 'Pending Reviews',
      value: requests.filter(r => r.status === 'pending').length,
      icon: <Clock className="w-6 h-6" />,
      color: 'warning'
    },
    {
      label: 'Completed Reviews',
      value: requests.filter(r => r.status === 'completed').length,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'success'
    },
    {
      label: 'Success Rate',
      value: requests.length > 0 ? Math.round((requests.filter(r => r.status === 'completed').length / requests.length) * 100) : 0,
      suffix: '%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="bg-white shadow-soft border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Row - Logo and Actions */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Reviews & Marketing</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link href="/admin" className="btn-secondary">
                  Admin Panel
                </Link>
              )}
              <button 
                onClick={() => auth.signOut()} 
                className="text-gray-600 hover:text-red-600 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-8 border-t border-gray-100 pt-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              <span>Home</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-primary-600 font-medium border-b-2 border-primary-600 pb-2"
            >
              <span>Dashboard</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              <span>Contact</span>
            </Link>
            <Link
              href="/subscribe"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              <span>Pricing</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userProfile?.businessName || user.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-gray-600">
              Manage your review requests and track your business reputation.
            </p>
            
            {/* Subscription Plan Display */}
            <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                  <p className="text-gray-600">
                    {userProfile?.subscriptionStatus === 'active' ? (
                      <span className="text-success-600 font-medium">Pro Plan - $49.99/month</span>
                    ) : userProfile?.subscriptionStatus === 'free' ? (
                      <span className="text-warning-600 font-medium">Starter Plan - Free</span>
                    ) : (
                      <span className="text-gray-600">Loading plan...</span>
                    )}
                  </p>
                </div>
                {userProfile?.subscriptionStatus === 'free' && (
                  <Link 
                    href="/subscribe" 
                    className="btn-primary"
                  >
                    Upgrade to Pro
                  </Link>
                )}
                {userProfile?.subscriptionStatus === 'active' && (
                  <button 
                    onClick={redirectToCustomerPortal} 
                    disabled={isManagingBilling} 
                    className="btn-secondary"
                  >
                    {isManagingBilling ? 'Loading...' : 'Manage Billing'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}{stat.suffix || ''}
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                    <div className={`text-${stat.color}-600`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Free Plan Upgrade Banner */}
        {userProfile?.subscriptionStatus === 'free' && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card p-6 mb-8 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary-800 mb-2">
                    🎉 Welcome to Your Free Trial!
                  </h3>
                  <p className="text-primary-700 mb-4">
                    You're currently on the <strong>Starter Plan</strong> which includes up to 25 review requests per month. 
                    Try out our basic features and upgrade to Pro when you're ready for unlimited requests and advanced analytics.
                  </p>
                  <div className="flex items-center space-x-4">
                    <Link href="/subscribe" className="btn-primary">
                      Upgrade to Pro
                    </Link>
                    <div className="text-sm text-primary-600">
                      <div className="flex items-center space-x-2">
                        <span>
                          Current: {requests.length}/25 requests this month
                        </span>
                        <div className="w-24 bg-primary-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((requests.length / 25) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs">Pro: Unlimited requests</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subscription Status for non-free users */}
        {userProfile?.subscriptionStatus && userProfile.subscriptionStatus !== 'active' && userProfile.subscriptionStatus !== 'free' && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card p-6 mb-8 bg-gradient-to-r from-warning-50 to-warning-100 border-warning-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-warning-800 mb-2">
                    Subscription Issue
                  </h3>
                  <p className="text-warning-700">
                    There's an issue with your subscription. Please contact support or check your billing.
                  </p>
                </div>
                <Link href="/subscribe" className="btn-warning">
                  Resolve Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Create New Request */}
        {(userProfile?.subscriptionStatus === 'active' || userProfile?.subscriptionStatus === 'free' || isAdmin) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Review Request</h2>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="btn-primary"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Request
                </button>
              </div>

              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <form onSubmit={handleCreateRequest} className="space-y-4">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        id="businessName"
                        type="text"
                        value={newBusinessName}
                        onChange={(e) => setNewBusinessName(e.target.value)}
                        placeholder="Enter business name (e.g., 'Acme Coffee Shop')"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button type="submit" className="btn-success">
                        Create Request
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Review Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Requests</h2>
            
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No review requests yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first review request to start building your business reputation.
                </p>
                {(userProfile?.subscriptionStatus === 'active' || userProfile?.subscriptionStatus === 'free' || isAdmin) && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn-primary"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Request
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-soft transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {request.business_name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {request.created_at?.toDate().toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'completed' 
                                ? 'bg-success-100 text-success-700'
                                : 'bg-warning-100 text-warning-700'
                            }`}>
                              {request.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-warning-600 transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRequest(request.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
