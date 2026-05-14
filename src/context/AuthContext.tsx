"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/api';

interface AuthContextType {
  user: User | null; // Firebase User
  dbUser: any | null; // MongoDB User
  loading: boolean;
  refreshDbUser: () => Promise<void>;
  logout: () => Promise<void>;
  isAdminSession: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  dbUser: null, 
  loading: true,
  refreshDbUser: async () => {},
  logout: async () => {},
  isAdminSession: false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const res = await api.get('/users/profile');
          setDbUser(res.data);
        } catch (error) {
          // Profile doesn't exist yet in backend.
          // Only auto-create for OAuth users (Google) who already have displayName.
          // For email/password signups, the signup page handles profile creation
          // with the correct name from the form.
          if (firebaseUser.email && firebaseUser.displayName) {
            try {
               const createRes = await api.post('/users/profile', {
                  email: firebaseUser.email,
                  name: firebaseUser.displayName,
                  profilePicture: firebaseUser.photoURL || '',
               });
               setDbUser(createRes.data);
            } catch (e) {
               console.error("Error creating user profile:", e);
            }
          }
        }
        setLoading(false);
      } else {
        // No Firebase user, check for Admin session in localStorage
        const adminData = localStorage.getItem('adminUser');
        if (adminData) {
           try {
              const parsed = JSON.parse(adminData);
              const token = parsed.token || localStorage.getItem('token');
              if (token) {
                const res = await api.get('/users/profile');
                setDbUser(res.data);
              } else {
                setDbUser(null);
              }
           } catch (e) {
              console.error("❌ Admin session validation failed:", e);
              localStorage.removeItem('adminUser');
              localStorage.removeItem('token');
              setDbUser(null);
           }
        } else {
          setDbUser(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshDbUser = async () => {
    try {
      const res = await api.get('/users/profile');
      setDbUser(res.data);
    } catch (error: any) {
      console.error("Error refreshing user profile:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
         setDbUser(null);
         localStorage.removeItem('adminUser');
         localStorage.removeItem('token');
      }
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('adminUser');
      setUser(null);
      setDbUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const isAdminSession = dbUser?.role === 'admin' || dbUser?.role === 'superadmin' || dbUser?.role === 'employee_admin';

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, refreshDbUser, logout, isAdminSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
