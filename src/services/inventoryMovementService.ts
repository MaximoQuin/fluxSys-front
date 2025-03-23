// src/services/inventoryMovementService.ts
import type { InventoryMovement } from "@/interfaces/InventoryMovement";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica
import { useAuthStore } from "@/stores/authStore"; // Importa el store de autenticación

const API_URL = "https://localhost:7002/api/InventoryMovements";

// Obtener todos los movimientos de inventario o los movimientos por compañía si no es Administrador
export async function getInventoryMovements(): Promise<InventoryMovement[]> {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (!user) {
    throw new Error("No se pudo obtener la información del usuario.");
  }

  // Si el usuario es Administrador, usa el endpoint que trae todos los movimientos
  if (user.role.name_role === "Administrador") {
    return genericRequest<InventoryMovement[]>("get", `${API_URL}/get-inventory-movements`);
  } else {
    // Si no es Administrador, usa el endpoint que trae los movimientos por compañía
    return genericRequest<InventoryMovement[]>("get", `${API_URL}/get-inventory-movements-by-company/${user.company.id_company}`);
  }
}