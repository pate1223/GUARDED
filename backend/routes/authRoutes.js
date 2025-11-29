const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * Authentication Routes
 * All routes require proper authentication and role verification
 */

// Public routes (no authentication required)
router.post('/guest', authController.createGuestUser);
router.post('/verify-token', authController.verifyToken);
router.post('/register', authController.registerUser);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/convert-guest', authMiddleware, authController.convertGuestToUser);

// Google Forms integration removed

module.exports = router;