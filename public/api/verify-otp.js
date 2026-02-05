// Mock API endpoint for verifying OTP
// In production, this would be a proper backend endpoint with Firebase Admin SDK

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin (in production, use proper service account)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      // Add your Firebase service account credentials here
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ 
      success: false, 
      message: 'Phone number and OTP are required' 
    });
  }

  // Mock OTP verification (in production, verify with MSG91)
  if (otp === '123456' || otp === '000000') {
    try {
      // Create custom token for Firebase Auth
      const auth = getAuth();
      const uid = phone.replace('+', '').replace(/\D/g, ''); // Use phone as UID
      
      const customToken = await auth.createCustomToken(uid, {
        phone: phone
      });

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        customToken,
        user: {
          uid,
          phone
        }
      });
    } catch (error) {
      console.error('Error creating custom token:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create authentication token'
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });
  }
}