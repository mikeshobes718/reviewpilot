'use client';

import { useState, useEffect, FormEvent } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link'; // Import the Link component
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
} from 'firebase/firestore';

import AuthForm from '../components/AuthForm';
import CheckoutForm from '../components/CheckoutForm';

interface ReviewRequest {
  id: string;
  business_name: string;
  owner_id: string;
  created_at: Timestamp;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  // --- NEW: State to track if the current user is an admin ---
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // --- NEW: Check for admin claim on the main page ---
        const tokenResult = await currentUser.getIdTokenResult(true);
        if (tokenResult.claims.admin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        // Fetch user's review requests (existing logic)
        const q = query(
          collection(db, 'review_requests'),
          where('owner_id', '==', currentUser.uid)
        );
        const unsubRequests = onSnapshot(q, (querySnapshot) => {
          const requestsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ReviewRequest[];
          setRequests(requestsData);
        });
        return () => unsubRequests();
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCreateRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (user && newBusinessName.trim() !== '') {
      await addDoc(collection(db, 'review_requests'), {
        business_name: newBusinessName.trim(),
        owner_id: user.uid,
        created_at: serverTimestamp(),
      });
      setNewBusinessName('');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    await deleteDoc(doc(db, 'review_requests', id));
  };

  if (loading) {
    return <p className="text-center mt-10 animate-pulse">Loading Dashboard...</p>;
  }

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {!user ? (
          <AuthForm />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">ReviewPilot</h1>
              <div className="flex items-center gap-4">
                {/* --- NEW: Conditional Admin Button --- */}
                {isAdmin && (
                  <Link href="/admin">
                    <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm">
                      Admin
                    </button>
                  </Link>
                )}
                <button onClick={() => auth.signOut()} className="text-sm text-gray-600 hover:text-blue-600">
                  Sign Out
                </button>
              </div>
            </div>

            {/* Rest of the component remains the same */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Create a New Review Request</h2>
              <form onSubmit={handleCreateRequest} className="flex gap-4">
                <input
                  type="text"
                  value={newBusinessName}
                  onChange={(e) => setNewBusinessName(e.target.value)}
                  placeholder="Enter Business Name (e.g., 'Acme Coffee Shop')"
                  className="flex-grow p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition">
                  Create
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{req.business_name}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {req.created_at?.toDate().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => setActiveRequestId(activeRequestId === req.id ? null : req.id)}
                        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition text-sm font-semibold"
                      >
                        {activeRequestId === req.id ? 'Close' : 'Take Payment'}
                      </button>
                      <button 
                        onClick={() => handleDeleteRequest(req.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {activeRequestId === req.id && (
                    <div className="mt-6 border-t pt-6">
                      <CheckoutForm 
                        amount={500}
                        requestId={req.id}
                        businessName={req.business_name} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

