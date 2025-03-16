// src/utils/httpUtils.ts
import axios from 'axios'; // Importa axios normalmente
import type { AxiosResponse, AxiosError } from 'axios'; // Importa los tipos correctamente
import { useAuthStore } from '@/stores/authStore'; // Importa el store de autenticación

export async function genericRequest<T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  data?: any,
  customHeaders?: Record<string, string> // Headers personalizados (opcional)
): Promise<T> {
  const authStore = useAuthStore(); // Obtén el store de autenticación
  const token = authStore.token; // Obtén el token del store

  // Configura los headers
  const headers = {
    ...customHeaders, // Headers personalizados (si los hay)
    ...(token && { Authorization: `Bearer ${token}` }), // Agrega el token si está disponible
  };

  try {
    const response: AxiosResponse<T> = await axios({
      method,
      url,
      data,
      headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data);
    } else {
      console.error('Error desconocido:', error);
    }
    throw error;
  }
}
