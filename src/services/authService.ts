import axios from 'axios';
import type { LoginRequest, LoginResponse, ValidateTokenResponse } from '@/interfaces/authInterfaces';

const API_URL = 'https://localhost:7002/api/Auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error en la solicitud:', error.response?.data);
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  },

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    try {
      const response = await axios.get<ValidateTokenResponse>(`${API_URL}/validate-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error validando el token:', error.response?.data); // Imprime la respuesta del error
      } else {
        console.error('Error desconocido:', error);
      }
      throw error;
    }
  },

  async logout(token: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error en el logout:', error);
      throw error;
    }
  },
};
