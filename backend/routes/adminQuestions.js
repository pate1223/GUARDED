const express = require('express');
const router = express.Router();
const adminQuestionController = require('../controllers/adminQuestionController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware
router.use(authMiddleware);

// Admin role check middleware
const requireAdmin = (req, res, next) => {
  if (req.user.dbUser.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

// Apply admin check to all routes
router.use(requireAdmin);

// Question management routes
router.post('/questions', adminQuestionController.addQuestion);
router.put('/questions/:questionId', adminQuestionController.updateQuestion);
router.delete('/questions/:questionId', adminQuestionController.deleteQuestion);
router.get('/questions/quiz/:quizId', adminQuestionController.getQuestionsByQuiz);
router.put('/questions/reorder', adminQuestionController.reorderQuestions);

module.exports = router;