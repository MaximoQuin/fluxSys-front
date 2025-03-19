// src/stores/movementTypeStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { MovementType, ClasificationMovement } from "@/interfaces/MovementType";
import {
  getMovementsTypes,
  createMovementType,
  updateMovementType,
  deleteMovementType,
  restoreMovementType,
  getClasificationMovements,
} from "@/services/movementTypeService";

export const useMovementTypeStore = defineStore("movementType", () => {
  const movementsTypes = ref<MovementType[]>([]);
  const clasificationMovements = ref<ClasificationMovement[]>([]);
  const loading = ref<boolean>(false);

  // Obtener tipos de movimiento
  const fetchMovementsTypes = async () => {
    loading.value = true;
    try {
      movementsTypes.value = await getMovementsTypes();
    } catch (error) {
      console.error("Error fetching movements types:", error);
    } finally {
      loading.value = false;
    }
  };

  // Obtener clasificaciones de movimiento
  const fetchClasificationMovements = async () => {
    try {
      clasificationMovements.value = await getClasificationMovements();
    } catch (error) {
      console.error("Error fetching clasification movements:", error);
    }
  };

  // Crear tipo de movimiento
  const addMovementType = async (name: string, id_clasification_movement_Id: number) => {
    const newMovementType = await createMovementType(name, id_clasification_movement_Id);
    movementsTypes.value.push(newMovementType);
  };

  // Editar tipo de movimiento
  const editMovementType = async (id: number, name: string, id_clasification_movement_Id: number) => {
    const updatedMovementType = await updateMovementType(id, name, id_clasification_movement_Id);
    const index = movementsTypes.value.findIndex(m => m.id_movement_type === id);
    if (index !== -1) movementsTypes.value[index] = updatedMovementType;
  };

  // Eliminar tipo de movimiento
  const removeMovementType = async (id: number) => {
    await deleteMovementType(id);
    movementsTypes.value = movementsTypes.value.filter(m => m.id_movement_type !== id);
  };

  // Restaurar tipo de movimiento
  const restoreDeletedMovementType = async (id: number) => {
    await restoreMovementType(id);
    await fetchMovementsTypes(); // Refrescar la lista
  };

  return {
    movementsTypes,
    clasificationMovements,
    loading,
    fetchMovementsTypes,
    fetchClasificationMovements,
    addMovementType,
    editMovementType,
    removeMovementType,
    restoreDeletedMovementType,
  };
});