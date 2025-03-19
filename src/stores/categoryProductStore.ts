// src/stores/categoryProductStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { CategoryProduct } from "@/interfaces/CategoryProduct";
import {
  getCategoriesProducts,
  createCategoryProduct,
  updateCategoryProduct,
  deleteCategoryProduct,
  restoreCategoryProduct,
} from "@/services/categoryProductService";

export const useCategoryProductStore = defineStore("categoryProduct", () => {
  const categoriesProducts = ref<CategoryProduct[]>([]);
  const loading = ref<boolean>(false);

  const fetchCategoriesProducts = async () => {
    loading.value = true;
    try {
      categoriesProducts.value = await getCategoriesProducts();
    } catch (error) {
      console.error("Error fetching categories products:", error);
    } finally {
      loading.value = false;
    }
  };

  const addCategoryProduct = async (name: string) => {
    const newCategoryProduct = await createCategoryProduct(name);
    categoriesProducts.value.push(newCategoryProduct);
  };

  const editCategoryProduct = async (id: number, name: string) => {
    const updatedCategoryProduct = await updateCategoryProduct(id, name);
    const index = categoriesProducts.value.findIndex(c => c.id_category_product === id);
    if (index !== -1) categoriesProducts.value[index] = updatedCategoryProduct;
  };

  const removeCategoryProduct = async (id: number) => {
    await deleteCategoryProduct(id);
    categoriesProducts.value = categoriesProducts.value.filter(c => c.id_category_product !== id);
  };

  const restoreDeletedCategoryProduct = async (id: number) => {
    await restoreCategoryProduct(id);
    await fetchCategoriesProducts(); // Volver a cargar las categorías
  };

  return {
    categoriesProducts,
    loading,
    fetchCategoriesProducts,
    addCategoryProduct,
    editCategoryProduct,
    removeCategoryProduct,
    restoreDeletedCategoryProduct,
  };
});