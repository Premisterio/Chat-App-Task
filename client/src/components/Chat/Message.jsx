import React, { useState } from 'react';
import { formatDate } from '../../utils/formatDate';

const Message = ({ message, onUpdateMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleSaveEdit = () => {
    if (editedContent.trim() !== message.content) {
      onUpdateMessage(message._id, editedContent);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  return (
    <div className={`message ${message.isFromUser ? 'user' : 'bot'}`}>
      <div className="message-content">
        {isEditing ? (
          <div className="message-edit">
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <div className="message-edit-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            {message.content}
            {message.isFromUser && (
              <button className="message-edit-button" onClick={() => setIsEditing(true)}>
                <i className="fas fa-edit"></i>
              </button>
            )}
          </div>
        )}
      </div>
      <div className="message-time">
        {formatDate(message.createdAt)}
        {message.updatedAt && ' (edited)'}
      </div>
    </div>
  );
};

export default Message;