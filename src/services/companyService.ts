// src/services/companyService.ts
import type { Company } from "@/interfaces/Company";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica

const API_URL = "https://localhost:7002/api/Companies";

// Exporta las funciones directamente
export async function getCompanies(): Promise<Company[]> {
  return genericRequest<Company[]>("get", `${API_URL}/get-companies`);
}

export async function createCompany(name: string): Promise<Company> {
  return genericRequest<Company>("post", `${API_URL}/create-company`, { name_company: name });
}

export async function updateCompany(id: number, name: string): Promise<Company> {
  return genericRequest<Company>("put", `${API_URL}/update-company/${id}`, { name_company: name });
}

export async function deleteCompany(id: number): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-company/${id}`);
}

export async function restoreCompany(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-company/${id}`);
}
