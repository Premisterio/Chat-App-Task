# Chat App with Auto-Response

A real-time chat app with Clerk authentication, predefined chats, and automated quote replies.

## ✨ Features

* **Auth via Clerk** (Gmail, etc.)
* **Predefined Chats** for new users
* **Chat Management**: Create, edit, delete (with confirmation)
* **Messaging**: Send, edit, auto-response (3s delay)
* **Search & Notifications**: Find chats, toast on new message
* **Socket IO**: Real-time updates, optional auto-messages to random chats

## 🔧 Tech Stack

* **Frontend**: React (Vite), Context API, Socket IO, Clerk, pure CSS
* **Backend**: Node.js (Express), MongoDB Atlas, JWT, Socket IO, Quotes API

## 🚀 How to deploy locally:

### 1. Setup `.env` Files

**Frontend (`/client/.env`)**

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_key
```

**Backend (`/server/.env`)**

```env
PORT=5000
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLERK_SECRET_KEY=your_clerk_secret
CLERK_WEBHOOK_SECRET=your_webhook_secret
QUOTES_API_URL=https://your-quotes-api-url.com
```

### 2. Install & Run

```bash
# Clone repo
git clone https://github.com/yourusername/chat-app.git
cd chat-app

# Start backend
cd server && npm install && npm start

# Start frontend
cd ../client && npm install && npm run dev
```

## 📡 API & Sockets

### REST API

* `/api/auth/users` – Auth
* `/api/chats` – Create, update, delete
* `/api/messages/chat/:chatId` – Send/get messages

### Socket Events

* `join`, `toggle_auto_messages`
* `new_message`, `notification`, `auto_messages_status`

## 📲 Usage

1. Login with Clerk
2. Create or select a chat
3. Send messages → receive auto-quote replies
4. Enable auto-messages for random quotes

Created by Volodymyr Hrehul, 2025