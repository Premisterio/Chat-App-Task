import React, { useEffect, useRef } from 'react';
import Message from './Message';

const ChatMessages = ({ messages, onUpdateMessage, loading = false }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="messages-container">
      {loading ? (
        <div className="loading-messages">Loading messages...</div>
      ) : messages.length > 0 ? (
        messages.map((message) => (
          <Message 
            key={message._id} 
            message={message} 
            onUpdateMessage={onUpdateMessage} 
          />
        ))
      ) : (
        <div className="no-messages">No messages yet. Start the conversation!</div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;