import React, { useState } from 'react';
import Avatar from '../UI/Avatar';
import UpdateChatDialog from './UpdateChatDialog';
import ConfirmDialog from '../UI/ConfirmDialog';
import { useSocket } from '../../context/SocketContext';

const ChatHeader = ({ currentChat, onUpdateChat, onDeleteChat }) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { autoMessagesEnabled, toggleAutoMessages } = useSocket();

  if (!currentChat) return null;

  const { firstName, lastName } = currentChat;
  const fullName = `${firstName} ${lastName}`.trim();

  const handleUpdate = (updatedData) => {
    onUpdateChat(updatedData);
    setIsUpdateDialogOpen(false);
  };

  const handleDelete = () => {
    onDeleteChat();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="chat-header">
      <div className="flex align-center">
        <Avatar name={fullName} size="md" />
        <div className="ml-1">
          <h3>{fullName}</h3>
        </div>
      </div>
      <div>
        <button 
          className={`icon-button mr-1 ${autoMessagesEnabled ? 'active' : ''}`} 
          onClick={() => toggleAutoMessages(!autoMessagesEnabled)}
          title={autoMessagesEnabled ? 'Disable auto messages' : 'Enable auto messages'}
        >
          <i className="fas fa-robot"></i>
        </button>
        <button className="icon-button mr-1" onClick={() => setIsUpdateDialogOpen(true)}>
          <i className="fas fa-edit"></i>
        </button>
        <button className="icon-button" onClick={() => setIsDeleteDialogOpen(true)}>
          <i className="fas fa-trash"></i>
        </button>
      </div>

      {isUpdateDialogOpen && (
        <UpdateChatDialog
          chat={currentChat}
          onUpdate={handleUpdate}
          onCancel={() => setIsUpdateDialogOpen(false)}
        />
      )}

      {isDeleteDialogOpen && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title="Delete Chat"
          message="Are you sure you want to delete this chat? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteDialogOpen(false)}
          type="danger"
        />
      )}
    </div>
  );
};

export default ChatHeader;