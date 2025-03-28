// src/services/departmentService.ts
import type { Department } from "@/interfaces/Department";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica
import { useAuthStore } from "@/stores/authStore"; // Importa el store de autenticación

const API_URL = "https://localhost:7002/api/Departments";

// Exporta las funciones directamente
export async function getDepartments(): Promise<Department[]> {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (!user) {
    throw new Error("No se pudo obtener la información del usuario.");
  }

  // Si el usuario es Administrador, usa el endpoint que trae todos los departamentos
  if (user.role.name_role === "Administrador") {
    return genericRequest<Department[]>("get", `${API_URL}/get-departments`);
  } else {
    // Si no es Administrador, usa el endpoint que trae los departamentos por compañía
    return genericRequest<Department[]>("get", `${API_URL}/get-departments-by-company/${user.company.id_company}`);
  }
}

export async function createDepartment(name: string): Promise<Department> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Recupera el id_company_Id de la sesión

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<Department>("post", `${API_URL}/create-department`, {
    name_deparment: name,
    id_company_Id,
  });
}

export async function updateDepartment(id: number, name: string): Promise<Department> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Recupera el id_company_Id de la sesión

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<Department>("put", `${API_URL}/update-department/${id}`, {
    name_deparment: name,
    id_company_Id,
  });
}

export async function deleteDepartment(id: number): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-department/${id}`);
}

export async function restoreDepartment(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-department/${id}`);
}