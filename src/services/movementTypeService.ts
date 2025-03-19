// src/services/movementTypeService.ts
import type { MovementType, ClasificationMovement } from "@/interfaces/MovementType";
import { genericRequest } from "@/utils/httpUtils";
import { useAuthStore } from "@/stores/authStore";

const API_URL = "https://localhost:7002/api";

// Obtener tipos de movimiento
export async function getMovementsTypes(): Promise<MovementType[]> {
  return genericRequest<MovementType[]>("get", `${API_URL}/MovementsTypes/get-movements-types`);
}

// Crear tipo de movimiento
export async function createMovementType(name: string, id_clasification_movement_Id: number): Promise<MovementType> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company;

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<MovementType>("post", `${API_URL}/MovementsTypes/create-movement-type`, {
    name_movement_type: name,
    id_company_Id,
    id_clasification_movement_Id,
  });
}

// Actualizar tipo de movimiento
export async function updateMovementType(id: number, name: string, id_clasification_movement_Id: number): Promise<MovementType> {
  const authStore = useAuthStore();
  const id_company_Id = authStore.user?.company?.id_company;

  if (!id_company_Id) {
    throw new Error("No se pudo obtener el id_company_Id del usuario.");
  }

  return genericRequest<MovementType>("put", `${API_URL}/MovementsTypes/update-movement-type/${id}`, {
    name_movement_type: name,
    id_company_Id,
    id_clasification_movement_Id,
  });
}

// Eliminar tipo de movimiento
export async function deleteMovementType(id: number): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/MovementsTypes/delete-movement-type/${id}`);
}

// Restaurar tipo de movimiento
export async function restoreMovementType(id: number): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/MovementsTypes/restore-movement-type/${id}`);
}

// Obtener clasificaciones de movimiento
export async function getClasificationMovements(): Promise<ClasificationMovement[]> {
  return genericRequest<ClasificationMovement[]>("get", `${API_URL}/ClasificationMovements/get-clasification-movements`);
}