const Message = require('../models/Message');
const Chat = require('../models/Chat');
const quotesService = require('../services/quotesService');

// Get all messages for a chat
exports.getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.user._id;

    // Verify the chat belongs to the user
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const chatId = req.params.chatId;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Verify the chat belongs to the user
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Create and save user message
    const newMessage = new Message({
      content,
      chatId,
      isFromUser: true
    });
    await newMessage.save();

    // Update chat with last message
    chat.lastMessage = content;
    chat.lastMessageDate = new Date();
    await chat.save();

    res.status(201).json({ message: newMessage });

    // Prepare auto-response after 3 seconds
    setTimeout(async () => {
      try {
        // Get a random quote
        const quote = await quotesService.getRandomQuote();
        
        // Create and save auto-response message
        const autoResponse = new Message({
          content: quote,
          chatId,
          isFromUser: false
        });
        await autoResponse.save();

        // Update chat with last message
        chat.lastMessage = quote;
        chat.lastMessageDate = new Date();
        await chat.save();

        // Emit socket event for real-time update
        req.io.to(userId.toString()).emit('new_message', {
          message: autoResponse,
          chatId
        });
      } catch (error) {
        console.error('Auto-response error:', error);
      }
    }, 3000);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a message
exports.updateMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const messageId = req.params.messageId;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Verify the chat belongs to the user
    const chat = await Chat.findOne({ _id: message.chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Only allow updating user's own messages
    if (!message.isFromUser) {
      return res.status(403).json({ message: 'Cannot update auto-response messages' });
    }

    // Update message
    message.content = content;
    message.updatedAt = new Date();
    await message.save();

    // If this is the last message in the chat, update the chat's lastMessage
    if (chat.lastMessageDate.getTime() === message.createdAt.getTime()) {
      chat.lastMessage = content;
      await chat.save();
    }

    res.status(200).json({ message });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};