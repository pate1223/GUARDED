const db = require('../models/db');

exports.submitFeedback = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  }
  try {
    await db.query('INSERT INTO feedback (user_id, rating, comment) VALUES (?, ?, ?)', [userId, rating, comment]);
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM feedback');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
