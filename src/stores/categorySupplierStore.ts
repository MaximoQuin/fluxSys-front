// src/stores/categorySupplierStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { CategorySupplier } from "@/interfaces/CategorySupplier";
import {
  getCategoriesSuppliers,
  createCategorySupplier,
  updateCategorySupplier,
  deleteCategorySupplier,
  restoreCategorySupplier,
} from "@/services/categorySupplierService";

export const useCategorySupplierStore = defineStore("categorySupplier", () => {
  const categoriesSuppliers = ref<CategorySupplier[]>([]);
  const loading = ref<boolean>(false);

  const fetchCategoriesSuppliers = async () => {
    loading.value = true;
    try {
      categoriesSuppliers.value = await getCategoriesSuppliers();
    } catch (error) {
      console.error("Error fetching categories suppliers:", error);
    } finally {
      loading.value = false;
    }
  };

  const addCategorySupplier = async (name: string) => {
    const newCategorySupplier = await createCategorySupplier(name);
    categoriesSuppliers.value.push(newCategorySupplier);
  };

  const editCategorySupplier = async (id: number, name: string) => {
    const updatedCategorySupplier = await updateCategorySupplier(id, name);
    const index = categoriesSuppliers.value.findIndex(c => c.id_category_supplier === id);
    if (index !== -1) categoriesSuppliers.value[index] = updatedCategorySupplier;
  };

  const removeCategorySupplier = async (id: number) => {
    await deleteCategorySupplier(id);
    categoriesSuppliers.value = categoriesSuppliers.value.filter(c => c.id_category_supplier !== id);
  };

  const restoreDeletedCategorySupplier = async (id: number) => {
    await restoreCategorySupplier(id);
    await fetchCategoriesSuppliers(); // Volver a cargar las categorías
  };

  return {
    categoriesSuppliers,
    loading,
    fetchCategoriesSuppliers,
    addCategorySupplier,
    editCategorySupplier,
    removeCategorySupplier,
    restoreDeletedCategorySupplier,
  };
});