const User = require('../models/User');
const { Webhook } = require('svix');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware to require authentication
exports.requireAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    // Get Clerk user ID from header (as backup)
    const clerkId = req.header('clerk-user-id');
    
    if (!token && !clerkId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    let userId;
    
    if (token) {
      try {
        // Verify JWT token
        const decoded = jwt.verify(token, config.JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        // If token is invalid, fall back to clerkId
        if (!clerkId) {
          return res.status(401).json({ message: 'Invalid authentication token' });
        }
      }
    }
    
    // Find user in database
    const user = await User.findOne(userId ? { _id: userId } : { clerkId });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Webhook handler for Clerk events
exports.handleClerkWebhook = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const payload = req.body;
    const headers = req.headers;
    const svixId = headers['svix-id'];
    const svixTimestamp = headers['svix-timestamp'];
    const svixSignature = headers['svix-signature'];
    
    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({ message: 'Missing Svix headers' });
    }

    const webhook = new Webhook(WEBHOOK_SECRET);
    const evt = webhook.verify(JSON.stringify(payload), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });

    // Handle different webhook events
    const { type, data } = evt;
    
    if (type === 'user.created') {
      // Create user in our database when Clerk user is created
      const { id, first_name, last_name, email_addresses, image_url } = data;
      
      const user = new User({
        clerkId: id,
        firstName: first_name || '',
        lastName: last_name || '',
        email: email_addresses[0]?.email_address || '',
        profileImage: image_url || ''
      });
      
      await user.save();
      
      // Create predefined chats for the new user
      const chatController = require('../controllers/chatController');
      await chatController.createPredefinedChats(user._id);
    } else if (type === 'user.updated') {
      // Update user in our database when Clerk user is updated
      const { id, first_name, last_name, email_addresses, image_url } = data;
      
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          firstName: first_name || '',
          lastName: last_name || '',
          email: email_addresses[0]?.email_address || '',
          profileImage: image_url || ''
        }
      );
    } else if (type === 'user.deleted') {
      // Delete user from our database when Clerk user is deleted
      const { id } = data;
      await User.deleteOne({ clerkId: id });
    }
    
    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};