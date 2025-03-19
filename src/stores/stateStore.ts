// src/stores/stateStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { State } from "@/interfaces/State";
import {
  getStates,
  createState,
  updateState,
  deleteState,
  restoreState,
} from "@/services/stateService";

export const useStateStore = defineStore("state", () => {
  const states = ref<State[]>([]);
  const loading = ref<boolean>(false);

  const fetchStates = async () => {
    loading.value = true;
    try {
      states.value = await getStates();
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      loading.value = false;
    }
  };

  const addState = async (name: string) => {
    const newState = await createState(name);
    states.value.push(newState);
  };

  const editState = async (id: number, name: string) => {
    const updatedState = await updateState(id, name);
    const index = states.value.findIndex(s => s.id_state === id);
    if (index !== -1) states.value[index] = updatedState;
  };

  const removeState = async (id: number) => {
    await deleteState(id);
    states.value = states.value.filter(s => s.id_state !== id);
  };

  const restoreDeletedState = async (id: number) => {
    await restoreState(id);
    await fetchStates(); // Volver a cargar los estados
  };

  return {
    states,
    loading,
    fetchStates,
    addState,
    editState,
    removeState,
    restoreDeletedState,
  };
});