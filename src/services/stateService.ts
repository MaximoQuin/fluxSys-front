// src/services/stateService.ts
import type { State } from "@/interfaces/State";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica
import { useAuthStore } from "@/stores/authStore"; // Importa el store de autenticación

const API_URL = "https://localhost:7002/api/States";

// Exporta las funciones directamente
export async function getStates(): Promise<State[]> {
  return genericRequest<State[]>("get", `${API_URL}/get-states`);
}

export async function createState(name: string): Promise<State> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Recupera el id_company_Id de la sesión

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<State>("post", `${API_URL}/create-state`, {
    name_state: name,
    id_company_Id,
  });
}

export async function updateState(id: number, name: string): Promise<State> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Recupera el id_company_Id de la sesión

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<State>("put", `${API_URL}/update-state/${id}`, {
    name_state: name,
    id_company_Id,
  });
}

export async function deleteState(id: number): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-state/${id}`);
}

export async function restoreState(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-state/${id}`);
}