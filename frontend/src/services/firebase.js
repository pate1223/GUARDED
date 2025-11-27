import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

// ===============================
// Firebase CONFIG + STATE
// ===============================
let firebaseConfig = null;
let app = null;
let auth = null;

// ===============================
// INITIALIZE FIREBASE
// ===============================
export const initializeFirebase = async () => {
  try {
    if (app && auth) return { app, auth };

    // Fetch Firebase config from backend
    const response = await fetch("/api/config");
    const config = await response.json();

    firebaseConfig = config.firebaseConfig;

    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    console.log("✅ Firebase initialized successfully");
    return { app, auth };
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    throw error;
  }
};

// ===============================
// GET AUTH INSTANCE
// ===============================
export const getFirebaseAuth = () => {
  if (!auth) {
    throw new Error("Firebase not initialized. Call initializeFirebase() first.");
  }
  return auth;
};

// ===============================
// GOOGLE SIGN-IN
// ===============================
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
    console.error("Google sign-in error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// FACEBOOK SIGN-IN
// ===============================
export const signInWithFacebook = async () => {
  try {
    const { auth } = await initializeFirebase();
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Facebook login error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// EMAIL/PASSWORD LOGIN
// ===============================
export const signInWithEmail = async (email, password) => {
  try {
    const { auth } = await initializeFirebase();
    const result = await signInWithEmailAndPassword(auth, email, password);

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Email sign-in error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// EMAIL/PASSWORD SIGNUP
// ===============================
export const signUpWithEmail = async (email, password, displayName = null) => {
  try {
    const { auth } = await initializeFirebase();
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Set optional display name
    if (displayName) {
      try {
        await updateProfile(result.user, {
          displayName: displayName.trim()
        });
        console.log("Firebase displayName set to:", displayName);
      } catch (e) {
        console.warn("Failed to set Firebase displayName:", e);
      }
    }

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Email sign-up error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// SIGN OUT
// ===============================
export const signOutUser = async () => {
  try {
    const { auth } = await initializeFirebase();
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign-out error:", error);
    return { success: false, error: error.message };
  }
};

// ===============================
// GET CURRENT USER
// ===============================
export const getCurrentUser = () => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

// ===============================
// AUTH STATE LISTENER
// ===============================
export const onAuthStateChanged = (callback) => {
  const auth = getFirebaseAuth();
  return auth.onAuthStateChanged(callback);
};

// Export auth for direct use if needed
export { auth };
