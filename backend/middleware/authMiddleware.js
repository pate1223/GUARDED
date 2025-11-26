const admin = require('../utils/firebase');
const User = require('../models/User');

/**
 * Firebase Authentication Middleware
 * Verifies Firebase ID token and syncs user with MySQL database
 */
module.exports = async function (req, res, next) {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Authorization header must start with Bearer'
      });
    }

    // Extract token
    const idToken = authHeader.split(' ')[1];
    if (!idToken) {
      return res.status(401).json({ 
        error: 'Invalid token format',
        message: 'Token must be provided after Bearer'
      });
    }

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (firebaseError) {
      console.error('Firebase token verification failed:', firebaseError.message);
      
      if (firebaseError.code === 'auth/id-token-expired') {
        return res.status(401).json({ 
          error: 'Token expired',
          message: 'Please refresh your authentication token'
        });
      } else if (firebaseError.code === 'auth/id-token-revoked') {
        return res.status(401).json({ 
          error: 'Token revoked',
          message: 'Your session has been revoked. Please sign in again.'
        });
      } else {
        return res.status(401).json({ 
          error: 'Invalid token',
          message: 'Authentication token is invalid or corrupted'
        });
      }
    }

    // Check if user is anonymous (guest)
    const isAnonymous = decodedToken.provider_id === 'anonymous';
    
    // Determine role based on Firebase auth
    let role = 'user';
    if (isAnonymous) {
      role = 'guest';
    }

    // Extract user information
    const { uid, email } = decodedToken;
    
    // Get full user record from Firebase to access displayName
    let displayName = null;
    try {
      const userRecord = await admin.auth().getUser(uid);
      displayName = userRecord.displayName || null;
    } catch (error) {
      // Continue without displayName
    }
    
    // Sync user with MySQL database
    let dbUser;
    try {
      dbUser = await User.createOrUpdateUser(uid, email || `guest_${uid}`, role, displayName);
    } catch (dbError) {
      console.error('Database sync failed:', dbError.message);
      return res.status(500).json({ 
        error: 'Database sync failed',
        message: 'Failed to sync user with database'
      });
    }

    // Attach user information to request
    req.user = {
      uid,
      email: email || `guest_${uid}`,
      dbUser: {
        id: dbUser.id,
        role: dbUser.role,
        firebase_uid: dbUser.firebase_uid,
        user_id: dbUser.user_id,
        created_at: dbUser.created_at,
        updated_at: dbUser.updated_at
      },
      isAnonymous
    };

    // Log successful authentication (for debugging)
    console.log(`✅ User authenticated: ${email || `guest_${uid}`} (${dbUser.role})`);

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: 'Internal server error during authentication'
    });
  }
};

/**
 * Optional Authentication Middleware
 * Allows requests to proceed with or without authentication
 */
module.exports.optional = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue as guest
      req.user = {
        uid: null,
        email: null,
        dbUser: null,
        isAnonymous: true
      };
      return next();
    }

    // Try to authenticate, but don't fail if it doesn't work
    const idToken = authHeader.split(' ')[1];
    if (!idToken) {
      req.user = {
        uid: null,
        email: null,
        dbUser: null,
        isAnonymous: true
      };
      return next();
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const isAnonymous = decodedToken.provider_id === 'anonymous';
      const role = isAnonymous ? 'guest' : 'user';
      const { uid, email } = decodedToken;
      
      // Get displayName from Firebase
      let displayName = null;
      try {
        const userRecord = await admin.auth().getUser(uid);
        displayName = userRecord.displayName || null;
      } catch (error) {
        // Continue without displayName
      }
      
      const dbUser = await User.createOrUpdateUser(uid, email || `guest_${uid}`, role, displayName);
      
      req.user = {
        uid,
        email: email || `guest_${uid}`,
        dbUser: {
          id: dbUser.id,
          role: dbUser.role,
          firebase_uid: dbUser.firebase_uid,
          user_id: dbUser.user_id,
          created_at: dbUser.created_at,
          updated_at: dbUser.updated_at
        },
        isAnonymous
      };
    } catch (error) {
      // Authentication failed, continue as guest
      req.user = {
        uid: null,
        email: null,
        dbUser: null,
        isAnonymous: true
      };
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    // Continue as guest on any error
    req.user = {
      uid: null,
      email: null,
      dbUser: null,
      isAnonymous: true
    };
    next();
  }
};