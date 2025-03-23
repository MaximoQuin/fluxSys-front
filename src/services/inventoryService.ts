// src/services/inventoryService.ts
import type { InventoryProduct, Supplier } from "@/interfaces/InventoryProduct";
import { genericRequest } from "@/utils/httpUtils";
import { useAuthStore } from "@/stores/authStore";

const API_URL = "https://localhost:7002/api/Inventories";

// Obtener inventario por compañía
export async function getInventoriesByCompany(id_company: number): Promise<InventoryProduct[]> {
  return genericRequest<InventoryProduct[]>("get", `${API_URL}/get-inventories-by-company/${id_company}`);
}

// Obtener detalles de un producto por ID
export async function getInventoryById(id: number): Promise<InventoryProduct> {
  return genericRequest<InventoryProduct>("get", `${API_URL}/get-inventory-by-id/${id}`);
}

// Crear un nuevo producto en el inventario
export async function createInventory(data: any, nameUser: string, nameDepartment: string): Promise<InventoryProduct> {
  return genericRequest<InventoryProduct>("post", `${API_URL}/create-inventory?nameUser=${nameUser}&nameDepartment=${nameDepartment}`, data);
}

// Actualizar un producto en el inventario
export async function updateInventory(id: number, data: any, nameUser: string, nameDepartment: string): Promise<InventoryProduct> {
  return genericRequest<InventoryProduct>("put", `${API_URL}/update-inventory/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`, data);
}

// Eliminar un producto (eliminación lógica)
export async function deleteInventory(id: number, nameUser: string, nameDepartment: string): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-inventory/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`);
}

// Restaurar un producto
export async function restoreInventory(id: number, nameUser: string, nameDepartment: string): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-inventory/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`);
}

// Generar PDF
export async function generatePDF(companyName: string, departmentName: string): Promise<Blob> {
  try {
    const response = await genericRequest<Blob>(
      "get",
      `${API_URL}/generate-pdf?companyName=${encodeURIComponent(companyName)}&departmentName=${encodeURIComponent(departmentName)}`,
      null,
      {
        responseType: "blob", // Asegúrate de que la respuesta sea un Blob
      }
    );

    console.log("Respuesta del backend:", response); // Depuración
    return response;
  } catch (error) {
    console.error("Error en generatePDF:", error);
    throw error;
  }
}