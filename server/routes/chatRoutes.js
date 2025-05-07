const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { requireAuth } = require('../utils/authMiddleware');

// Chat routes
router.get('/', requireAuth, chatController.getChats);
router.post('/', requireAuth, chatController.createChat);
router.put('/:id', requireAuth, chatController.updateChat);
router.delete('/:id', requireAuth, chatController.deleteChat);

module.exports = router;