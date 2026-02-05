import { auth, db } from '../config/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

export interface OTPResponse {
  success: boolean;
  message: string;
  requestId?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  customToken?: string;
  user?: {
    uid: string;
    phone: string;
  };
}

export const sendOTP = async (phone: string): Promise<OTPResponse> => {
  try {
    const response = await axios.post('/api/send-otp', { phone });
    return response.data;
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send OTP'
    };
  }
};

export const verifyOTP = async (phone: string, otp: string): Promise<VerifyOTPResponse> => {
  try {
    const response = await axios.post('/api/verify-otp', { phone, otp });
    
    if (response.data.success && response.data.customToken) {
      // Sign in with custom token
      await signInWithCustomToken(auth, response.data.customToken);
      
      // Create/update user document
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            phone,
            createdAt: serverTimestamp(),
            isActive: true
          });
        }
      }
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to verify OTP'
    };
  }
};

export const checkAuthState = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};