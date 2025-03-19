// src/stores/categoryPurchaseOrderStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { CategoryPurchaseOrder } from "@/interfaces/CategoryPurchaseOrder";
import {
  getCategoriesPurchaseOrders,
  createCategoryPurchaseOrder,
  updateCategoryPurchaseOrder,
  deleteCategoryPurchaseOrder,
  restoreCategoryPurchaseOrder,
} from "@/services/categoryPurchaseOrderService";

export const useCategoryPurchaseOrderStore = defineStore("categoryPurchaseOrder", () => {
  const categoriesPurchaseOrders = ref<CategoryPurchaseOrder[]>([]);
  const loading = ref<boolean>(false);

  const fetchCategoriesPurchaseOrders = async () => {
    loading.value = true;
    try {
      categoriesPurchaseOrders.value = await getCategoriesPurchaseOrders();
    } catch (error) {
      console.error("Error fetching categories purchase orders:", error);
    } finally {
      loading.value = false;
    }
  };

  const addCategoryPurchaseOrder = async (name: string) => {
    const newCategoryPurchaseOrder = await createCategoryPurchaseOrder(name);
    categoriesPurchaseOrders.value.push(newCategoryPurchaseOrder);
  };

  const editCategoryPurchaseOrder = async (id: number, name: string) => {
    const updatedCategoryPurchaseOrder = await updateCategoryPurchaseOrder(id, name);
    const index = categoriesPurchaseOrders.value.findIndex(c => c.id_category_purchase_order === id);
    if (index !== -1) categoriesPurchaseOrders.value[index] = updatedCategoryPurchaseOrder;
  };

  const removeCategoryPurchaseOrder = async (id: number) => {
    await deleteCategoryPurchaseOrder(id);
    categoriesPurchaseOrders.value = categoriesPurchaseOrders.value.filter(c => c.id_category_purchase_order !== id);
  };

  const restoreDeletedCategoryPurchaseOrder = async (id: number) => {
    await restoreCategoryPurchaseOrder(id);
    await fetchCategoriesPurchaseOrders(); // Volver a cargar las categorías
  };

  return {
    categoriesPurchaseOrders,
    loading,
    fetchCategoriesPurchaseOrders,
    addCategoryPurchaseOrder,
    editCategoryPurchaseOrder,
    removeCategoryPurchaseOrder,
    restoreDeletedCategoryPurchaseOrder,
  };
});