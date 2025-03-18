import { defineStore } from "pinia";
import categoriesService from "@/services/categoriesPurchaseOrdersService";

interface Category {
  id_category_purchase_order: number;
  name_category_purchase_order: string;
  name_company: string;
  delete_log_category_purchase_order: boolean;
}

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        console.log("fetchCategories: Llamando al servicio");
        this.categories = await categoriesService.getCategories();
        console.log("fetchCategories: Categorías obtenidas", this.categories);
      } catch (error) {
        this.error = "Error al obtener categorías.";
        console.error("fetchCategories:", this.error, error);
      } finally {
        this.loading = false;
      }
    },

    async addCategory(categoryData: { name_category_purchase_order: string; id_company_Id: number }) {
      try {
        console.log("Store addCategory: Datos a agregar", categoryData);
        await categoriesService.createCategory(categoryData);
        await this.fetchCategories();
      } catch (error) {
        console.error("Store addCategory: Error al agregar categoría:", error);
      }
    },

    async updateCategory(id: number, categoryData: { name_category_purchase_order: string; id_company_Id: number }) {
      try {
        console.log("Store updateCategory: Actualizando categoría ID", id, "con datos", categoryData);
        await categoriesService.updateCategory(id, categoryData);
        await this.fetchCategories();
      } catch (error) {
        console.error(`Store updateCategory: Error al actualizar categoría con ID ${id}:`, error);
      }
    },

    async softDeleteCategory(id: number) {
      try {
        console.log("Store softDeleteCategory: Eliminando categoría con ID", id);
        await categoriesService.softDeleteCategory(id);
        await this.fetchCategories();
      } catch (error) {
        console.error(`Store softDeleteCategory: Error al eliminar categoría con ID ${id}:`, error);
      }
    },

    async restoreCategory(id: number) {
      try {
        console.log("Store restoreCategory: Restaurando categoría con ID", id);
        await categoriesService.restoreCategory(id);
        await this.fetchCategories();
      } catch (error) {
        console.error(`Store restoreCategory: Error al restaurar categoría con ID ${id}:`, error);
      }
    },
  },
});
