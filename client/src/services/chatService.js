import api from './api';

const getChats = async () => {
  try {
    return await api.get('/chats');
  } catch (error) {
    console.error('Get chats error:', error);
    throw error;
  }
};

const createChat = async (chatData) => {
  try {
    return await api.post('/chats', chatData);
  } catch (error) {
    console.error('Create chat error:', error);
    throw error;
  }
};

const updateChat = async (chatId, chatData) => {
  try {
    return await api.put(`/chats/${chatId}`, chatData);
  } catch (error) {
    console.error('Update chat error:', error);
    throw error;
  }
};

const deleteChat = async (chatId) => {
  try {
    return await api.delete(`/chats/${chatId}`);
  } catch (error) {
    console.error('Delete chat error:', error);
    throw error;
  }
};

const chatService = {
  getChats,
  createChat,
  updateChat,
  deleteChat
};

export default chatService;