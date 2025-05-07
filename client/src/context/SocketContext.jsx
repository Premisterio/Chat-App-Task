import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [autoMessagesEnabled, setAutoMessagesEnabled] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let socketInstance = null;

    if (isAuthenticated && user) {

      socketInstance = io(import.meta.env.VITE_API_URL.replace('/api', ''));

      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        
        socketInstance.emit('join', user._id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socketInstance.on('auto_messages_status', (data) => {
        setAutoMessagesEnabled(data.enabled);
      });

      socketInstance.on('notification', (data) => {
        setNotifications(prev => [...prev, data]);
      });

      setSocket(socketInstance);
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  const toggleAutoMessages = (enabled) => {
    if (socket && isConnected) {
      socket.emit('toggle_auto_messages', { userId: user._id, enabled });
    }
  };

  const clearNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const value = {
    socket,
    isConnected,
    autoMessagesEnabled,
    toggleAutoMessages,
    notifications,
    clearNotification
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};