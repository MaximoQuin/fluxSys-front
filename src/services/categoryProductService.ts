// src/services/categoryProductService.ts
import type { CategoryProduct } from "@/interfaces/CategoryProduct";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica
import { useAuthStore } from "@/stores/authStore"; // Importa el store de autenticación

const API_URL = "https://localhost:7002/api/CategoriesProducts";

// Exporta las funciones directamente
export async function getCategoriesProducts(): Promise<CategoryProduct[]> {
  return genericRequest<CategoryProduct[]>("get", `${API_URL}/get-categories-products`);
}

export async function createCategoryProduct(name: string): Promise<CategoryProduct> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Recupera el id_company_Id de la sesión

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<CategoryProduct>("post", `${API_URL}/create-category-product`, {
    name_category_product: name,
    id_company_Id,
  });
}

export async function updateCategoryProduct(id: number, name: string): Promise<CategoryProduct> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Recupera el id_company_Id de la sesión

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<CategoryProduct>("put", `${API_URL}/update-category-product/${id}`, {
    name_category_product: name,
    id_company_Id,
  });
}

export async function deleteCategoryProduct(id: number): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-category-product/${id}`);
}

export async function restoreCategoryProduct(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-category-product/${id}`);
}