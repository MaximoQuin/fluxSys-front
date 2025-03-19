import { defineStore } from "pinia";
import { ref } from "vue";
import categoriesService from "@/services/categoriesPurchaseOrdersService";
import type { Category, CategoryCreate, CategoryUpdate } from '@/interfaces/categoriesPucharseOrderInterface';

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<Category[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Acción para obtener las categorías
  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      console.log("fetchCategories: Llamando al servicio");
      categories.value = await categoriesService.getCategories();
      console.log("fetchCategories: Categorías obtenidas", categories.value);
    } catch (err) {
      error.value = "Error al obtener categorías.";
      console.error("fetchCategories:", error.value, err);
    } finally {
      loading.value = false;
    }
  };

  // Acción para agregar una nueva categoría
  const addCategory = async (categoryData: CategoryCreate) => {
    try {
      console.log("addCategory: Datos a agregar", categoryData);
      await categoriesService.createCategory(categoryData);
      await fetchCategories();  // Actualizamos la lista de categorías después de agregar
    } catch (err) {
      error.value = "Error al agregar la categoría.";
      console.error("addCategory: Error al agregar categoría:", err);
    }
  };

  // Acción para actualizar una categoría existente
  const updateCategory = async (id: number, categoryData: CategoryUpdate) => {
    try {
      console.log("updateCategory: Actualizando categoría ID", id, "con datos", categoryData);
      await categoriesService.updateCategory(id, categoryData);
      await fetchCategories();  // Actualizamos la lista de categorías después de actualizar
    } catch (err) {
      error.value = `Error al actualizar categoría con ID ${id}.`;
      console.error(`updateCategory: Error al actualizar categoría con ID ${id}:`, err);
    }
  };

  // Acción para eliminar (soft delete) una categoría
  const deleteCategory = async (id: number) => {
    try {
      console.log("deleteCategory: Eliminando categoría con ID", id);
      await categoriesService.deleteCategory(id);
      await fetchCategories();  // Actualizamos la lista de categorías después de eliminar
    } catch (err) {
      error.value = "Error al eliminar la categoría.";
      console.error("deleteCategory: Error al eliminar categoría:", err);
    }
  };

  // Acción para restaurar una categoría eliminada
  const restoreCategory = async (id: number) => {
    try {
      console.log("restoreCategory: Restaurando categoría con ID", id);
      await categoriesService.restoreCategory(id);
      await fetchCategories();  // Actualizamos la lista de categorías después de restaurar
    } catch (err) {
      error.value = "Error al restaurar la categoría.";
      console.error("restoreCategory: Error al restaurar categoría:", err);
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    restoreCategory,
  };
});
