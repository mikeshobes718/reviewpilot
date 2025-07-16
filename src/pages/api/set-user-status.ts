// src/pages/api/set-user-status.ts

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
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // --- SECURITY CHECK: Verify the person making this request is an admin ---
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).send('Authentication required.');
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (decodedToken.admin !== true) {
      return res.status(403).send('Forbidden: User is not an admin.');
    }

    // --- LOGIC: Get the target user and the desired status from the request ---
    const { targetUid, disabled } = req.body;

    if (!targetUid || typeof disabled !== 'boolean') {
      return res.status(400).json({ error: 'Missing targetUid or disabled status.' });
    }
    
    // Prevent an admin from disabling their own account
    if (targetUid === decodedToken.uid) {
        return res.status(400).json({ error: "Admins cannot disable their own account."})
    }

    // Update the user in Firebase Authentication
    await adminAuth.updateUser(targetUid, {
      disabled: disabled,
    });

    res.status(200).json({ success: true, message: `User ${targetUid} has been ${disabled ? 'disabled' : 'enabled'}.` });

  } catch (error: any) {
    console.error('Error setting user status:', error);
    res.status(500).send('Internal Server Error');
  }
}

