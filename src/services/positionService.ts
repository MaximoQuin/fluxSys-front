// src/services/positionService.ts
import type { Position } from "@/interfaces/Position";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica
import { useAuthStore } from "@/stores/authStore"; // Importa el store de autenticación

const API_URL = "https://localhost:7002/api/Positions";

// Exporta las funciones directamente
export async function getPositions(): Promise<Position[]> {
  return genericRequest<Position[]>("get", `${API_URL}/get-positions`);
}

export async function createPosition(name: string): Promise<Position> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Recupera el id_company_Id de la sesión

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<Position>("post", `${API_URL}/create-position`, {
    name_position: name,
    id_company_Id,
  });
}

export async function updatePosition(id: number, name: string): Promise<Position> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company; // Recupera el id_company_Id de la sesión

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<Position>("put", `${API_URL}/update-position/${id}`, {
    name_position: name,
    id_company_Id,
  });
}

export async function deletePosition(id: number): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-position/${id}`);
}

export async function restorePosition(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-position/${id}`);
}