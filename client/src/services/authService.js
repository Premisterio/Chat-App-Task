import api from './api';

const handleAuthentication = async (userData) => {
  try {
    setUserAuth(userData.clerkId);
    
    const data = await api.post('/auth/users', userData);
    
    if (data.token) {
      sessionStorage.setItem('auth_token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Authentication error:', error);
    sessionStorage.removeItem('clerkId');
    sessionStorage.removeItem('auth_token');
    throw error;
  }
};

const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

const logout = () => {
  sessionStorage.removeItem('clerkId');
  sessionStorage.removeItem('auth_token');
};

const setUserAuth = (clerkId) => {
  sessionStorage.setItem('clerkId', clerkId);
};

const getClerkId = () => {
  return sessionStorage.getItem('clerkId');
};

const authService = {
  handleAuthentication,
  getUserProfile,
  logout,
  setUserAuth,
  getClerkId
};

export default authService;