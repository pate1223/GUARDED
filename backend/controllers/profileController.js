const db = require('../models/db');
const admin = require('firebase-admin');

// ==========================
// Update user profile
// ==========================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty'
      });
    }

    // Update database (update user_id + updated_at)
    try {
      await db.query(`
        UPDATE users
        SET user_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name.trim(), userId]);
    } catch (dbError) {
      if (dbError.message.includes('Unknown column')) {
        throw new Error(
          `Database column error: ${dbError.message}. 
           Ensure the 'user_id' column exists in the users table.`
        );
      }
      throw dbError;
    }

    // Update Firebase displayName
    if (req.user.uid) {
      try {
        await admin.auth().updateUser(req.user.uid, {
          displayName: name.trim()
        });
      } catch (firebaseError) {
        console.error('Firebase update error:', firebaseError);
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


// ==========================
// Request Password Reset
// ==========================
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const resetLink = await admin.auth().generatePasswordResetLink(email);

    res.json({
      success: true,
      message: 'Password reset email sent',
      resetLink // Remove in production
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


// ==========================
// Delete Account
// ==========================
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;
    const firebaseUid = req.user.uid;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query('DELETE FROM user_progress WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM video_progress WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM user_badges WHERE user_id = ?', [userId]);
      await connection.query('DELETE FROM users WHERE id = ?', [userId]);

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


// ==========================
// Update User Photo
// ==========================
exports.updatePhoto = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;
    const { photoUrl } = req.body;

    await db.query(`
      UPDATE users
      SET photo_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [photoUrl, userId]);

    // Also update Firebase
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
      photoUrl
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
