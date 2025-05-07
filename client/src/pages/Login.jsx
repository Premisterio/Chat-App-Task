import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      background: '#f5f5f5'
    }}>
      <div className="auth-card" style={{
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px'
      }}>
        <h1 className="auth-title" style={{
          marginBottom: '30px',
          color: '#2196f3',
          textAlign: 'center'
        }}>Chat App</h1>
        <SignIn redirectUrl="/chat" />
        <h3 style={{
          marginTop: '30px',
          color: '#2196f3',
          textAlign: 'center'
        }}>Created by:</h3>
        <h2 style={{
          color: '#2196f3',
          textAlign: 'center'
        }}>Volodymyr Hrehul</h2>
      </div>
    </div>
  );
};

export default Login;