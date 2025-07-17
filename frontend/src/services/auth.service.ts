// src/services/auth.service.ts
import api from '@/lib/api';
import { User, LoginCredentials, RegisterData } from '@/types/usersTypes';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/token/', credentials);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post('/usuarios/users/', data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/usuarios/users/me/');
    return response.data;
  },

  async updateUser(userData: Partial<User>) {
    const response = await api.put('/usuarios/users/me/', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/usuarios/users/me/');
    return response.data;
  }
};
