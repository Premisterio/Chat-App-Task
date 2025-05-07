import React from 'react';
import defaultAvatar from '../../assets/default-avatar.png';

const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md',
  name,
  online = false
}) => {
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={`avatar ${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : ''}`}>
      {src ? (
        <img src={src} alt={alt} />
      ) : name ? (
        <span>{getInitials(name)}</span>
      ) : (
        <img src={defaultAvatar} alt="Default Avatar" />
      )}
      {online && (
        <span className="online-indicator"></span>
      )}
    </div>
  );
};

export default Avatar;