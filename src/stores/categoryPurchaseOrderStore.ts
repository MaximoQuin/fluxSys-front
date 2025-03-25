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
      const response = await getCategoriesPurchaseOrders();
      // Asegurarse de mapear correctamente la compañía
      categoriesPurchaseOrders.value = response.map((cat: any) => ({
        ...cat,
        id_company_Id: cat.company?.id_company || cat.id_company_Id
      }));
    } catch (error) {
      console.error("Error fetching categories purchase orders:", error);
      throw error; // Propagar el error para manejo en componentes
    } finally {
      loading.value = false;
    }
  };

  const addCategoryPurchaseOrder = async (name: string, id_company: number) => {
    try {
      loading.value = true;
      const newCategory = await createCategoryPurchaseOrder(name, id_company);
      categoriesPurchaseOrders.value.push({
        ...newCategory,
        id_company_Id: id_company
      });
      return newCategory;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const editCategoryPurchaseOrder = async (id: number, name: string, id_company: number) => {
    try {
      loading.value = true;
      const updatedCategory = await updateCategoryPurchaseOrder(id, name, id_company);
      const index = categoriesPurchaseOrders.value.findIndex(
        c => c.id_category_purchase_order === id
      );
      
      if (index !== -1) {
        categoriesPurchaseOrders.value[index] = {
          ...updatedCategory,
          id_company_Id: id_company
        };
      }
      return updatedCategory;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const removeCategoryPurchaseOrder = async (id: number) => {
    try {
      loading.value = true;
      await deleteCategoryPurchaseOrder(id);
      categoriesPurchaseOrders.value = categoriesPurchaseOrders.value.filter(
        c => c.id_category_purchase_order !== id
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const restoreDeletedCategoryPurchaseOrder = async (id: number) => {
    try {
      loading.value = true;
      await restoreCategoryPurchaseOrder(id);
      await fetchCategoriesPurchaseOrders();
    } catch (error) {
      console.error("Error restoring category:", error);
      throw error;
    } finally {
      loading.value = false;
    }
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