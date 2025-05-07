import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../UI/LoadingScreen';
import ToastContainer from '../UI/ToastContainer';

export const MainLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="app-layout">
      <ToastContainer />
      {children}
    </div>
  );
};

export { addToast } from '../../utils/toastUtils';