import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeFirebase, onAuthStateChanged, getCurrentUser } from '../services/firebase';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Firebase and set up auth state listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeFirebase();
        setInitialized(true);
        
        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
          if (firebaseUser) {
            setUser(firebaseUser);
            
            // Get user info from backend
            try {
              const token = await firebaseUser.getIdToken();
              localStorage.setItem('firebase_token', token);
              
              const result = await apiService.verifyUser(token);
              if (result.success) {
                setUserInfo(result.user);
              } else {
                console.error('Failed to verify user:', result.error);
                setUserInfo(null);
              }
            } catch (error) {
              console.error('Error getting user info:', error);
              setUserInfo(null);
            }
          } else {
            setUser(null);
            setUserInfo(null);
            localStorage.removeItem('firebase_token');
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    user,
    userInfo,
    loading,
    initialized,
    error,
    isAuthenticated: !!user,
    isAdmin: userInfo?.role === 'admin',
    isUser: userInfo?.role === 'user',
    isGuest: userInfo?.role === 'guest'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
