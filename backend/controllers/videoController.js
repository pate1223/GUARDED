const db = require('../models/db');

// Save video progress
exports.saveVideoProgress = async (req, res) => {
  try {
    const { moduleId, percentage, timestamp } = req.body;
    const userId = req.user.dbUser.id;

    // Check if progress exists
    const [existing] = await db.query(`
      SELECT id FROM video_progress
      WHERE user_id = ? AND module_id = ?
    `, [userId, moduleId]);

    if (existing.length > 0) {
      // Update existing progress (only if new percentage is higher)
      await db.query(`
        UPDATE video_progress
        SET percentage = GREATEST(percentage, ?),
            last_watched = CURRENT_TIMESTAMP
        WHERE user_id = ? AND module_id = ?
      `, [percentage, userId, moduleId]);
    } else {
      // Insert new progress
      await db.query(`
        INSERT INTO video_progress (user_id, module_id, percentage, last_watched)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `, [userId, moduleId, percentage]);
    }

    res.json({
      success: true,
      message: 'Progress saved',
      percentage: percentage
    });
  } catch (error) {
    console.error('Save video progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save progress',
      error: error.message
    });
  }
};

// Get user's video progress
exports.getUserVideoProgress = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;
    const { moduleId } = req.params;

    const [progress] = await db.query(`
      SELECT percentage, last_watched
      FROM video_progress
      WHERE user_id = ? AND module_id = ?
    `, [userId, moduleId]);

    res.json({
      success: true,
      progress: progress[0] || { percentage: 0, last_watched: null }
    });
  } catch (error) {
    console.error('Get video progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress',
      error: error.message
    });
  }
};

// Get all user's video progress
exports.getAllUserProgress = async (req, res) => {
  try {
    const userId = req.user.dbUser.id;

    const [progress] = await db.query(`
      SELECT module_id, percentage, last_watched
      FROM video_progress
      WHERE user_id = ?
      ORDER BY last_watched DESC
    `, [userId]);

    res.json({
      success: true,
      progress: progress
    });
  } catch (error) {
    console.error('Get all video progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress',
      error: error.message
    });
  }
};