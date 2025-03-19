// src/stores/positionStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Position } from "@/interfaces/Position";
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
  restorePosition,
} from "@/services/positionService";

export const usePositionStore = defineStore("position", () => {
  const positions = ref<Position[]>([]);
  const loading = ref<boolean>(false);

  const fetchPositions = async () => {
    loading.value = true;
    try {
      positions.value = await getPositions();
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      loading.value = false;
    }
  };

  const addPosition = async (name: string) => {
    const newPosition = await createPosition(name);
    positions.value.push(newPosition);
  };

  const editPosition = async (id: number, name: string) => {
    const updatedPosition = await updatePosition(id, name);
    const index = positions.value.findIndex(p => p.id_position === id);
    if (index !== -1) positions.value[index] = updatedPosition;
  };

  const removePosition = async (id: number) => {
    await deletePosition(id);
    positions.value = positions.value.filter(p => p.id_position !== id);
  };

  const restoreDeletedPosition = async (id: number) => {
    await restorePosition(id);
    await fetchPositions(); // Volver a cargar los puestos
  };

  return {
    positions,
    loading,
    fetchPositions,
    addPosition,
    editPosition,
    removePosition,
    restoreDeletedPosition,
  };
});