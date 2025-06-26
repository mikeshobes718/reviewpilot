"use client";

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function AuthForm() {
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(auth.currentUser);

  // Listen for auth state changes
  auth.onAuthStateChanged((u) => setUser(u));

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <button onClick={handleSignOut}>
        Sign out ({user.email})
      </button>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={handleSignIn}>Sign in</button>
    </div>
  );
}
