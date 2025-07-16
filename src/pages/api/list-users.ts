// src/pages/api/list-users.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount: ServiceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminAuth = getAuth();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // --- SECURITY CHECK ---
    // Get the ID token from the Authorization header.
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).send('Authentication required.');
    }

    // Verify the token and check for the admin custom claim.
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (decodedToken.admin !== true) {
      return res.status(403).send('Forbidden: User is not an admin.');
    }

    // --- LOGIC ---
    // If the user is a verified admin, proceed to list all users.
    const listUsersResult = await adminAuth.listUsers(1000); // Get up to 1000 users
    
    // We only need specific fields for the frontend.
    const users = listUsersResult.users.map((userRecord) => {
      // Check for the admin claim on each user
      const isAdmin = userRecord.customClaims?.admin === true;
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        disabled: userRecord.disabled,
        createdAt: userRecord.metadata.creationTime,
        lastSignIn: userRecord.metadata.lastSignInTime,
        isAdmin: isAdmin,
      };
    });

    res.status(200).json({ users });

  } catch (error: any) {
    console.error('Error listing users:', error);
    res.status(500).send('Internal Server Error');
  }
}

