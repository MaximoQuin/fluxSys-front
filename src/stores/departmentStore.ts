import { defineStore } from "pinia";
import { ref } from "vue";
import type { Department } from "@/interfaces/Department";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, restoreDepartment } from "@/services/departmentService";

export const useDepartmentStore = defineStore("department", () => {
  const departments = ref<Department[]>([]);
  const loading = ref<boolean>(false);

  // Función para obtener todos los departamentos
  const fetchDepartments = async () => {
    loading.value = true;
    try {
      const response = await getDepartments();
      console.log("Respuesta de getDepartments desde el store:", response);
      departments.value = response; // Asignar la respuesta directamente
      console.log("Departamentos almacenados en el store:", departments.value);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      loading.value = false;
    }
  };
  

  const addDepartment = async (department: { Name_deparment: string; Id_company_Id: number }) => {
    await createDepartment(department);
    departments.value.push({
      Id_department: Date.now(),
      Name_deparment: department.Name_deparment,
      Name_company: "", 
      Delete_log_department: false,
    });
  };

  const editDepartment = async (id: number, department: { Name_deparment: string; Id_company_Id: number }) => {
    await updateDepartment(id, department);
    const index = departments.value.findIndex(d => d.Id_department === id);
    if (index !== -1) departments.value[index] = { ...departments.value[index], ...department };
  };

  const removeDepartment = async (id: number) => {
    await deleteDepartment(id);
    departments.value = departments.value.filter(d => d.Id_department !== id);
  };

  // Función para restaurar un departamento eliminado
  const restoreDeletedDepartment = async (id: number) => {
    await restoreDepartment(id);
    await fetchDepartments(); 
  };

  return { departments, loading, fetchDepartments, addDepartment, editDepartment, removeDepartment, restoreDeletedDepartment };
});
