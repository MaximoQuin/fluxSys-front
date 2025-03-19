// src/services/categoryPurchaseOrderService.ts
import type { CategoryPurchaseOrder } from "@/interfaces/CategoryPurchaseOrder";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica
import { useAuthStore } from "@/stores/authStore"; // Importa el store de autenticación

const API_URL = "https://localhost:7002/api/CategoriesPurchaseOrders";

// Exporta las funciones directamente
export async function getCategoriesPurchaseOrders(): Promise<CategoryPurchaseOrder[]> {
  return genericRequest<CategoryPurchaseOrder[]>("get", `${API_URL}/get-categories-purchase-orders`);
}

export async function createCategoryPurchaseOrder(name: string): Promise<CategoryPurchaseOrder> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Accede a company.id_company

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<CategoryPurchaseOrder>("post", `${API_URL}/create-category-purchase-order`, {
    name_category_purchase_order: name,
    id_company_Id,
  });
}

export async function updateCategoryPurchaseOrder(id: number, name: string): Promise<CategoryPurchaseOrder> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Accede a company.id_company

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<CategoryPurchaseOrder>("put", `${API_URL}/update-category-purchase-order/${id}`, {
    name_category_purchase_order: name,
    id_company_Id,
  });
}

export async function deleteCategoryPurchaseOrder(id: number): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-category-purchase-order/${id}`);
}

export async function restoreCategoryPurchaseOrder(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-category-purchase-order/${id}`);
}