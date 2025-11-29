import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeFirebase, onAuthStateChanged, getCurrentUser } from '../services/firebase';
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
    let unsubscribe = null;

    const initAuth = async () => {
      try {
        // Initialize Firebase once
        await initializeFirebase();
        setInitialized(true);

        unsubscribe = onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);

            try {
              // Always refresh token for backend accuracy
              const token = await firebaseUser.getIdToken(true);
              localStorage.setItem('firebase_token', token);

              console.log("🔑 Token refreshed:", token.substring(0, 15) + "...");

              // Verify against backend
              const result = await apiService.verifyUser(token);

              if (result.success && result.user) {
                setUserInfo(result.user);
              } else {
                console.warn("⚠️ Backend verification failed:", result.error);
                setUserInfo(null);
              }
            } catch (err) {
              console.error("❌ Error verifying user with backend:", err);
              setUserInfo(null);
            }
          } else {
            // User is signed out
            setUser(null);
            setUserInfo(null);
            localStorage.removeItem('firebase_token');
          }

          setLoading(false);
        });

      } catch (err) {
        console.error("🔥 Auth initialization error:", err);
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

  useEffect(() => {
    console.log("🧭 Auth State Updated:", {
      firebaseUser: user?.email || null,
      backendRole: userInfo?.role || null,
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
