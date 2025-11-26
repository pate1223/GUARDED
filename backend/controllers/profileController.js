const db = require('../models/db');
const admin = require('firebase-admin');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;
    const { name, language } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // Update database - only update name (user_id column)
    // Note: We're not updating language or updated_at columns as they may not exist in all databases
    try {
      await db.query(`
        UPDATE users
        SET user_id = ?
        WHERE id = ?
      `, [name.trim(), userId]);
    } catch (dbError) {
      // If there's an error, it might be because user_id column doesn't exist
      // Let's provide a more helpful error message
      if (dbError.message.includes('Unknown column')) {
        throw new Error(`Database column error: ${dbError.message}. Please ensure the user_id column exists in the users table.`);
      }
      throw dbError;
    }

    // Also update Firebase display name if provided
    if (name && req.user.uid) {
      try {
        await admin.auth().updateUser(req.user.uid, {
          displayName: name.trim()
        });
      } catch (firebaseError) {
        console.error('Firebase update error:', firebaseError);
        // Continue even if Firebase update fails
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: { name: name.trim() }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email);

    // In production, send email here
    // For now, return the link
    res.json({
      success: true,
      message: 'Password reset email sent',
      resetLink: resetLink // Remove in production
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send password reset email',
      error: error.message
    });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;
    const firebaseUid = req.user.uid;

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Delete user progress
      await connection.query('DELETE FROM user_progress WHERE user_id = ?', [userId]);

      // Delete video progress
      await connection.query('DELETE FROM video_progress WHERE user_id = ?', [userId]);

      // Delete user badges
      await connection.query('DELETE FROM user_badges WHERE user_id = ?', [userId]);

      // Delete user from database
      await connection.query('DELETE FROM users WHERE id = ?', [userId]);

      // Delete from Firebase
      await admin.auth().deleteUser(firebaseUid);

      await connection.commit();
      connection.release();

      res.json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
};

// Update user photo
exports.updatePhoto = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;
    const { photoUrl } = req.body;

    await db.query(`
      UPDATE users
      SET photo_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [photoUrl, userId]);

    // Also update Firebase photo URL
    if (req.user.uid) {
      try {
        await admin.auth().updateUser(req.user.uid, {
          photoURL: photoUrl
        });
      } catch (firebaseError) {
        console.error('Firebase photo update error:', firebaseError);
      }
    }

    res.json({
      success: true,
      message: 'Photo updated successfully',
      photoUrl: photoUrl
    });
  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update photo',
      error: error.message
    });
  }
};