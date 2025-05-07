import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Avatar from '../UI/Avatar';

const Header = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    if (socket) {
      socket.disconnect();
    }
    
    await logout();
    
    navigate('/login', { replace: true });
  };

  if (!user) return null;

  return (
    <header className="app-header">
      <div className="logo">
        <h1>Chat App</h1>
      </div>
      
      <div className="profile-section">
        <div className="header-profile" onClick={() => setShowDropdown(!showDropdown)}>
          <Avatar 
            src={user.profileImage} 
            name={`${user.firstName} ${user.lastName}`} 
            size="md" 
          />
          <span className="username">{user.firstName}</span>
          <i className="fas fa-chevron-down ml-1"></i>
          
          {showDropdown && (
            <div className="dropdown">
              <ul>
                <li>
                  <i className="fas fa-user"></i>
                  <span>Profile</span>
                </li>
                <li onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
        <button className="logout-button visible-mobile" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;