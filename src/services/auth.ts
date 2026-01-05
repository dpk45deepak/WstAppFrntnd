import api from './api';
import type { AuthResponse, User } from '../types';

// interface AuthResponse {
//   token: string;
//   user: User;
// }

const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response: AuthResponse = await api.post('/auth/login', { email, password });
    return {
      token: response.token,
      user: response.user
    };
  },

  register: async (name: string, email: string, password: string, role: string): Promise<{ token: string; user: User }> => {
    const response: AuthResponse = await api.post('/auth/register', { name, email, password, role });
    return {
      token: response.token,
      user: response.user
    };
  },

  getProfile: async (): Promise<User> => {
    const response: User = await api.get('/users/profile');
    return response;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response: User = await api.put('/users/profile', data);
    return response;
  },

/**
 * Logout user by removing token and user data from local storage.
 */
  logout: () => {
    localStorage.removeItem('wstapp_token');
    localStorage.removeItem('wstapp_user');
  },
};

export default authService;