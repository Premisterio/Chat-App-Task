const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../utils/authMiddleware');

// Auth routes
router.post('/users', authController.handleUserAuthentication);
router.get('/profile', requireAuth, authController.getUserProfile);

module.exports = router;