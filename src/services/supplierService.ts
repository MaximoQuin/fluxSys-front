// src/services/supplierService.ts
import type { Supplier, SupplierProduct } from "@/interfaces/Supplier";
import { genericRequest } from "@/utils/httpUtils";

const API_URL = "https://localhost:7002/api/Suppliers";

// Obtener proveedores por compañía
export async function getSuppliersByCompany(id_company: number): Promise<Supplier[]> {
  return genericRequest<Supplier[]>("get", `${API_URL}/get-suppliers-by-company/${id_company}`);
}

// Obtener detalles de un proveedor por ID
export async function getSupplierById(id: number): Promise<Supplier> {
  return genericRequest<Supplier>("get", `${API_URL}/get-supplier-by-id/${id}`);
}

// Crear un nuevo proveedor
export async function createSupplier(
  data: {
    name_supplier: string;
    mail_supplier: string;
    phone_supplier: number;
    id_category_supplier_Id: number;
    id_company_Id: number;
    products: SupplierProduct[];
  },
  nameUser: string,
  nameDepartment: string
): Promise<Supplier> {
  return genericRequest<Supplier>(
    "post",
    `${API_URL}/create-supplier?nameUser=${nameUser}&nameDepartment=${nameDepartment}`,
    data
  );
}

// Actualizar un proveedor
export async function updateSupplier(
  id: number,
  data: {
    name_supplier: string;
    mail_supplier: string;
    phone_supplier: number;
    id_category_supplier_Id: number;
    id_company_Id: number;
    products: SupplierProduct[];
  },
  nameUser: string,
  nameDepartment: string
): Promise<Supplier> {
  return genericRequest<Supplier>(
    "put",
    `${API_URL}/update-supplier/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`,
    data
  );
}

// Eliminar un proveedor (eliminación lógica)
export async function deleteSupplier(id: number, nameUser: string, nameDepartment: string): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-supplier/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`);
}

// Restaurar un proveedor
export async function restoreSupplier(id: number, nameUser: string, nameDepartment: string): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-supplier/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`);
}