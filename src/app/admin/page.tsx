// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';

interface AppUser {
  uid: string;
  email: string | null;
  disabled: boolean;
  createdAt: string;
  lastSignIn: string;
  isAdmin: boolean;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This function handles the API call to enable or disable a user.
  const handleToggleUserStatus = async (targetUid: string, currentStatus: boolean) => {
    if (!user) return;

    // This is an "optimistic update". We update the UI immediately
    // for a snappy, responsive feel, assuming the API call will succeed.
    setAllUsers(allUsers.map(u => 
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
      setError(err.message);
      // If the API call fails, we revert the UI back to its original state.
      setAllUsers(allUsers.map(u => 
        u.uid === targetUid ? { ...u, disabled: currentStatus } : u
      ));
    }
  };

  // This useEffect hook handles authentication and data fetching.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const tokenResult = await currentUser.getIdTokenResult(true);
        const isAdminClaim = tokenResult.claims.admin === true;
        setIsAdmin(isAdminClaim);

        if (isAdminClaim) {
          try {
            const idToken = await currentUser.getIdToken();
            const response = await fetch('/api/list-users', {
              headers: { Authorization: `Bearer ${idToken}` },
            });
            if (!response.ok) throw new Error('Failed to fetch user list.');
            const data = await response.json();
            setAllUsers(data.users);
          } catch (error) {
            console.error("Error fetching users:", error);
            setError("Could not load user data.");
          } finally {
            setLoadingUsers(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []); // The empty dependency array means this runs once on component mount

  // --- UI Rendering Logic ---

  if (isAdmin === null) {
    return <div className="text-center mt-20 animate-pulse">Verifying access...</div>;
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
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Users</h2>
          {loadingUsers ? (
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
                  {allUsers.map((appUser) => (
                    <tr key={appUser.uid}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appUser.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {appUser.disabled ? (
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
                            onClick={() => handleToggleUserStatus(appUser.uid, appUser.disabled)}
                            className={`px-3 py-1 text-xs rounded-md ${appUser.disabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors duration-200`}
                           >
                            {appUser.disabled ? 'Enable' : 'Disable'}
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

