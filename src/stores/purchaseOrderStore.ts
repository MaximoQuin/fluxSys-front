// src/stores/purchaseOrderStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { PurchaseOrder, PurchaseOrderProduct } from "@/interfaces/PurchaseOrder";
import {
  getPurchaseOrdersByCompany,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  restorePurchaseOrder,
} from "@/services/purchaseOrderService";
import { useAuthStore } from "@/stores/authStore";

export const usePurchaseOrderStore = defineStore("purchaseOrder", () => {
  const authStore = useAuthStore();

  const purchaseOrders = ref<PurchaseOrder[]>([]);
  const currentPurchaseOrder = ref<PurchaseOrder | null>(null);
  const loading = ref<boolean>(false);

  // Obtener órdenes de compra por compañía
  const fetchPurchaseOrders = async () => {
    loading.value = true;
    try {
      const id_company = authStore.user?.company?.id_company;
      if (!id_company) throw new Error("No se pudo obtener el id_company del usuario.");
      purchaseOrders.value = await getPurchaseOrdersByCompany(id_company);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      loading.value = false;
    }
  };

  // Crear una nueva orden de compra
  const addPurchaseOrder = async (data: {
    name_purchase_order: string;
    id_user_Id: number;
    id_category_purchase_order_Id: number;
    id_department_Id: number;
    id_supplier_Id: number;
    id_state_Id: number;
    id_movement_type_Id: number;
    products: Array<{ id_inventory_product_Id: number; quantity: number }>;
  }) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    const id_company = authStore.user?.company?.id_company || 0;

    await createPurchaseOrder({ ...data, id_company_Id: id_company }, nameUser, nameDepartment);
    await fetchPurchaseOrders(); // Refrescar la lista
  };

  // Actualizar una orden de compra
  const editPurchaseOrder = async (id: number, data: {
    name_purchase_order: string;
    id_user_Id: number;
    id_category_purchase_order_Id: number;
    id_department_Id: number;
    id_supplier_Id: number;
    id_state_Id: number;
    id_movement_type_Id: number;
    products: Array<{ id_inventory_product_Id: number; quantity: number }>;
  }) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    const id_company = authStore.user?.company?.id_company || 0;

    await updatePurchaseOrder(id, { ...data, id_company_Id: id_company }, nameUser, nameDepartment);
    await fetchPurchaseOrders(); // Refrescar la lista
  };

  // Eliminar una orden de compra
  const removePurchaseOrder = async (id: number) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    await deletePurchaseOrder(id, nameUser, nameDepartment);
    await fetchPurchaseOrders(); // Refrescar la lista
  };

  // Restaurar una orden de compra
  const restoreDeletedPurchaseOrder = async (id: number) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    await restorePurchaseOrder(id, nameUser, nameDepartment);
    await fetchPurchaseOrders(); // Refrescar la lista
  };

  return {
    purchaseOrders,
    currentPurchaseOrder,
    loading,
    fetchPurchaseOrders,
    addPurchaseOrder,
    editPurchaseOrder,
    removePurchaseOrder,
    restoreDeletedPurchaseOrder,
  };
});