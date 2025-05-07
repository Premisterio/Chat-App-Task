const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { createPredefinedChats } = require('./chatController');

// Create or retrieve user from Clerk authentication
exports.handleUserAuthentication = async (req, res) => {
  try {
    const { clerkId, firstName, lastName, email, profileImage } = req.body;

    // Check if user already exists
    let user = await User.findOne({ clerkId });
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        clerkId,
        firstName,
        lastName,
        email,
        profileImage
      });
      await user.save();
      isNewUser = true;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, clerkId: user.clerkId },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create predefined chats for new users
    if (isNewUser) {
      await createPredefinedChats(user._id);
    }

    res.status(200).json({ user, token });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.user.clerkId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};