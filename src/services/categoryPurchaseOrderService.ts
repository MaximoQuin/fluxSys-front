// src/services/categoryPurchaseOrderService.ts
import type { CategoryPurchaseOrder } from "@/interfaces/CategoryPurchaseOrder";
import { genericRequest } from "@/utils/httpUtils";
import { useAuthStore } from "@/stores/authStore";

const API_URL = "https://localhost:7002/api/CategoriesPurchaseOrders";

export async function getCategoriesPurchaseOrders(): Promise<CategoryPurchaseOrder[]> {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (!user) {
    throw new Error("No se pudo obtener la información del usuario.");
  }

  if (user.role.name_role === "Administrador") {
    return genericRequest<CategoryPurchaseOrder[]>("get", `${API_URL}/get-categories-purchase-orders`);
  } else {
    return genericRequest<CategoryPurchaseOrder[]>("get", `${API_URL}/get-categories-purchase-orders-by-company/${user.company.id_company}`);
  }
}

export async function createCategoryPurchaseOrder(
  name: string, 
  id_company_Id?: number // Hacer este parámetro opcional
): Promise<CategoryPurchaseOrder> {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (!user) {
    throw new Error("No se pudo obtener la información del usuario.");
  }

  // Si no se proporciona id_company_Id y el usuario no es admin, usar la compañía del usuario
  const companyId = id_company_Id ?? user.company?.id_company;

  if (!companyId) {
    throw new Error("No se pudo obtener el id_company_Id.");
  }

  return genericRequest<CategoryPurchaseOrder>("post", `${API_URL}/create-category-purchase-order`, {
    name_category_purchase_order: name,
    id_company_Id: companyId,
  });
}

export async function updateCategoryPurchaseOrder(
  id: number, 
  name: string,
  id_company_Id?: number // Hacer este parámetro opcional
): Promise<CategoryPurchaseOrder> {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (!user) {
    throw new Error("No se pudo obtener la información del usuario.");
  }

  // Para actualización, usar el id_company_Id proporcionado si es admin, sino la compañía del usuario
  const companyId = user.role.name_role === "Administrador" 
    ? id_company_Id ?? user.company?.id_company
    : user.company?.id_company;

  if (!companyId) {
    throw new Error("No se pudo obtener el id_company_Id.");
  }

  return genericRequest<CategoryPurchaseOrder>("put", `${API_URL}/update-category-purchase-order/${id}`, {
    name_category_purchase_order: name,
    id_company_Id: companyId,
  });
}


export async function deleteCategoryPurchaseOrder(id: number): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-category-purchase-order/${id}`);
}

export async function restoreCategoryPurchaseOrder(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-category-purchase-order/${id}`);
}