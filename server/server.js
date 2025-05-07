const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./db');
const config = require('./config');
const { setupSocketService } = require('./services/socketService');
const quotesService = require('./services/quotesService');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { handleClerkWebhook } = require('./utils/authMiddleware');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Load quotes at startup
quotesService.fetchQuotes();

// Middleware
app.use(express.json());
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true
}));

// Socket.io setup
const server = http.createServer(app);
const io = setupSocketService(server);

// Middleware to attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// Clerk Webhook
app.post('/api/webhook', express.raw({ type: 'application/json' }), handleClerkWebhook);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});