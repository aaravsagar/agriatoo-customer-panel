import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { User, Phone, Home, MapPin, LogOut, Edit2, Save, X } from 'lucide-react';
import Toast, { ToastProps } from '../UI/Toast';
import Logo from '../UI/Logo';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    pincode: user?.pincode || ''
  });

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

  const handleSaveProfile = async () => {
    if (!user) return;

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
      await updateDoc(doc(db, 'users', user.id), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        pincode: formData.pincode.trim()
      });

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
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      pincode: user?.pincode || ''
    });
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{user.name}</p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{user.phone}</p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your complete address"
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{user.address}</p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="380001"
                    maxLength={6}
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{user.pincode}</p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 md:px-8 py-4 bg-gray-50 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
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
