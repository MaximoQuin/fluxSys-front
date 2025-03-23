// src/services/invoiceService.ts
import type { Invoice } from "@/interfaces/Invoice";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica
import { useAuthStore } from "@/stores/authStore"; // Importa el store de autenticación

const API_URL = "https://localhost:7002/api/Invoices";

// Obtener facturas por compañía o todas las facturas si es Administrador
export async function getInvoicesByCompany(): Promise<Invoice[]> {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (!user) {
    throw new Error("No se pudo obtener la información del usuario.");
  }

  // Si el usuario es Administrador, usa el endpoint que trae todas las facturas
  if (user.role.name_role === "Administrador") {
    return genericRequest<Invoice[]>("get", `${API_URL}/get-invoices`);
  } else {
    // Si no es Administrador, usa el endpoint que trae las facturas por compañía
    return genericRequest<Invoice[]>("get", `${API_URL}/get-invoices-by-company/${user.company.id_company}`);
  }
}

// Crear una nueva factura
export async function createInvoice(
  data: {
    name_invoice: string;
    id_purchase_order_Id: number;
    id_supplier_Id: number;
    id_department_Id: number;
    id_company_Id: number;
    products: Array<{ id_inventory_product_Id: number; quantity: number }>;
  },
  nameUser: string,
  nameDepartment: string
): Promise<Invoice> {
  return genericRequest<Invoice>(
    "post",
    `${API_URL}/create-invoice?nameUser=${nameUser}&nameDepartment=${nameDepartment}`,
    data
  );
}

// Actualizar una factura
export async function updateInvoice(
  id: number,
  data: {
    name_invoice: string;
    id_purchase_order_Id: number;
    id_supplier_Id: number;
    id_department_Id: number;
    id_company_Id: number;
    products: Array<{ id_inventory_product_Id: number; quantity: number }>;
  },
  nameUser: string,
  nameDepartment: string
): Promise<Invoice> {
  return genericRequest<Invoice>(
    "put",
    `${API_URL}/update-invoice/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`,
    data
  );
}

// Eliminar una factura (eliminación lógica)
export async function deleteInvoice(id: number, nameUser: string, nameDepartment: string): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-invoice/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`);
}

// Restaurar una factura
export async function restoreInvoice(id: number, nameUser: string, nameDepartment: string): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-invoice/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`);
}