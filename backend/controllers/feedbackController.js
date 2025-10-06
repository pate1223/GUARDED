const db = require('../models/db');

exports.submitFeedback = async (req, res) => {
  try {
    const userId = req.user?.dbUser?.id || null;
    const { rating, q2, q3, q4, q5 } = req.body;

    if (!rating) {
      return res.status(400).json({ error: 'Rating is required' });
    }

    await db.query(
      `INSERT INTO feedback (user_id, rating, question2, question3, question4, question5)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, rating, q2 || null, q3 || null, q4 || null, q5 || null]
    );

    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback', message: error.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT f.*, u.email 
       FROM feedback f 
       LEFT JOIN users u ON f.user_id = u.id 
       ORDER BY f.created_at DESC`
    );
    res.json({ success: true, feedback: rows });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};
