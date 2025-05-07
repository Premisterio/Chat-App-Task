const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Get all chats for a user
exports.getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ lastMessageDate: -1 });
    res.status(200).json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const userId = req.user._id;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const newChat = new Chat({
      firstName,
      lastName,
      userId
    });

    await newChat.save();
    res.status(201).json({ chat: newChat });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing chat
exports.updateChat = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const chatId = req.params.id;
    const userId = req.user._id;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Update chat
    chat.firstName = firstName;
    chat.lastName = lastName;
    await chat.save();

    res.status(200).json({ chat });
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a chat
exports.deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: chatId, userId });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chatId });
    
    // Delete the chat
    await Chat.deleteOne({ _id: chatId });

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPredefinedChats = async (userId) => {
  try {
    const predefinedChats = [
      {
        firstName: 'Alice',
        lastName: 'Freeman',
        lastMessage: 'How was your meeting?',
        userId,
        isPredefined: true
      },
      {
        firstName: 'Josefina',
        lastName: 'Smith',
        lastMessage: 'Hi! No, I am going for a walk.',
        userId,
        isPredefined: true
      },
      {
        firstName: 'Velazquez',
        lastName: 'Martinez',
        lastMessage: 'Hi! I am a little sad, tell me a joke please.',
        userId,
        isPredefined: true
      },
      {
        firstName: 'Peter',
        lastName: 'Doe',
        lastMessage: 'Your time is limited, so don\'t waste it living someone else\'s life.',
        userId,
        isPredefined: true
      }
    ];

    // Create all chats at once
    const createdChats = await Chat.insertMany(predefinedChats);
    
    // Add initial messages for each chat
    await Promise.all(createdChats.map(chat => 
      Message.create({
        content: chat.lastMessage,
        chatId: chat._id,
        isFromUser: false
      })
    ));
    
    return createdChats;
  } catch (error) {
    console.error('Create predefined chats error:', error);
    throw error;
  }
};