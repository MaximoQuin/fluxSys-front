// src/stores/supplierStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Supplier, SupplierProduct } from "@/interfaces/Supplier";
import {
  getSuppliersByCompany,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  restoreSupplier,
} from "@/services/supplierService";
import { useAuthStore } from "@/stores/authStore";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useCategorySupplierStore } from "@/stores/categorySupplierStore";

export const useSupplierStore = defineStore("supplier", () => {
  const authStore = useAuthStore();
  const inventoryStore = useInventoryStore();
  const categorySupplierStore = useCategorySupplierStore();

  const suppliers = ref<Supplier[]>([]);
  const currentSupplier = ref<Supplier | null>(null);
  const loading = ref<boolean>(false);

  // Obtener proveedores por compañía
  const fetchSuppliers = async () => {
    loading.value = true;
    try {
      const id_company = authStore.user?.company?.id_company;
      if (!id_company) throw new Error("No se pudo obtener el id_company del usuario.");
      suppliers.value = await getSuppliersByCompany(id_company);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      loading.value = false;
    }
  };

  // Obtener detalles de un proveedor
  const fetchSupplierById = async (id: number) => {
    try {
      currentSupplier.value = await getSupplierById(id);
    } catch (error) {
      console.error("Error fetching supplier by id:", error);
    }
  };

  // Crear un nuevo proveedor
  const addSupplier = async (data: {
    name_supplier: string;
    mail_supplier: string;
    phone_supplier: number;
    id_category_supplier_Id: number;
    products: SupplierProduct[];
  }) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    const id_company = authStore.user?.company?.id_company || 0;

    await createSupplier({ ...data, id_company_Id: id_company }, nameUser, nameDepartment);
    await fetchSuppliers(); // Refrescar la lista
  };

  // Actualizar un proveedor
  const editSupplier = async (id: number, data: {
    name_supplier: string;
    mail_supplier: string;
    phone_supplier: number;
    id_category_supplier_Id: number;
    products: SupplierProduct[];
  }) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    const id_company = authStore.user?.company?.id_company || 0;

    await updateSupplier(id, { ...data, id_company_Id: id_company }, nameUser, nameDepartment);
    await fetchSuppliers(); // Refrescar la lista
  };

  // Eliminar un proveedor
  const removeSupplier = async (id: number) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    await deleteSupplier(id, nameUser, nameDepartment);
    await fetchSuppliers(); // Refrescar la lista
  };

  // Restaurar un proveedor
  const restoreDeletedSupplier = async (id: number) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    await restoreSupplier(id, nameUser, nameDepartment);
    await fetchSuppliers(); // Refrescar la lista
  };

  return {
    suppliers,
    currentSupplier,
    loading,
    fetchSuppliers,
    fetchSupplierById,
    addSupplier,
    editSupplier,
    removeSupplier,
    restoreDeletedSupplier,
  };
});