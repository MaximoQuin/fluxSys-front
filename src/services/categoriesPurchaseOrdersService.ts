import axios from "axios";

interface Category {
  id_category_purchase_order: number;
  name_category_purchase_order: string;
  name_company: string;
  delete_log_category_purchase_order: boolean;
}

interface CategoryCreate {
  name_category_purchase_order: string;
  id_company_Id: number;
}

interface CategoryUpdate {
  name_category_purchase_order: string;
  id_company_Id: number;
}

const API_BASE_URL = "http://localhost:5076/api/CategoriesPurchaseOrders";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export default {
  async getCategories(): Promise<Category[]> {
    try {
      console.log("getCategories: Llamando a GET", `${API_BASE_URL}/get-categories-purchase-orders`);
      const response = await axios.get<Category[]>(
        `${API_BASE_URL}/get-categories-purchase-orders`,
        { headers: getAuthHeaders() }
      );
      console.log("getCategories: Datos recibidos", response.data);
      return response.data;
    } catch (error) {
      console.error("getCategories: Error obteniendo categorías:", error);
      throw error;
    }
  },

  async createCategory(categoryData: CategoryCreate) {
    try {
      console.log("createCategory: Enviando datos", categoryData);
      const response = await axios.post(`${API_BASE_URL}`, categoryData, {
        headers: getAuthHeaders(),
      });
      console.log("createCategory: Respuesta exitosa", response.data);
      return response.data;
    } catch (error) {
      console.error("createCategory: Error creando categoría:", error);
      throw error;
    }
  },

  async updateCategory(id: number, categoryData: CategoryUpdate) {
    try {
      console.log("updateCategory: Actualizando categoría con ID", id, "con datos", categoryData);
      const response = await axios.put(`${API_BASE_URL}/${id}`, categoryData, {
        headers: getAuthHeaders(),
      });
      console.log("updateCategory: Respuesta exitosa", response.data);
      return response.data;
    } catch (error) {
      console.error(`updateCategory: Error actualizando categoría con ID ${id}:`, error);
      throw error;
    }
  },

  async softDeleteCategory(id: number) {
    try {
      console.log("softDeleteCategory: Eliminando categoría con ID", id);
      const response = await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: getAuthHeaders(),
      });
      console.log("softDeleteCategory: Respuesta exitosa", response.data);
      return response.data;
    } catch (error) {
      console.error(`softDeleteCategory: Error eliminando categoría con ID ${id}:`, error);
      throw error;
    }
  },

  async restoreCategory(id: number) {
    try {
      console.log("restoreCategory: Restaurando categoría con ID", id);
      const response = await axios.put(`${API_BASE_URL}/restore/${id}`, null, {
        headers: getAuthHeaders(),
      });
      console.log("restoreCategory: Respuesta exitosa", response.data);
      return response.data;
    } catch (error) {
      console.error(`restoreCategory: Error restaurando categoría con ID ${id}:`, error);
      throw error;
    }
  },
};
