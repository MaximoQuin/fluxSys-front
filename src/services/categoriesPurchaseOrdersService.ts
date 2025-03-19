import { genericRequest } from '@/utils/httpUtils';
import type { Category, CategoryCreate, CategoryUpdate } from '@/interfaces/categoriesPucharseOrderInterface';

const API_BASE_URL = "http://localhost:5076/api/CategoriesPurchaseOrders";

// Función para obtener las categorías
export default {
  async getCategories(): Promise<Category[]> {
    try {
      return genericRequest<Category[]>('get', `${API_BASE_URL}/get-categories-purchase-orders`, {}, getAuthHeaders());
    } catch (error) {
      console.error("Error obteniendo categorías:", error);
      throw error;
    }
  },

  // Función para crear una categoría
  async createCategory(categoryData: CategoryCreate): Promise<Category> {
    try {
      return genericRequest<Category>('post', `${API_BASE_URL}/create-category-purchase-order`, categoryData, getAuthHeaders());
    } catch (error) {
      console.error("Error creando categoría:", error);
      throw error;
    }
  },

  // Función para actualizar una categoría
  async updateCategory(id: number, categoryData: CategoryUpdate): Promise<Category> {
    try {
      return genericRequest<Category>('put', `${API_BASE_URL}/update-category-purchase-order/${id}`, categoryData, getAuthHeaders());
    } catch (error) {
      console.error("Error actualizando categoría:", error);
      throw error;
    }
  },

  // Función para eliminar completamente una categoría
  async deleteCategory(id: number): Promise<void> {
    try {
      return genericRequest<void>('delete', `${API_BASE_URL}/delete-category-purchase-order/${id}`, {}, getAuthHeaders());
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      throw error;
    }
  },

  // Función para restaurar una categoría
  async restoreCategory(id: number): Promise<void> {
    try {
      return genericRequest<void>('patch', `${API_BASE_URL}/restore-category-purchase-order/${id}`, {}, getAuthHeaders());
    } catch (error) {
      console.error("Error restaurando categoría:", error);
      throw error;
    }
  },
};
