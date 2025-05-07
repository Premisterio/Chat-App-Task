import React from 'react';

const EmptyState = ({ 
  title, 
  message, 
  icon = 'far fa-comment-dots',
  actionText,
  onAction,
  actionButton
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionButton ? actionButton : actionText && onAction && (
        <button className="button" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;