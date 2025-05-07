import React, { useState } from 'react';
import ChatListItem from './ChatListItem';
import SearchBar from '../UI/SearchBar';
import NewChatDialog from './NewChatDialog';

const ChatList = ({ chats, selectedChatId, onSelectChat, onCreateChat, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  
  const filteredChats = chats.filter(chat => {
    const fullName = `${chat.firstName} ${chat.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleCreateChat = (chatData) => {
    onCreateChat(chatData);
    setIsNewChatDialogOpen(false);
  };

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <h2>Chats</h2>
        <button 
          className="button"
          onClick={() => setIsNewChatDialogOpen(true)}
        >
          <i className="fas fa-plus"></i> New Chat
        </button>
      </div>
      
      <SearchBar 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      
      <div className="chat-list">
        {loading ? (
          <div className="loading">Loading chats...</div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <ChatListItem 
              key={chat._id} 
              chat={chat} 
              isActive={chat._id === selectedChatId}
              onClick={onSelectChat}
            />
          ))
        ) : (
          <div className="no-chats">
            {searchTerm ? 'No chats found' : 'No chats yet'}
          </div>
        )}
      </div>

      {isNewChatDialogOpen && (
        <NewChatDialog
          onCreateChat={handleCreateChat}
          onCancel={() => setIsNewChatDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatList;