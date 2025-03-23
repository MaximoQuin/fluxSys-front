// src/stores/inventoryMovementStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { InventoryMovement } from "@/interfaces/InventoryMovement";
import { getInventoryMovements } from "@/services/inventoryMovementService";

export const useInventoryMovementStore = defineStore("inventoryMovement", () => {
  const inventoryMovements = ref<InventoryMovement[]>([]);
  const loading = ref<boolean>(false);

  // Obtener todos los movimientos de inventario
  const fetchInventoryMovements = async () => {
    loading.value = true;
    try {
      inventoryMovements.value = await getInventoryMovements();
    } catch (error) {
      console.error("Error fetching inventory movements:", error);
    } finally {
      loading.value = false;
    }
  };

  return { inventoryMovements, loading, fetchInventoryMovements };
});