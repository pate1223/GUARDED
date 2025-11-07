const db = require('../models/db');

/**
 * Submit feedback
 * POST /api/feedback
 */
exports.submitFeedback = async (req, res) => {
  try {
    // Handle flexible user structure (with or without dbUser)
    const userId = req.user?.dbUser?.id || req.user?.id || null;
    const { rating, comment, q2, q3, q4, q5 } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: 'Invalid rating', 
        message: 'Rating must be between 1 and 5.' 
      });
    }

    // Build dynamic insert based on provided fields
    const fields = ['user_id', 'rating'];
    const values = [userId, rating];
    const placeholders = ['?', '?'];

    if (comment) {
      fields.push('comment');
      values.push(comment);
      placeholders.push('?');
    }

    // Support optional question fields if provided
    ['q2', 'q3', 'q4', 'q5'].forEach((key, i) => {
      if (req.body[key] !== undefined) {
        fields.push(`question${i + 2}`);
        values.push(req.body[key] || null);
        placeholders.push('?');
      }
    });

    const query = `
      INSERT INTO feedback (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;

    await db.query(query, values);

    res.status(201).json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      error: 'Failed to submit feedback', 
      message: error.message 
    });
  }
};

/**
 * Get all feedback (admin only)
 * GET /api/feedback/all
 */
exports.getAllFeedback = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, u.email 
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY f.created_at DESC
    `);

    res.json({ 
      success: true, 
      feedback: rows 
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ 
      error: 'Failed to fetch feedback', 
      message: error.message 
    });
  }
};
