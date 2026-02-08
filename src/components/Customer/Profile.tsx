import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { User, Phone, Home, MapPin, LogOut, CreditCard as Edit2, Save, X } from 'lucide-react';
import Toast, { ToastProps } from '../UI/Toast';
import Logo from '../UI/Logo';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: ''
  });
  
  const [originalData, setOriginalData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: ''
  });

  // Prefill form with existing user data
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        pincode: user.pincode || ''
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setToast({
        message: 'Failed to logout. Please try again.',
        type: 'error',
        onClose: () => setToast(null)
      });
    }
  };

  const hasChanges = () => {
    return Object.keys(formData).some(key => 
      formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData]
    );
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!hasChanges()) {
      setToast({
        message: 'No changes to save',
        type: 'info',
        onClose: () => setToast(null)
      });
      setIsEditing(false);
      return;
    }

    if (!formData.name.trim()) {
      setToast({
        message: 'Name is required',
        type: 'error',
        onClose: () => setToast(null)
      });
      return;
    }

    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone)) {
      setToast({
        message: 'Please enter a valid 10-digit mobile number',
        type: 'error',
        onClose: () => setToast(null)
      });
      return;
    }

    if (!formData.address.trim()) {
      setToast({
        message: 'Address is required',
        type: 'error',
        onClose: () => setToast(null)
      });
      return;
    }

    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      setToast({
        message: 'Please enter a valid 6-digit pincode',
        type: 'error',
        onClose: () => setToast(null)
      });
      return;
    }

    setLoading(true);
    try {
      const updates: any = {};
      Object.keys(formData).forEach(key => {
        const formKey = key as keyof typeof formData;
        if (formData[formKey] !== originalData[formKey]) {
          updates[key] = formData[formKey].trim();
        }
      });

      updates.updatedAt = new Date();

      await updateDoc(doc(db, 'users', user.id), updates);

      setOriginalData({ ...formData });
      setToast({
        message: 'Profile updated successfully!',
        type: 'success',
        onClose: () => setToast(null)
      });
      setIsEditing(false);

      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Profile update error:', error);
      setToast({
        message: 'Failed to update profile. Please try again.',
        type: 'error',
        onClose: () => setToast(null)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {toast && <Toast {...toast} />}

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Logo size="lg" className="mb-4" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center">My Profile</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading || !hasChanges()}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : hasChanges() ? 'Save Changes' : 'No Changes'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-xl">{user.name}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Mobile Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                ) : (
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-xl">{user.phone}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Home className="w-4 h-4 mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                    placeholder="Enter your complete address"
                  />
                ) : (
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-xl">{user.address}</p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Pincode
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    placeholder="380001"
                    maxLength={6}
                  />
                ) : (
                  <p className="text-gray-900 text-lg font-medium bg-gray-50 px-4 py-3 rounded-xl">{user.pincode}</p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 md:px-8 py-6 bg-gray-50 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 w-full px-6 py-4 border-2 border-red-600 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
