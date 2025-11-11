import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeFirebase, onAuthStateChanged } from '../services/firebase';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const initAuth = async () => {
      try {
        await initializeFirebase();
        setInitialized(true);

        // Attach listener for Firebase auth state changes
        unsubscribe = onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);
            try {
              // Refresh ID token
              const token = await firebaseUser.getIdToken(true);
              localStorage.setItem('firebase_token', token);
              console.log('🔑 Firebase token refreshed:', token.substring(0, 20) + '...');

              // Verify user on backend
              const result = await apiService.verifyUser(token);
              console.log('✅ User verification result:', result);

              if (result.success && result.user) {
                setUserInfo(result.user);
              } else {
                console.warn('⚠️ Backend verification failed:', result.error);
                setUserInfo(null);
              }
            } catch (err) {
              console.error('❌ Error fetching user info:', err);
              setUserInfo(null);
            }
          } else {
            // Handle sign-out or guest state
            setUser(null);
            setUserInfo(null);
            localStorage.removeItem('firebase_token');
          }

          setLoading(false);
        });
      } catch (err) {
        console.error('🔥 Auth initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initAuth();

    // Cleanup on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Derived roles
  const isAdmin = userInfo?.role === 'admin';
  const isUser = userInfo?.role === 'user';
  const isGuest = userInfo?.role === 'guest';
  const isAuthenticated = !!user;

  // Helpful logging (remove or toggle for production)
  useEffect(() => {
    console.log('🧭 AuthContext:', {
      email: user?.email,
      role: userInfo?.role,
      isAuthenticated,
      isAdmin,
      isUser,
      isGuest,
    });
  }, [user, userInfo]);

  const value = {
    user,
    userInfo,
    loading,
    initialized,
    error,
    isAuthenticated,
    isAdmin,
    isUser,
    isGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
