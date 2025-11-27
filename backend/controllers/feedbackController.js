const db = require('../models/db');

/**
 * Submit feedback
 * POST /api/feedback
 */
exports.submitFeedback = async (req, res) => {
  try {
    // Handle flexible user structure (with or without dbUser)
    const userId = req.user?.dbUser?.id || req.user?.id || null;
    const { rating, q2, q3, q4, q5 } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Invalid rating',
        message: 'Rating must be between 1 and 5.'
      });
    }

    // Combine all answers into a structured comment (for backward compatibility)
    const commentParts = [];
    if (q2) commentParts.push(`What you liked: ${q2}`);
    if (q3) commentParts.push(`What to improve: ${q3}`);
    if (q4) commentParts.push(`Would recommend: ${q4}`);
    if (q5) commentParts.push(`Additional comments: ${q5}`);

    const comment = commentParts.length > 0 ? commentParts.join('\n\n') : null;

    // Store in separate columns for better admin dashboard display
    await db.query(
      `INSERT INTO feedback (user_id, rating, comment, question2, question3, question4, question5, feedback_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'general')`,
      [userId, rating, comment, q2 || null, q3 || null, q4 || null, q5 || null]
    );

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
 * GET /api/feedback
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