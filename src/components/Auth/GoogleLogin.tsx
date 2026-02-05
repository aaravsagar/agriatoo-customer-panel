import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../../config/firebase';
import { User } from '../../types';
import { USER_ROLES } from '../../config/constants';
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
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        navigate('/');
      } else {
        setProfileData({
          name: user.displayName || '',
          phone: '',
          address: '',
          pincode: ''
        });
        setShowProfileForm(true);
      }
    } catch {
      setError('Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  // Simple API validation (India Post)
  const isPincodeValid = async (pincode: string): Promise<boolean> => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      return data[0]?.Status === 'Success';
    } catch {
      return false;
    }
  };

  // Single Gujarat validator
  const validateGujaratPincode = async (pincode: string): Promise<boolean> => {
    if (!/^\d{6}$/.test(pincode)) return false;

    const prefix = pincode.substring(0, 2);
    if (!['36', '38', '39'].includes(prefix)) return false;

    return await isPincodeValid(pincode);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!profileData.name.trim()) return setError('Full name required');
      if (!/^[6-9]\d{9}$/.test(profileData.phone)) return setError('Invalid mobile');
      if (!profileData.address.trim()) return setError('Address required');

      const isValid = await validateGujaratPincode(profileData.pincode);

      if (!isValid) {
        setError('Enter valid Gujarat pincode');
        return;
      }

      const user = auth.currentUser;
      if (!user) return;

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
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (showProfileForm) {
    return (
      <div className="min-h-screen bg-green-500 flex items-center justify-center p-4">
        <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
          <input placeholder="Name" value={profileData.name}
            onChange={e => setProfileData({ ...profileData, name: e.target.value })} />

          <input placeholder="Phone" value={profileData.phone}
            onChange={e => setProfileData({ ...profileData, phone: e.target.value })} />

          <textarea placeholder="Address" value={profileData.address}
            onChange={e => setProfileData({ ...profileData, address: e.target.value })} />

          <input placeholder="Pincode" value={profileData.pincode}
            onChange={e => setProfileData({ ...profileData, pincode: e.target.value })} />

          {error && <p className="text-red-500">{error}</p>}

          <button type="submit">
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center">
      <button onClick={handleGoogleLogin}>
        {loading ? 'Loading...' : 'Login With Google'}
      </button>
    </div>
  );
};

export default GoogleLogin;
