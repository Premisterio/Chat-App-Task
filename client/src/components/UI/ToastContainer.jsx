import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import { setAddToastFunction } from '../../utils/toastUtils';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setAddToastFunction((message, type = 'info', duration = 3000) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    });
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
