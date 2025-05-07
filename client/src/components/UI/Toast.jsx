import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
  };

  const toastClass = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  const animation = visible ? 'slideIn' : 'slideOut';

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div className={toastClass} style={{ animation: `${animation} 0.3s ease-out` }}>
      <div>{message}</div>
      <button className="toast-close" onClick={handleClose}>×</button>
    </div>
  );
};

export default Toast;