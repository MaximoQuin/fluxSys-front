import type { LoginRequest, LoginResponse, ValidateTokenResponse } from '@/interfaces/authInterfaces';
import { genericRequest } from '@/utils/httpUtils';

const API_URL = 'https://localhost:7002/api/Auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return genericRequest<LoginResponse>('post', `${API_URL}/login`, credentials);
  },

  async validateToken(): Promise<ValidateTokenResponse> {
    return genericRequest<ValidateTokenResponse>('get', `${API_URL}/validate-token`);
  },

  async logout(): Promise<void> {
    return genericRequest<void>('post', `${API_URL}/logout`);
  },
};
