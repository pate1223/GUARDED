const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Quiz Routes
 * Handles public quizzes, user progress, achievements, and admin analytics.
 */

// 🟢 Public routes (no authentication required)

// Get all active quizzes
router.get('/', quizController.getAllQuizzes);

// Get quiz by ID with questions
router.get('/:id', quizController.getQuizById);

// 🔒 Protected routes (authentication required)

// Submit quiz answers
router.post('/:id/submit', authMiddleware, quizController.submitQuiz);

// Get user's quiz progress and overall history
router.get('/progress/user', authMiddleware, quizController.getUserProgress);

// Get user's quiz history for a specific quiz
router.get('/:id/history', authMiddleware, quizController.getQuizHistory);

// Get user's achievements summary
router.get('/achievements/user', authMiddleware, quizController.getUserAchievements);

// Reset user's quiz progress (for testing/retaking)
// router.delete('/:id/progress', authMiddleware, quizController.resetQuizProgress);

// 🛡️ Admin routes (admin role required)

// Get quiz statistics for admin dashboard
router.get('/:id/stats', authMiddleware, quizController.getQuizStats);

module.exports = router;
