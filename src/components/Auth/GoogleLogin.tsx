import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { User } from '../../types';
import { USER_ROLES } from '../../config/constants';
import { isPincodeValid } from '../../utils/pincodeUtils';
import { Loader, User as UserIcon, MapPin, Phone, Home } from 'lucide-react';

const GoogleLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // User exists, navigate to home
        navigate('/');
      } else {
        // New user, show profile form
        setProfileData({
          name: user.displayName || '',
          phone: '',
          address: '',
          pincode: ''
        });
        setShowProfileForm(true);
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateGujaratPincode = async (pincode: string): Promise<boolean> => {
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      return false;
    }

    // Gujarat pincodes start with 36, 38, 39
    const gujaratPrefixes = ['36', '38', '39'];
    const prefix = pincode.substring(0, 2);
    
    if (!gujaratPrefixes.includes(prefix)) {
      return false;
    }

    // Validate with API
    return await isPincodeValid(pincode);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!profileData.name.trim()) {
        setError('Full name is required');
        return;
      }
      if (!profileData.phone.trim() || !/^[6-9]\d{9}$/.test(profileData.phone)) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
      if (!profileData.address.trim()) {
        setError('Full address is required');
        return;
      }
      if (!profileData.pincode.trim()) {
        setError('Pincode is required');
        return;
      }

      // Validate Gujarat pincode
      const isValidGujarat = await validateGujaratPincode(profileData.pincode);
      if (!isValidGujarat) {
        setError('Please enter a valid Gujarat pincode (starting with 36, 38, or 39)');
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        setError('Authentication error. Please try again.');
        return;
      }

      // Create user document with existing structure
      const userData: User = {
        id: user.uid,
        email: user.email || '',
        role: USER_ROLES.FARMER,
        name: profileData.name.trim(),
        phone: profileData.phone.trim(),
        address: profileData.address.trim(),
        pincode: profileData.pincode.trim(),
        createdAt: new Date(),
        isActive: true
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      
      // Navigate to home
      navigate('/');
    } catch (error: any) {
      console.error('Profile creation error:', error);
      setError('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showProfileForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">
              Please provide your details to continue
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="9876543210"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your complete address"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gujarat Pincode
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={profileData.pincode}
                  onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="380001"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only Gujarat pincodes are supported (36xxxx, 38xxxx, 39xxxx)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <span>Complete Profile</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to AGRIATOO</h1>
          <p className="text-gray-600">
            Your trusted marketplace for agricultural products in Gujarat
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-300 hover:border-green-500 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center space-x-3 shadow-md hover:shadow-lg"
        >
          {loading ? (
            <Loader className="w-6 h-6 animate-spin text-green-600" />
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Login with Google</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default GoogleLogin;