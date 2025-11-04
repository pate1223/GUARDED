import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
// Firebase configuration will be fetched from backend
let firebaseConfig = null;
let app = null;
let auth = null;

// Initialize Firebase with config from backend
export const initializeFirebase = async () => {
  try {
    if (app && auth) {
      return { app, auth };
    }

    // Fetch Firebase config from backend
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/config`);
    const config = await response.json();
    
    firebaseConfig = config.firebaseConfig;
    
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    console.log('✅ Firebase initialized successfully');
    return { app, auth };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

// Get Firebase auth instance
export const getFirebaseAuth = () => {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
};

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const { auth } = await initializeFirebase();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return {
      success: true,
      user: result.user,
      credential: result.credential
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

//facebook sign in
export const signInWithFacebook = async () => {
  const auth = getAuth();
  const provider = new FacebookAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Facebook login error:", error);
    return { success: false, error: error.message };
  }
};

// Email/Password Sign-In
export const signInWithEmail = async (email, password) => {
  try {
    const { auth } = await initializeFirebase();
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.error('Email sign-in error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Email/Password Sign-Up
export const signUpWithEmail = async (email, password) => {
  try {
    const { auth } = await initializeFirebase();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.error('Email sign-up error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Sign Out
export const signOutUser = async () => {
  try {
    const { auth } = await initializeFirebase();
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign-out error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get current user
export const getCurrentUser = () => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChanged = (callback) => {
  const auth = getFirebaseAuth();
  return auth.onAuthStateChanged(callback);
};
