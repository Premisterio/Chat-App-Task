import api from './api';

const getMessages = async (chatId) => {
  try {
    return await api.get(`/messages/chat/${chatId}`);
  } catch (error) {
    console.error('Get messages error:', error);
    throw error;
  }
};

const sendMessage = async (chatId, content) => {
  try {
    return await api.post(`/messages/chat/${chatId}`, { content });
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

const updateMessage = async (messageId, content) => {
  try {
    return await api.put(`/messages/${messageId}`, { content });
  } catch (error) {
    console.error('Update message error:', error);
    throw error;
  }
};

const messageService = {
  getMessages,
  sendMessage,
  updateMessage
};

export default messageService;