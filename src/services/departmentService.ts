import type { Department, DepartmentCreate, DepartmentUpdate } from "@/interfaces/Department";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica

const API_URL = "https://localhost:7002/api/Departments";

// Exporta las funciones directamente
export async function getDepartments(): Promise<Department[]> {
  return genericRequest<Department[]>("get", `${API_URL}/get-departments`);
}

export async function createDepartment(department: DepartmentCreate): Promise<void> {
  await genericRequest<void>("post", `${API_URL}/create-department`, department);
}

export async function updateDepartment(id: number, department: DepartmentUpdate): Promise<void> {
  await genericRequest<void>("put", `${API_URL}/update-department/${id}`, department);
}

export async function deleteDepartment(id: number): Promise<void> {
  await genericRequest<void>("delete", `${API_URL}/delete-department/${id}`);
}

export async function restoreDepartment(id: number): Promise<void> {
  await genericRequest<void>("patch", `${API_URL}/restore-department/${id}`);
}
