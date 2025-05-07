const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { requireAuth } = require('../utils/authMiddleware');

// Message routes
router.get('/chat/:chatId', requireAuth, messageController.getMessages);
router.post('/chat/:chatId', requireAuth, messageController.sendMessage);
router.put('/:messageId', requireAuth, messageController.updateMessage);

module.exports = router;