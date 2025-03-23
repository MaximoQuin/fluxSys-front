// src/stores/invoiceStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Invoice, InvoiceProduct } from "@/interfaces/Invoice";
import {
  getInvoicesByCompany,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  restoreInvoice,
} from "@/services/invoiceService";
import { useAuthStore } from "@/stores/authStore";

export const useInvoiceStore = defineStore("invoice", () => {
  const authStore = useAuthStore();

  const invoices = ref<Invoice[]>([]);
  const currentInvoice = ref<Invoice | null>(null);
  const loading = ref<boolean>(false);

  // Obtener facturas por compañía
  const fetchInvoices = async () => {
    loading.value = true;
    try {
      const id_company = authStore.user?.company?.id_company;
      if (!id_company) throw new Error("No se pudo obtener el id_company del usuario.");
      invoices.value = await getInvoicesByCompany(id_company);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      loading.value = false;
    }
  };

  // Crear una nueva factura
  const addInvoice = async (data: {
    name_invoice: string;
    id_purchase_order_Id: number;
    id_supplier_Id: number;
    id_department_Id: number;
    products: Array<{ id_inventory_product_Id: number; quantity: number }>;
  }) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    const id_company = authStore.user?.company?.id_company || 0;

    await createInvoice({ ...data, id_company_Id: id_company }, nameUser, nameDepartment);
    await fetchInvoices(); // Refrescar la lista
  };

  // Actualizar una factura
  const editInvoice = async (id: number, data: {
    name_invoice: string;
    id_purchase_order_Id: number;
    id_supplier_Id: number;
    id_department_Id: number;
    products: Array<{ id_inventory_product_Id: number; quantity: number }>;
  }) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    const id_company = authStore.user?.company?.id_company || 0;

    await updateInvoice(id, { ...data, id_company_Id: id_company }, nameUser, nameDepartment);
    await fetchInvoices(); // Refrescar la lista
  };

  // Eliminar una factura
  const removeInvoice = async (id: number) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    await deleteInvoice(id, nameUser, nameDepartment);
    await fetchInvoices(); // Refrescar la lista
  };

  // Restaurar una factura
  const restoreDeletedInvoice = async (id: number) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    await restoreInvoice(id, nameUser, nameDepartment);
    await fetchInvoices(); // Refrescar la lista
  };

  return {
    invoices,
    currentInvoice,
    loading,
    fetchInvoices,
    addInvoice,
    editInvoice,
    removeInvoice,
    restoreDeletedInvoice,
  };
});