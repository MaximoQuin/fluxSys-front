// src/stores/authStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue'; // Importar computed desde Vue
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

  // Obtener el rol del usuario
  const userRole = computed(() => user.value?.role?.name_role || null); // Usar computed

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setToken(response.token);
      await validateToken();
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  };

  const validateToken = async () => {
    if (!token.value) {
      return;
    }

    try {
      const response = await authService.validateToken(token.value);
      setUser(response.user); // Almacena el usuario con los nombres
    } catch (error) {
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
    userRole, // Expone el rol del usuario
    login,
    validateToken,
    logout,
  };
});