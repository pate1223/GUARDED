const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Save video progress
router.post('/progress', videoController.saveVideoProgress);

// Get user's progress for specific module
router.get('/progress/:moduleId', videoController.getUserVideoProgress);

// Get all user's video progress
router.get('/progress', videoController.getAllUserProgress);

module.exports = router;