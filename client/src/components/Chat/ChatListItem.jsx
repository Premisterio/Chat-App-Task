import React from 'react';
import Avatar from '../UI/Avatar';
import { formatDate } from '../../utils/formatDate';

const ChatListItem = ({ chat, isActive, onClick }) => {
  const { firstName, lastName, lastMessage, lastMessageDate } = chat;
  const fullName = `${firstName} ${lastName}`.trim();
  
  const truncateMessage = (message, length = 30) => {
    if (!message) return '';
    return message.length > length ? `${message.substring(0, length)}...` : message;
  };

  return (
    <div 
      className={`chat-list-item ${isActive ? 'active' : ''}`}
      onClick={() => onClick(chat)}
    >
      <Avatar name={fullName} size="md" />
      <div className="chat-info">
        <div className="chat-name">{fullName}</div>
        <div className="chat-last-message">{truncateMessage(lastMessage)}</div>
      </div>
      {lastMessageDate && (
        <div className="chat-time">{formatDate(lastMessageDate)}</div>
      )}
    </div>
  );
};

export default ChatListItem;