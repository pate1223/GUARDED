import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

let firebaseConfig = null;
let app = null;
let auth = null;

/**
 * Initialize Firebase using backend config
 */
export const initializeFirebase = async () => {
  try {
    if (app && auth) return { app, auth };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/config`
    );
    const config = await response.json();
    firebaseConfig = config.firebaseConfig;

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('✅ Firebase initialized successfully');

    return { app, auth };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

/**
 * Get Firebase Auth instance safely
 */
export const getFirebaseAuth = () => {
  if (!auth) throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  return auth;
};

/**
 * Google Sign-In
 */
export const signInWithGoogle = async () => {
  try {
    const { auth } = await initializeFirebase();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user, credential: result.credential };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Facebook Sign-In
 */
export const signInWithFacebook = async () => {
  try {
    const { auth } = await initializeFirebase();
    const provider = new FacebookAuthProvider();
    provider.addScope('public_profile'); // minimal required scope

    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user, credential: result.credential };
  } catch (error) {
    console.error('Facebook sign-in error:', error);

    // Friendly, contextual error messages
    let message = error.message;
    if (error.code === 'auth/account-exists-with-different-credential')
      message = 'An account already exists with this email. Try another login method.';
    else if (error.code === 'auth/popup-closed-by-user')
      message = 'Login popup was closed. Please try again.';
    else if (error.message?.includes('Invalid Scopes'))
      message = 'Facebook authentication setup error. Check app configuration.';

    return { success: false, error: message };
  }
};

/**
 * Email + Password Sign-In
 */
export const signInWithEmail = async (email, password) => {
  try {
    const { auth } = await initializeFirebase();
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Email sign-in error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email + Password Sign-Up (with optional display name)
 */
export const signUpWithEmail = async (email, password, displayName = null) => {
  try {
    const { auth } = await initializeFirebase();
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      try {
        await updateProfile(result.user, { displayName });
        console.log('🪪 Firebase displayName set to:', displayName);
      } catch (profileError) {
        console.warn('⚠️ Failed to set displayName:', profileError);
      }
    }

    return { success: true, user: result.user };
  } catch (error) {
    console.error('Email sign-up error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign Out User
 */
export const signOutUser = async () => {
  try {
    const { auth } = await initializeFirebase();
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign-out error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get Current Firebase User
 */
export const getCurrentUser = () => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

/**
 * Auth State Listener
 */
export const onAuthStateChanged = (callback) => {
  const auth = getFirebaseAuth();
  return auth.onAuthStateChanged(callback);
};
