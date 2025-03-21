import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';

export async function genericRequest<T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  data?: any,
  customHeaders?: Record<string, string>
): Promise<T> {
  const authStore = useAuthStore();
  const token = authStore.token;

  const headers = {
    ...customHeaders,
    ...(token && { Authorization: `Bearer ${token}` }),
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
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      const stackTrace = error.stack || 'No hay stack trace disponible';
      const source = `${method.toUpperCase()}`;

      // Enviar el error al backend usando la estructura del DTO
      await logErrorToBackend({
        message: errorMessage,
        stackTrace: stackTrace,
        source: source,
      });

    //   console.error('Error en la solicitud:', errorMessage);
    } // else {
    //   console.error('Error desconocido:', error);
    // }
    throw error;
  }
}

// Función para enviar errores al backend usando el DTO
async function logErrorToBackend(errorData: {
  message: string;
  stackTrace: string;
  source: string;
}) {
  try {
    await axios.post('https://localhost:7002/api/Errors/log', errorData);
  } catch (error) {
    console.error('Error al enviar el log al backend:', error);
  }
}