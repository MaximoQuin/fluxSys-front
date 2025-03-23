// src/services/purchaseOrderService.ts
import type { PurchaseOrder, PurchaseOrderProduct } from "@/interfaces/PurchaseOrder";
import { genericRequest } from "@/utils/httpUtils";

const API_URL = "https://localhost:7002/api/PurchaseOrders";

// Obtener órdenes de compra por compañía
export async function getPurchaseOrdersByCompany(id_company: number): Promise<PurchaseOrder[]> {
  return genericRequest<PurchaseOrder[]>("get", `${API_URL}/get-purchase-orders-by-company/${id_company}`);
}

// Crear una nueva orden de compra
export async function createPurchaseOrder(
  data: {
    name_purchase_order: string;
    id_user_Id: number;
    id_category_purchase_order_Id: number;
    id_department_Id: number;
    id_supplier_Id: number;
    id_state_Id: number;
    id_movement_type_Id: number;
    id_company_Id: number;
    products: Array<{ id_inventory_product_Id: number; quantity: number }>;
  },
  nameUser: string,
  nameDepartment: string
): Promise<PurchaseOrder> {
  return genericRequest<PurchaseOrder>(
    "post",
    `${API_URL}/create-purchase-order?nameUser=${nameUser}&nameDepartment=${nameDepartment}`,
    data
  );
}

// Actualizar una orden de compra
export async function updatePurchaseOrder(
  id: number,
  data: {
    name_purchase_order: string;
    id_user_Id: number;
    id_category_purchase_order_Id: number;
    id_department_Id: number;
    id_supplier_Id: number;
    id_state_Id: number;
    id_movement_type_Id: number;
    id_company_Id: number;
    products: Array<{ id_inventory_product_Id: number; quantity: number }>;
  },
  nameUser: string,
  nameDepartment: string
): Promise<PurchaseOrder> {
  return genericRequest<PurchaseOrder>(
    "put",
    `${API_URL}/update-purchase-order/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`,
    data
  );
}

// Eliminar una orden de compra (eliminación lógica)
export async function deletePurchaseOrder(id: number, nameUser: string, nameDepartment: string): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-purchase-order/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`);
}

// Restaurar una orden de compra
export async function restorePurchaseOrder(id: number, nameUser: string, nameDepartment: string): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-purchase-order/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`);
}