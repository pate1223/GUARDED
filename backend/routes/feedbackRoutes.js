const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Feedback submission (auth optional)
router.post('/', authMiddleware, feedbackController.submitFeedback);
// Admin feedback viewing
router.get('/', authMiddleware, roleMiddleware('admin'), feedbackController.getAllFeedback);

module.exports = router;