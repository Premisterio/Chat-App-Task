const socketIo = require('socket.io');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const quotesService = require('./quotesService');

let autoMessageInterval = null;
let isAutoMessagesEnabled = false;

const setupSocketService = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Join user to their room (using their userId)
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Handle enabling/disabling auto messages
    socket.on('toggle_auto_messages', async ({ userId, enabled }) => {
      isAutoMessagesEnabled = enabled;
      
      if (enabled) {
        // Start sending auto messages
        if (!autoMessageInterval) {
          autoMessageInterval = setInterval(async () => {
            try {
              // Only send if auto messages are still enabled
              if (isAutoMessagesEnabled) {
                await sendRandomChatMessage(io, userId);
              }
            } catch (error) {
              console.error('Error sending auto message:', error);
            }
          }, 15000); // Send every 15 seconds
        }
      } else {
        // Stop sending auto messages
        if (autoMessageInterval) {
          clearInterval(autoMessageInterval);
          autoMessageInterval = null;
        }
      }
      
      // Acknowledge the toggle
      socket.emit('auto_messages_status', { enabled: isAutoMessagesEnabled });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

// Send a random message to a random chat
const sendRandomChatMessage = async (io, userId) => {
  try {
    // Get all chats for the user
    const chats = await Chat.find({ userId });
    
    if (chats.length === 0) {
      return;
    }
    
    // Select a random chat
    const randomIndex = Math.floor(Math.random() * chats.length);
    const randomChat = chats[randomIndex];
    
    // Get a random quote
    const quote = await quotesService.getRandomQuote();
    
    // Create and save auto-response message
    const autoMessage = new Message({
      content: quote,
      chatId: randomChat._id,
      isFromUser: false
    });
    await autoMessage.save();
    
    // Update chat with last message
    randomChat.lastMessage = quote;
    randomChat.lastMessageDate = new Date();
    await randomChat.save();
    
    // Emit socket event for real-time update
    io.to(userId.toString()).emit('new_message', {
      message: autoMessage,
      chatId: randomChat._id
    });
    
    // Also emit a notification event
    io.to(userId.toString()).emit('notification', {
      title: `${randomChat.firstName} ${randomChat.lastName}`,
      message: quote,
      chatId: randomChat._id
    });
  } catch (error) {
    console.error('Error sending random chat message:', error);
    throw error;
  }
};

module.exports = {
  setupSocketService
};