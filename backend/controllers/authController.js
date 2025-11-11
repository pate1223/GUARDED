const db = require('../models/db');
const User = require('../models/User');
const AdminLog = require('../models/AdminLog');
const admin = require('../utils/firebase');

/**
 * Authentication Controller
 * Handles user authentication, profile management, and admin operations
 */

/**
 * Get current user profile
 * GET /api/users/profile
 */
exports.getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.dbUser) {
      return res.status(401).json({
        error: 'Not authenticated',
        message: 'User must be logged in to view profile'
      });
    }

    console.log('Getting profile for user ID:', req.user.dbUser.id);
    const user = await User.getById(req.user.dbUser.id);
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found in database'
      });
    }

    console.log('User found:', { id: user.id, email: user.email, role: user.role });
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      user: userProfile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: error.message
    });
  }
};

/**
 * Update user profile
 * PUT /api/users/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.dbUser) {
      return res.status(401).json({
        error: 'Not authenticated',
        message: 'User must be logged in to update profile'
      });
    }

    const { email, ...updateData } = req.body;
    const allowedUpdates = ['display_name', 'bio', 'preferences'];
    const filteredUpdates = {};

    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updateData[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({
        error: 'No valid updates',
        message: 'No valid fields provided for update'
      });
    }

    const updateQuery = `
      UPDATE users 
      SET ${Object.keys(filteredUpdates).map(key => `${key} = ?`).join(', ')}, updated_at = NOW() 
      WHERE id = ?
    `;
    const updateValues = [...Object.values(filteredUpdates), req.user.dbUser.id];

    await db.query(updateQuery, updateValues);
    const updatedUser = await User.getById(req.user.dbUser.id);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
};

/**
 * Create anonymous guest user
 * POST /api/users/guest
 */
exports.createGuestUser = async (req, res) => {
  try {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 5);
    const guestEmail = `guest${timestamp}${randomId}@example.com`;

    const userRecord = await admin.auth().createUser({
      email: guestEmail,
      password: 'temp123456',
      displayName: 'Guest User',
      emailVerified: false
    });

    const guestUser = await User.createOrUpdateUser(userRecord.uid, guestEmail, 'guest');
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({
      success: true,
      message: 'Guest user created successfully',
      user: {
        uid: userRecord.uid,
        email: guestEmail,
        role: 'guest',
        customToken
      }
    });
  } catch (error) {
    console.error('Create guest user error:', error);
    res.status(500).json({
      error: 'Failed to create guest user',
      message: error.message
    });
  }
};

/**
 * Convert guest to registered user
 * POST /api/users/convert-guest
 */
exports.convertGuestToUser = async (req, res) => {
  try {
    if (!req.user || !req.user.dbUser) {
      return res.status(401).json({
        error: 'Not authenticated',
        message: 'User must be logged in'
      });
    }

    if (req.user.dbUser.role !== 'guest') {
      return res.status(400).json({
        error: 'Invalid operation',
        message: 'Only guest users can be converted to registered users'
      });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }

    await admin.auth().updateUser(req.user.uid, { email, password, emailVerified: false });
    await User.updateRole(req.user.dbUser.id, 'user', req.user.dbUser.id);

    res.json({
      success: true,
      message: 'Guest user converted to registered user successfully'
    });
  } catch (error) {
    console.error('Convert guest error:', error);
    res.status(500).json({
      error: 'Failed to convert guest user',
      message: error.message
    });
  }
};

/**
 * Verify Firebase token and sync user
 * POST /api/users/verify-token
 */
exports.verifyToken = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Missing token', message: 'ID token is required' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    let { uid, email } = decodedToken;
    let displayName = null;

    try {
      const userRecord = await admin.auth().getUser(uid);
      displayName = userRecord.displayName || null;
      if (!email && userRecord.email) email = userRecord.email;
    } catch {}

    const isAnonymous = decodedToken.provider_id === 'anonymous';
    const role = isAnonymous ? 'guest' : 'user';

    const dbUser = await User.createOrUpdateUser(uid, email || `guest_${uid}`, role, displayName);

    res.json({
      success: true,
      message: 'Token verified successfully',
      user: {
        uid,
        email: email || `guest_${uid}`,
        role: dbUser.role,
        user_id: dbUser.user_id,
        isAnonymous
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);

    const errors = {
      'auth/id-token-expired': 'Token expired',
      'auth/id-token-revoked': 'Token revoked'
    };

    if (errors[error.code]) {
      return res.status(401).json({
        error: errors[error.code],
        message:
          error.code === 'auth/id-token-revoked'
            ? 'Your session has been revoked. Please sign in again.'
            : 'Please refresh your authentication token'
      });
    }

    return res.status(401).json({
      error: 'Invalid token',
      message: 'Authentication token is invalid or corrupted'
    });
  }
};

/**
 * Register new user
 * POST /api/users/register
 */
exports.registerUser = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { firebase_uid, email, role, user_id, name } = req.body;

    if (!firebase_uid || !email || !role) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'firebase_uid, email, and role are required'
      });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role',
        message: 'Role must be either "user" or "admin"'
      });
    }

    const newUser = await User.createOrUpdateUser(firebase_uid, email, role, name || user_id);

    res.status(201).json({
      success: true,
      message: 'User registered/updated successfully',
      user: {
        id: newUser.id,
        firebase_uid: newUser.firebase_uid,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at
      }
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message
    });
  }
};
