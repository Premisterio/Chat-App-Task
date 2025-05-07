const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const clerkId = sessionStorage.getItem('clerkId');
  const token = sessionStorage.getItem('auth_token');
  
  return {
    'Content-Type': 'application/json',
    'clerk-user-id': clerkId,
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: getAuthHeaders(),
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (response.status === 401) {
      sessionStorage.removeItem('clerkId');
      sessionStorage.removeItem('auth_token');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    if (response.status === 204) {
      return null;
    }

    const result = await response.json();

    if (!response.ok) {
      const error = new Error(result.message || 'API request failed');
      error.status = response.status;
      throw error;
    }

    return result;
  } catch (error) {
    if (error.status === 401) {
      window.location.href = '/login';
    }
    throw error;
  }
};

export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, 'POST', data),
  put: (endpoint, data) => apiRequest(endpoint, 'PUT', data),
  delete: (endpoint) => apiRequest(endpoint, 'DELETE'),
};

export default api;