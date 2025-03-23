// src/services/inventoryMovementService.ts
import type { InventoryMovement } from "@/interfaces/InventoryMovement";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica

const API_URL = "https://localhost:7002/api/InventoryMovements";

// Obtener todos los movimientos de inventario
export async function getInventoryMovements(): Promise<InventoryMovement[]> {
  return genericRequest<InventoryMovement[]>("get", `${API_URL}/get-inventory-movements`);
}