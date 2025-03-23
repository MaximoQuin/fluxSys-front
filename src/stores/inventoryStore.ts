// src/stores/inventoryStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { InventoryProduct } from "@/interfaces/InventoryProduct";
import {
  getInventoriesByCompany,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  restoreInventory,
  generatePDF,
} from "@/services/inventoryService";
import { useAuthStore } from "@/stores/authStore";

export const useInventoryStore = defineStore("inventory", () => {
  const authStore = useAuthStore();
  const inventories = ref<InventoryProduct[]>([]);
  const currentInventory = ref<InventoryProduct | null>(null);
  const loading = ref<boolean>(false);

  // Obtener inventario por compañía
  const fetchInventories = async () => {
    loading.value = true;
    try {
      const id_company = authStore.user?.company?.id_company; // Acceso correcto
      if (!id_company) throw new Error("No se pudo obtener el id_company del usuario.");
      inventories.value = await getInventoriesByCompany(id_company);
    } catch (error) {
      console.error("Error fetching inventories:", error);
    } finally {
      loading.value = false;
    }
  };

  // Obtener detalles de un producto
  const fetchInventoryById = async (id: number) => {
    try {
      currentInventory.value = await getInventoryById(id);
    } catch (error) {
      console.error("Error fetching inventory by id:", error);
    }
  };

  // Crear un nuevo producto
  const addInventory = async (data: any) => {
    const nameUser = authStore.user?.name_user || ""; // Acceso correcto
    const nameDepartment = authStore.user?.department?.name_department || ""; // Acceso correcto
    await createInventory(data, nameUser, nameDepartment);
    await fetchInventories(); // Refrescar la lista
  };

  // Actualizar un producto
  const editInventory = async (id: number, data: any) => {
    const nameUser = authStore.user?.name_user || ""; // Acceso correcto
    const nameDepartment = authStore.user?.department?.name_department || ""; // Acceso correcto
    await updateInventory(id, data, nameUser, nameDepartment);
    await fetchInventories(); // Refrescar la lista
  };

  // Eliminar un producto
  const removeInventory = async (id: number) => {
    const nameUser = authStore.user?.name_user || ""; // Acceso correcto
    const nameDepartment = authStore.user?.department?.name_department || ""; // Acceso correcto
    await deleteInventory(id, nameUser, nameDepartment);
    await fetchInventories(); // Refrescar la lista
  };

  // Restaurar un producto
  const restoreDeletedInventory = async (id: number) => {
    const nameUser = authStore.user?.name_user || ""; // Acceso correcto
    const nameDepartment = authStore.user?.department?.name_department || ""; // Acceso correcto
    await restoreInventory(id, nameUser, nameDepartment);
    await fetchInventories(); // Refrescar la lista
  };

  // Generar PDF
  const downloadPDF = async () => {
    try {
      const companyName = authStore.user?.company?.name_company || "";
      const departmentName = authStore.user?.department?.name_department || "";
  
      console.log("Descargando PDF para:", companyName, departmentName); // Depuración
  
      // Llama al servicio para obtener el PDF
      const blob = await generatePDF(companyName, departmentName);
  
      console.log("PDF recibido:", blob); // Depuración
  
      // Verifica que el Blob sea válido
      if (!(blob instanceof Blob)) {
        throw new Error("La respuesta no es un Blob válido.");
      }
  
      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Inventario_${companyName}_${departmentName}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Liberar el objeto URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      alert("Hubo un error al descargar el PDF. Por favor, intenta nuevamente.");
    }
  };

  return {
    inventories,
    currentInventory,
    loading,
    fetchInventories,
    fetchInventoryById,
    addInventory,
    editInventory,
    removeInventory,
    restoreDeletedInventory,
    downloadPDF,
  };
});