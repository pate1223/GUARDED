const admin = require('../utils/firebase');
const User = require('../models/User');

/**
 * Firebase Authentication Middleware
 * Verifies Firebase ID token, detects role, and syncs user with MySQL
 */
module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization header must start with Bearer'
      });
    }

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

      const errorResponses = {
        'auth/id-token-expired': { error: 'Token expired', message: 'Please refresh your authentication token' },
        'auth/id-token-revoked': { error: 'Token revoked', message: 'Your session has been revoked. Please sign in again.' }
      };

      if (errorResponses[firebaseError.code]) {
        return res.status(401).json(errorResponses[firebaseError.code]);
      }
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authentication token is invalid or corrupted'
      });
    }

    const isAnonymous = decodedToken.provider_id === 'anonymous';

    // Admin emails list (customize as needed)
    const adminEmails = [
      'sajwanaayush12@gmail.com',
      'qwerty@gmail.com'
      // add more admin emails here
    ];

    // Extract and validate user info
    let { uid, email } = decodedToken;
    let displayName = null;

    try {
      const userRecord = await admin.auth().getUser(uid);
      displayName = userRecord.displayName || null;
      if (!email && userRecord.email) email = userRecord.email;
      console.log('Firebase displayName:', displayName);
      console.log('Firebase email:', email || 'N/A');
    } catch (err) {
      console.warn('Could not fetch user record from Firebase:', err.message);
    }

    // Determine role
    let role = 'user';
    if (isAnonymous) role = 'guest';
    else if (email && adminEmails.includes(email.toLowerCase())) role = 'admin';

    console.log(`User role determination:`, {
      email,
      displayName,
      isAnonymous,
      role,
      adminMatch: email ? adminEmails.includes(email.toLowerCase()) : false
    });

    // Sync user with database
    let dbUser;
    try {
      dbUser = await User.createOrUpdateUser(uid, email || `guest_${uid}`, role, displayName);
      console.log('✅ Synced user in database:', {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        user_id: dbUser.user_id
      });
    } catch (dbError) {
      console.error('Database sync failed:', dbError.message);
      return res.status(500).json({
        error: 'Database sync failed',
        message: 'Failed to sync user with database'
      });
    }

    // Attach user info to request
    req.user = {
      uid,
      email: email || `guest_${uid}`,
      dbUser: {
        id: dbUser.id,
        user_id: dbUser.user_id,
        email: dbUser.email,
        role: dbUser.role,
        firebase_uid: dbUser.firebase_uid,
        created_at: dbUser.created_at,
        updated_at: dbUser.updated_at
      },
      isAnonymous
    };

    console.log(`✅ User authenticated: ${req.user.email} (${dbUser.role})`);
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during authentication'
    });
  }
};

/**
 * Optional Authentication Middleware
 * Allows both authenticated and guest users to proceed
 */
module.exports.optional = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = { uid: null, email: null, dbUser: null, isAnonymous: true };
      return next();
    }

    const idToken = authHeader.split(' ')[1];
    if (!idToken) {
      req.user = { uid: null, email: null, dbUser: null, isAnonymous: true };
      return next();
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const isAnonymous = decodedToken.provider_id === 'anonymous';

      const adminEmails = [
        'sajwanaayush12@gmail.com',
        'qwerty@gmail.com'
      ];

      let { uid, email } = decodedToken;
      let displayName = null;
      try {
        const userRecord = await admin.auth().getUser(uid);
        displayName = userRecord.displayName || null;
        if (!email && userRecord.email) email = userRecord.email;
      } catch (_) {}

      let role = 'user';
      if (isAnonymous) role = 'guest';
      else if (email && adminEmails.includes(email.toLowerCase())) role = 'admin';

      const dbUser = await User.createOrUpdateUser(uid, email || `guest_${uid}`, role, displayName);

      req.user = {
        uid,
        email: email || `guest_${uid}`,
        dbUser: {
          id: dbUser.id,
          user_id: dbUser.user_id,
          email: dbUser.email,
          role: dbUser.role,
          firebase_uid: dbUser.firebase_uid,
          created_at: dbUser.created_at,
          updated_at: dbUser.updated_at
        },
        isAnonymous
      };
    } catch {
      // Continue as guest if verification fails
      req.user = { uid: null, email: null, dbUser: null, isAnonymous: true };
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = { uid: null, email: null, dbUser: null, isAnonymous: true };
    next();
  }
};
