const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Update profile
router.put('/', profileController.updateProfile);

// Update photo
router.put('/photo', profileController.updatePhoto);

// Request password reset
router.post('/password-reset', profileController.requestPasswordReset);

// Delete account
router.delete('/', profileController.deleteAccount);

module.exports = router;