// src/app/page.tsx
"use client";

import { FormEvent, useState, useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [businessName, setBusinessName] = useState("");

  // track logged-in user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
  }, []);

  // listen for this user’s review_requests
  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, "review_requests"),
      where("owner_id", "==", userId)
    );
    return onSnapshot(q, (snap) =>
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [userId]);

  // create a new request
  const createRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId || !businessName.trim()) return;
    await addDoc(collection(db, "review_requests"), {
      business_name: businessName.trim(),
      customer_name: "Alice",
      customer_phone: "+1-555-1234",
      customer_email: "alice@example.com",
      owner_id: userId,
      created_at: Timestamp.now(),
    });
    setBusinessName("");
  };

  // delete a request
  const deleteRequest = async (id: string) => {
    await deleteDoc(doc(db, "review_requests", id));
  };

  // if not signed in, show the AuthForm
  if (!userId) {
    return (
      <main className="p-6 max-w-md mx-auto">
        <AuthForm />
      </main>
    );
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Review Requests</h1>

      <form onSubmit={createRequest} className="flex gap-2 mb-6">
        <input
          className="flex-1 px-3 py-2 border rounded"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Business name"
        />
        <button
          type="submit"
          disabled={!businessName.trim()}
          className={`px-4 py-2 rounded ${
            businessName.trim()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Create
        </button>
      </form>

      {reviews.length ? (
        <ul className="space-y-2">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p className="font-semibold">{r.business_name}</p>
                {/* Display the created_at timestamp */}
                {r.created_at?.seconds && (
                  <p className="text-xs text-gray-500">
                    {new Date(r.created_at.seconds * 1000).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteRequest(r.id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No requests yet.</p>
      )}
    </main>
  );
}
