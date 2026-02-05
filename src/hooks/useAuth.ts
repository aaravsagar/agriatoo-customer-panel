import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { ADMIN_CREDENTIALS, USER_ROLES } from '../config/constants';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // ✅ Admin (hardcoded)
        if (firebaseUser.email === ADMIN_CREDENTIALS.email) {
          setUser({
            id: 'admin',
            email: ADMIN_CREDENTIALS.email,
            role: USER_ROLES.ADMIN,
            name: 'Administrator',
            phone: '+91-9999999999',
            createdAt: new Date(),
            isActive: true,
          });
          setLoading(false);
          return;
        }

        // ✅ Fetch Firestore user
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: data.role || USER_ROLES.FARMER, // fallback role
            name: data.name || 'User',
            phone: data.phone || '',
            address: data.address || '',
            pincode: data.pincode || '',
            createdAt: data.createdAt?.toDate?.() || new Date(),
            isActive: data.isActive ?? true,
          });
        } else {
          // User document doesn't exist, they need to complete profile
          setUser(null);
        }
      } catch (err) {
        console.error('Auth error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
