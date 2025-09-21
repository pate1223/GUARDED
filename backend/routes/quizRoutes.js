const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes (no authentication required)
// Get all active quizzes
router.get('/', quizController.getAllQuizzes);

// Get quiz by ID with questions
router.get('/:id', quizController.getQuizById);

// Protected routes (authentication required)
// Submit quiz answers
router.post('/:id/submit', authMiddleware, quizController.submitQuiz);

// Get user's quiz progress
router.get('/progress/user', authMiddleware, quizController.getUserProgress);

// Admin routes (admin role required)
// Get quiz statistics
router.get('/:id/stats', authMiddleware, quizController.getQuizStats);

module.exports = router;