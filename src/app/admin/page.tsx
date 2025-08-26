// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { 
  Star, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Shield,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Activity,
  Database,
  Server
} from 'lucide-react';
import Link from 'next/link';

interface UserData {
  uid: string;
  email: string;
  businessName?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'incomplete';
  stripeCustomerId?: string;
  squareConnected?: boolean;
  createdAt?: any;
  lastLogin?: any;
  disabled?: boolean;
  isAdmin?: boolean;
}

interface ReviewRequest {
  id: string;
  business_name: string;
  owner_id: string;
  created_at: any;
  status?: string;
  customer_email?: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'requests' | 'system'>('overview');
  const [auth, setAuth] = useState<any>(null);
  const [db, setDb] = useState<any>(null);

  // Initialize Firebase only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('../../lib/firebase').then((firebase) => {
        setAuth(firebase.auth);
        setDb(firebase.db);
      });
    }
  }, []);

  useEffect(() => {
    if (!auth) return; // Wait for Firebase to load

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!user || !auth) {
      setIsAdmin(false);
      setUsers([]);
      setReviewRequests([]);
      setLoadingData(false);
      return;
    }

    // Check admin status
    user.getIdTokenResult(true).then((tokenResult) => {
      if (tokenResult.claims.admin === true) {
        setIsAdmin(true);
        fetchData();
      } else {
        setIsAdmin(false);
        setLoadingData(false);
      }
    });
  }, [user, auth]);

  const fetchData = () => {
    if (!db) return;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers: UserData[] = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserData[];
      setUsers(fetchedUsers);
      setLoadingData(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoadingData(false);
    });

    return () => unsubscribe();
  };

  // This function handles the API call to enable or disable a user.
  const handleToggleUserStatus = async (targetUid: string, currentStatus: boolean) => {
    if (!user) return;

    // This is an "optimistic update". We update the UI immediately
    // for a snappy, responsive feel, assuming the API call will succeed.
    setUsers(users.map(u => 
      u.uid === targetUid ? { ...u, disabled: !currentStatus } : u
    ));

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/set-user-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          targetUid: targetUid,
          disabled: !currentStatus, // Send the opposite of the current status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user status.');
      }
    } catch (err: any) {
      console.error("Error toggling user status:", err);
      // If the API call fails, we revert the UI back to its original state.
      setUsers(users.map(u => 
        u.uid === targetUid ? { ...u, disabled: currentStatus } : u
      ));
    }
  };

  // --- UI Rendering Logic ---

  if (loadingAuth) {
    return <div className="text-center mt-20 animate-pulse">Loading authentication...</div>;
  }

  if (isAdmin === false) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You do not have permission to view this page.</p>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        {/* Placeholder for other admin content */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Users</h2>
          {loadingData ? (
            <p>Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((appUser) => (
                    <tr key={appUser.uid}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appUser.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                 {(appUser.disabled || false) ? (
                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Disabled</span>
                        ) : (
                           <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {appUser.isAdmin ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Admin</span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">User</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* Prevent an admin from disabling themselves */}
                        {!appUser.isAdmin && (
                           <button 
                                                         onClick={() => handleToggleUserStatus(appUser.uid, appUser.disabled || false)}
                                                         className={`px-3 py-1 text-xs rounded-md ${(appUser.disabled || false) ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors duration-200`}
                           >
                                                         {(appUser.disabled || false) ? 'Enable' : 'Disable'}
                           </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

