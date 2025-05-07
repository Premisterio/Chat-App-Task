import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatInput from '../components/Chat/ChatInput';
import ChatList from '../components/Chat/ChatList';
import LoadingScreen from '../components/UI/LoadingScreen';
import EmptyState from '../components/UI/EmptyState';
import { addToast } from '../utils/toastUtils';
import chatService from '../services/chatService';
import messageService from '../services/messageService';


const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const { user } = useAuth();
  const { socket, isConnected, notifications, clearNotification } = useSocket();
  const { id: chatId } = useParams();
  const navigate = useNavigate();

  const fetchChats = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoadingChats(true);
      console.log('Fetching chats for user:', user._id);
      const data = await chatService.getChats();
      
      if (data.chats && Array.isArray(data.chats)) {
        console.log('Fetched chats:', data.chats.length);
        
        const sortedChats = data.chats.sort((a, b) => 
          new Date(b.lastMessageDate || 0) - new Date(a.lastMessageDate || 0)
        );
        
        setChats(sortedChats);
        return sortedChats;
      } else {
        console.warn('No chats returned from API or invalid format');
        setChats([]);
        return [];
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      addToast('Failed to load chats', 'error');
      setChats([]);
      return [];
    } finally {
      setLoadingChats(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (id) => {
    if (!id) return;
    
    try {
      setLoadingMessages(true);
      console.log('Fetching messages for chat:', id);
      const data = await messageService.getMessages(id);
      
      if (data.messages && Array.isArray(data.messages)) {
        console.log('Fetched messages:', data.messages.length);
        setMessages(data.messages);
      } else {
        console.warn('No messages returned from API or invalid format');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      addToast('Failed to load messages', 'error');
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (!user || initialized) return;
      
      console.log('Initializing chat component');
      const fetchedChats = await fetchChats();
      
      if (fetchedChats && fetchedChats.length > 0) {
        if (chatId) {
          const selectedChat = fetchedChats.find(c => c._id === chatId);
          if (selectedChat) {
            console.log('Setting current chat from URL:', selectedChat._id);
            setCurrentChat(selectedChat);
            fetchMessages(selectedChat._id);
          } else {
            console.warn('Chat ID from URL not found in fetched chats');
            const firstChat = fetchedChats[0];
            setCurrentChat(firstChat);
            fetchMessages(firstChat._id);
            navigate(`/chat/${firstChat._id}`, { replace: true });
          }
        } else {
          const firstChat = fetchedChats[0];
          console.log('No chat ID in URL, using first chat:', firstChat._id);
          setCurrentChat(firstChat);
          fetchMessages(firstChat._id);
          navigate(`/chat/${firstChat._id}`, { replace: true });
        }
      }
      
      setInitialized(true);
    };
    
    initialize();
  }, [user, chatId, fetchChats, fetchMessages, navigate, initialized]);

  useEffect(() => {
    if (!socket || !isConnected) return;
    
    console.log('Setting up socket listeners');
    
    const handleNewMessage = (data) => {
      console.log('New message received:', data);
      if (currentChat && data.chatId === currentChat._id) {
        setMessages(prev => [...prev, data.message]);
      }
      
      setChats(prev => {
        const updatedChats = prev.map(chat => {
          if (chat._id === data.chatId) {
            return {
              ...chat,
              lastMessage: data.message.content,
              lastMessageDate: data.message.createdAt
            };
          }
          return chat;
        });

        return updatedChats.sort((a, b) => 
          new Date(b.lastMessageDate || 0) - new Date(a.lastMessageDate || 0)
        );
      });
    };
    
    const handleChatUpdated = (data) => {
      console.log('Chat updated:', data);
      setChats(prev => {
        return prev.map(chat => {
          if (chat._id === data.chat._id) {
            return data.chat;
          }
          return chat;
        });
      });
      
      if (currentChat && currentChat._id === data.chat._id) {
        setCurrentChat(data.chat);
      }
    };
    
    const handleChatDeleted = (data) => {
      console.log('Chat deleted:', data);
      if (currentChat && currentChat._id === data.chatId) {
        navigate('/chat');
        setCurrentChat(null);
      }
      
      setChats(prev => prev.filter(chat => chat._id !== data.chatId));
    };
    
    socket.on('new_message', handleNewMessage);
    socket.on('chat_updated', handleChatUpdated);
    socket.on('chat_deleted', handleChatDeleted);
    
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('chat_updated', handleChatUpdated);
      socket.off('chat_deleted', handleChatDeleted);
    };
  }, [socket, isConnected, currentChat, navigate]);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];

      if (!currentChat || latestNotification.chatId !== currentChat._id) {
        addToast(`${latestNotification.title}: ${latestNotification.message.substring(0, 30)}...`, 'info');
      }
      
      clearNotification(notifications.length - 1);
    }
  }, [notifications, currentChat, clearNotification]);

  useEffect(() => {
    if (chatId && chats.length > 0 && initialized) {
      const chat = chats.find(c => c._id === chatId);
      if (chat) {
        console.log('Setting current chat from updated URL:', chat._id);
        setCurrentChat(chat);
        fetchMessages(chat._id);
      } else {
        console.warn('Chat ID from updated URL not found in chats');
        navigate('/chat');
        addToast('Chat not found', 'error');
      }
    }
  }, [chatId, chats, navigate, fetchMessages, initialized]);

  const handleSendMessage = async (content) => {
    if (!currentChat) return;
    
    try {
      setSendingMessage(true);
      console.log('Sending message to chat:', currentChat._id);
      const data = await messageService.sendMessage(currentChat._id, content);
      
        setMessages(prev => [...prev, data.message]);
      
      setChats(prev => {
        const updatedChats = prev.map(chat => {
          if (chat._id === currentChat._id) {
            return {
              ...chat,
              lastMessage: content,
              lastMessageDate: new Date()
            };
          }
          return chat;
        });
        
        return updatedChats.sort((a, b) => 
          new Date(b.lastMessageDate || 0) - new Date(a.lastMessageDate || 0)
        );
      });
    } catch (error) {
      console.error('Error sending message:', error);
      addToast('Failed to send message', 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateMessage = async (messageId, content) => {
    try {
      console.log('Updating message:', messageId);
      const data = await messageService.updateMessage(messageId, content);
      
      setMessages(prev => {
        return prev.map(message => {
          if (message._id === messageId) {
            return data.message;
          }
          return message;
        });
      });
      
      const isLastMessage = messages[messages.length - 1]._id === messageId;
      if (isLastMessage) {
        setChats(prev => {
          return prev.map(chat => {
            if (chat._id === currentChat._id) {
              return {
                ...chat,
                lastMessage: content
              };
            }
            return chat;
          });
        });
      }
    } catch (error) {
      console.error('Error updating message:', error);
      addToast('Failed to update message', 'error');
    }
  };

  const handleSelectChat = (chat) => {
    console.log('Selecting chat:', chat._id);
    setCurrentChat(chat);
    fetchMessages(chat._id);
    navigate(`/chat/${chat._id}`);
    setIsMobileSidebarOpen(false);
  };

  const handleCreateChat = async (chatData) => {
    try {
      console.log('Creating new chat');
      const data = await chatService.createChat(chatData);
      setChats(prev => [data.chat, ...prev]);
      setCurrentChat(data.chat);
      setMessages([]);
      navigate(`/chat/${data.chat._id}`);
      addToast('Chat created successfully', 'success');
    } catch (error) {
      console.error('Error creating chat:', error);
      addToast('Failed to create chat', 'error');
    }
  };

  const handleUpdateChat = async (updatedData) => {
    if (!currentChat) return;
    
    try {
      console.log('Updating chat:', currentChat._id);
      const data = await chatService.updateChat(currentChat._id, updatedData);

      setChats(prev => {
        return prev.map(chat => {
          if (chat._id === currentChat._id) {
            return data.chat;
          }
          return chat;
        });
      });

      setCurrentChat(data.chat);
      addToast('Chat updated successfully', 'success');
    } catch (error) {
      console.error('Error updating chat:', error);
      addToast('Failed to update chat', 'error');
    }
  };

  const handleDeleteChat = async () => {
    if (!currentChat) return;
    
    try {
      console.log('Deleting chat:', currentChat._id);
      await chatService.deleteChat(currentChat._id);

      setChats(prev => prev.filter(chat => chat._id !== currentChat._id));

      if (chats.length > 1) {
        const newCurrentChat = chats.find(chat => chat._id !== currentChat._id);
        setCurrentChat(newCurrentChat);
        setMessages([]);
        fetchMessages(newCurrentChat._id);
        navigate(`/chat/${newCurrentChat._id}`);
      } else {
        setCurrentChat(null);
        setMessages([]);
        navigate('/chat');
      }
      
      addToast('Chat deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting chat:', error);
      addToast('Failed to delete chat', 'error');
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  if (loadingChats && chats.length === 0) {
    return <LoadingScreen message="Loading chats..." />;
  }

  return (
    <div className="chat-container">
      {/* Mobile toggle button */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={toggleMobileSidebar}
      >
        <i className="fas fa-bars"></i>
      </button>
      
      {/* Chat list sidebar */}
      <div className={`chat-sidebar-container ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <ChatList 
          chats={chats}
          selectedChatId={currentChat?._id}
          onSelectChat={handleSelectChat}
          onCreateChat={handleCreateChat}
          loading={loadingChats}
        />
      </div>
      
      {/* Main chat area */}
      <div className="chat-main">
        {currentChat ? (
          <>
            <ChatHeader 
              currentChat={currentChat}
              onUpdateChat={handleUpdateChat}
              onDeleteChat={handleDeleteChat}
            />
            
            <ChatMessages 
              messages={messages}
              onUpdateMessage={handleUpdateMessage}
              loading={loadingMessages}
            />
            
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={sendingMessage}
            />
          </>
        ) : (
          <EmptyState
            title="No chat selected"
            message="Start a conversation by creating a new chat or selecting an existing one"
            icon="fas fa-comments"
            actionButton={
              <button className="button" onClick={() => setIsMobileSidebarOpen(true)}>
                <i className="fas fa-plus"></i>
                <span>New Chat</span>
              </button>
            }
          />
        )}
      </div>

    </div>
  );
};

export default Chat;