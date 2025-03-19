// src/services/categorySupplierService.ts
import type { CategorySupplier } from "@/interfaces/CategorySupplier";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica
import { useAuthStore } from "@/stores/authStore"; // Importa el store de autenticación

const API_URL = "https://localhost:7002/api/CategoriesSuppliers";

// Exporta las funciones directamente
export async function getCategoriesSuppliers(): Promise<CategorySupplier[]> {
  return genericRequest<CategorySupplier[]>("get", `${API_URL}/get-categories-suppliers`);
}

export async function createCategorySupplier(name: string): Promise<CategorySupplier> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Recupera el id_company_Id de la sesión

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<CategorySupplier>("post", `${API_URL}/create-category-supplier`, {
    name_category_supplier: name,
    id_company_Id,
  });
}

export async function updateCategorySupplier(id: number, name: string): Promise<CategorySupplier> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Recupera el id_company_Id de la sesión

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<CategorySupplier>("put", `${API_URL}/update-category-supplier/${id}`, {
    name_category_supplier: name,
    id_company_Id,
  });
}

export async function deleteCategorySupplier(id: number): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-category-supplier/${id}`);
}

export async function restoreCategorySupplier(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-category-supplier/${id}`);
}