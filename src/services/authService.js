import api from './api';

export const authService = {
  // Login for both Admin and Client
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data && response.data.success && response.data.data) {
      const { token, ...userData } = response.data.data;
      if (token) {
        localStorage.setItem('leaddesk_token', token);
      }
      localStorage.setItem('leaddesk_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Register new Client user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.success && response.data.data) {
      const { token } = response.data.data;
      if (token) {
        localStorage.setItem('leaddesk_token', token);
      }
      localStorage.setItem('leaddesk_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Logout session
  logout: () => {
    localStorage.removeItem('leaddesk_token');
    localStorage.removeItem('leaddesk_user');
  },

  // Retrieve current cached user
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('leaddesk_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  // Verify and fetch profile from server
  fetchProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Get registered users (Admin only)
  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
};

export default authService;
