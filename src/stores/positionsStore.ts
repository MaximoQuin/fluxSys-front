import { defineStore } from "pinia";
import { ref } from "vue";
import positionsService from "@/services/positionsService";
import type { Position, PositionCreate, PositionUpdate } from '@/interfaces/positionsinterface';

export const usePositionsStore = defineStore("positions", () => {
  const positions = ref<Position[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

  // Función para obtener las posiciones
  const fetchPositions = async () => {
    loading.value = true;
    error.value = null;
    try {
      positions.value = await positionsService.getPositions();
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : "Error desconocido al obtener posiciones.";
    } finally {
      loading.value = false;
    }
  };

  // Función para agregar una nueva posición
  const addPosition = async (positionData: PositionCreate) => {
    success.value = null;
    error.value = null;
    try {
      const newPosition = await positionsService.createPosition(positionData);
      // Agregamos la posición creada a la lista
      positions.value.push(newPosition);
      success.value = "Posición agregada exitosamente.";
    } catch (err: unknown) {
      error.value = "Error al agregar la posición.";
    }
  };

  // Función para actualizar una posición
  const updatePosition = async (id: number, positionData: PositionUpdate) => {
    success.value = null;
    error.value = null;
    try {
      const updatedPosition = await positionsService.updatePosition(id, positionData);
      // Se corrige el nombre de la propiedad (Id_position en lugar de id_position)
      const index = positions.value.findIndex((pos) => pos.Id_position === id);
      if (index !== -1) {
        positions.value[index] = updatedPosition;
      }
      success.value = "Posición actualizada exitosamente.";
    } catch (err: unknown) {
      error.value = "Error al actualizar la posición.";
    }
  };

  // Función para eliminar (soft delete) una posición
  const deletePosition = async (id: number) => {
    success.value = null;
    error.value = null;
    try {
      await positionsService.deletePosition(id);
      // Se elimina de la lista filtrando la posición eliminada
      positions.value = positions.value.filter(pos => pos.Id_position !== id);
      success.value = "Posición eliminada exitosamente.";
    } catch (err: unknown) {
      error.value = "Error al eliminar la posición.";
    }
  };

  // Función para restaurar una posición eliminada
  const restorePosition = async (id: number) => {
    success.value = null;
    error.value = null;
    try {
      await positionsService.restorePosition(id);
      // Luego de restaurar, refrescamos la lista completa
      await fetchPositions();
      success.value = "Posición restaurada correctamente.";
    } catch (err: unknown) {
      error.value = "Error al restaurar la posición.";
    }
  };

  return {
    positions,
    loading,
    error,
    success,
    fetchPositions,
    addPosition,
    updatePosition,
    deletePosition,
    restorePosition,
  };
});
