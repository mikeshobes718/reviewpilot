// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbvy5lC1yczSa8HMmicpEYFFZz0tbHZ5s",
  authDomain: "reviewpilot2.firebaseapp.com",
  projectId: "reviewpilot2",
  storageBucket: "reviewpilot2.firebasestorage.app",
  messagingSenderId: "577051575061",
  appId: "1:577051575061:web:16dfd593d88bbdc5351f1c",
  measurementId: "G-JZ78N8KWSY"
};

// Initialize Firebase
// We check if the app is already initialized to prevent errors during hot-reloading in development.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export the Firebase services that your components will need
const auth = getAuth(app);
const db = getFirestore(app);

// Set authentication persistence to local storage
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Auth persistence error:', error);
});

export { app, auth, db };

