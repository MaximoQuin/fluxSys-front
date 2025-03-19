<template>
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 class="text-3xl font-bold text-center mb-6">Departamentos</h1>
  
      <!-- Formulario para crear o editar un departamento -->
      <div class="mb-10">
        <h2 class="text-2xl font-semibold mb-4">{{ isEditing ? 'Editar Departamento' : 'Agregar Departamento' }}</h2>
        <form @submit.prevent="handleSubmitDepartment" class="space-y-4">
          <div>
            <input
              v-model="newDepartment.name_deparment"
              type="text"
              placeholder="Nombre del departamento"
              class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              v-model="newDepartment.id_company_Id"
              type="number"
              placeholder="ID de la empresa"
              class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
            {{ isEditing ? 'Actualizar Departamento' : 'Crear Departamento' }}
          </button>
        </form>
      </div>
  
      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 text-red-700 border border-red-500 rounded-md">
        <p>{{ errorMessage }}</p>
      </div>
  
      <!-- Mostrar los departamentos -->
      <div>
        <h2 class="text-2xl font-semibold mb-4">Lista de Departamentos</h2>
        <div v-if="loading" class="text-center text-gray-500">Cargando departamentos...</div>
        <div v-else>
          <ul class="space-y-4">
            <li v-for="department in departments" :key="department.id_department" class="flex justify-between items-center border-b py-3">
              <div>
                <p class="font-semibold text-xl">{{ department.name_deparment }}</p>
                <p class="text-sm text-gray-500">{{ department.name_company }}</p>
              </div>
              <div class="flex space-x-2">
                <button @click="handleEditDepartment(department)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Editar
                </button>
                <button @click="handleRemoveDepartment(department.id_department)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                  Eliminar
                </button>
                <button v-if="department.delete_log_department" @click="handleRestoreDepartment(department.id_department)" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                  Restaurar
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useDepartmentStore } from "@/stores/departmentStore";
  
  const departmentStore = useDepartmentStore();
  const { loading, fetchDepartments, addDepartment, editDepartment, removeDepartment, restoreDeletedDepartment } = departmentStore;
  const departments = ref(departmentStore.departments); 
  
  // Variables locales
  const newDepartment = ref({
    name_deparment: "",
    id_company_Id: null,
  });
  const isEditing = ref(false); 
  const departmentToEdit = ref(null);
  const errorMessage = ref("");
  
  onMounted(async () => {
    try {
      await fetchDepartments();
      departments.value = departmentStore.departments;
    } catch (error) {
      errorMessage.value = "Error al cargar los departamentos.";
    }
  });
  
  const handleSubmitDepartment = async () => {
    try {
      if (isEditing.value) {
        await editDepartment(departmentToEdit.value.id_department, newDepartment.value);
        isEditing.value = false; // Restablecer a estado de creación
      } else {
        await addDepartment(newDepartment.value);
      }
      newDepartment.value = { name_deparment: "", id_company_Id: null };
    } catch (error) {
      errorMessage.value = isEditing.value ? "Error al actualizar el departamento." : "Error al agregar el departamento.";
    }
  };
  
  const handleEditDepartment = (department) => {
    isEditing.value = true; 
    departmentToEdit.value = department;
    newDepartment.value = { ...department }; 
  };
  
  const handleRemoveDepartment = async (id) => {
    try {
      await removeDepartment(id);
    } catch (error) {
      errorMessage.value = "Error al eliminar el departamento.";
    }
  };
  
  const handleRestoreDepartment = async (id) => {
    try {
      await restoreDeletedDepartment(id);
    } catch (error) {
      errorMessage.value = "Error al restaurar el departamento.";
    }
  };
  </script>
  