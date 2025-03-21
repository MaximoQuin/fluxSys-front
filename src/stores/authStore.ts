import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authService } from '@/services/authService';
import type { LoginResponse, User, ValidateTokenResponse } from '@/interfaces/authInterfaces';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token') || null);
  const user = ref<User | null>(null);

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const removeToken = () => {
    token.value = null;
    localStorage.removeItem('token');
  };

  const setUser = (userData: User) => {
    user.value = userData;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      //console.log('Token recibido:', response.token); // Verifica el token
      setToken(response.token);
      await validateToken();
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  };

  const validateToken = async () => {
    if (!token.value) {
      //console.warn('No hay token en el localStorage.');
      return;
    }

    try {
      //console.log('Validando token:', token.value);
      const response = await authService.validateToken(token.value);
      setUser(response.user);  // Almacena el usuario con los nombres
    } catch (error) {
      //console.error('Error validando el token:', error);
      removeToken();
    }
  };

  const logout = async () => {
    if (token.value) {
      try {
        await authService.logout(token.value);
        removeToken();
        user.value = null;
      } catch (error) {
        console.error('Error en el logout:', error);
        throw error;
      }
    }
  };

  return {
    token,
    user,
    login,
    validateToken,
    logout,
  };
});
