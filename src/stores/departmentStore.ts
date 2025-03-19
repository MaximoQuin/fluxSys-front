// src/stores/departmentStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Department } from "@/interfaces/Department";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  restoreDepartment,
} from "@/services/departmentService";

export const useDepartmentStore = defineStore("department", () => {
  const departments = ref<Department[]>([]);
  const loading = ref<boolean>(false);

  const fetchDepartments = async () => {
    loading.value = true;
    try {
      departments.value = await getDepartments();
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      loading.value = false;
    }
  };

  const addDepartment = async (name: string) => {
    const newDepartment = await createDepartment(name);
    departments.value.push(newDepartment);
  };

  const editDepartment = async (id: number, name: string) => {
    const updatedDepartment = await updateDepartment(id, name);
    const index = departments.value.findIndex(d => d.id_department === id);
    if (index !== -1) departments.value[index] = updatedDepartment;
  };

  const removeDepartment = async (id: number) => {
    await deleteDepartment(id);
    departments.value = departments.value.filter(d => d.id_department !== id);
  };

  const restoreDeletedDepartment = async (id: number) => {
    await restoreDepartment(id);
    await fetchDepartments(); // Volver a cargar los departamentos
  };

  return {
    departments,
    loading,
    fetchDepartments,
    addDepartment,
    editDepartment,
    removeDepartment,
    restoreDeletedDepartment,
  };
});