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
  const [user, setUser] = useState(null);         // Firebase user
  const [userInfo, setUserInfo] = useState(null); // Backend user (role, id, etc.)
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;

    const initAuth = async () => {
      try {
        // Initialize Firebase once
        await initializeFirebase();
        setInitialized(true);

        // Listen to login/logout events
        unsubscribe = onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);

            try {
              // Always refresh token for backend
              const token = await firebaseUser.getIdToken(true);
              localStorage.setItem('firebase_token', token);

              console.log(
                '🔑 Firebase token refreshed:',
                token.substring(0, 15) + '...'
              );

              // Verify with backend
              const result = await apiService.verifyUser(token);

              if (result.success && result.user) {
                setUserInfo(result.user);
              } else {
                console.warn('⚠️ Backend verification failed:', result.error);
                setUserInfo(null);
              }
            } catch (err) {
              console.error('❌ Error verifying user with backend:', err);
              setUserInfo(null);
            }
          } else {
            // No user / logged out
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

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Derived roles
  const isAdmin = userInfo?.role === 'admin';
  const isUser = userInfo?.role === 'user';
  const isGuest = userInfo?.role === 'guest';
  const isAuthenticated = !!user;

  // Optional: debug output (safe)
  useEffect(() => {
    console.log('🧭 Auth State Changed:', {
      firebaseUser: user?.email || null,
      backendUserRole: userInfo?.role || null,
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
