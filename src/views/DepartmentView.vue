<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Departamentos</h1>

    <!-- Filtros -->
    <div class="mb-4">
      <button
        @click="showActiveDepartments"
        :class="{'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive}"
        class="px-4 py-2 rounded-l"
      >
        Activos
      </button>
      <button
        @click="showDeletedDepartments"
        :class="{'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive}"
        class="px-4 py-2 rounded-r"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla de departamentos -->
    <table class="min-w-full bg-black">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">Nombre</th>
          <th class="py-2 px-4 border-b">Compañía</th>
          <th class="py-2 px-4 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="department in filteredDepartments" :key="department.id_department" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b">{{ department.id_department }}</td>
          <td class="py-2 px-4 border-b">
            <span v-if="!isEditing(department.id_department)">{{ department.name_deparment }}</span>
            <div v-else class="flex items-center">
              <input
                v-model="editingName"
                class="border rounded px-2 py-1"
              />
              <button
                @click="saveEdit(department.id_department)"
                class="bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Aceptar
              </button>
            </div>
          </td>
          <td class="py-2 px-4 border-b">{{ department.name_company }}</td>
          <td class="py-2 px-4 border-b">
            <button
              v-if="showActive && !isEditing(department.id_department)"
              @click="startEdit(department.id_department, department.name_deparment)"
              class="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Editar
            </button>
            <button
              v-if="showActive && !isEditing(department.id_department)"
              @click="removeDepartment(department.id_department)"
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              Eliminar
            </button>
            <button
              v-else-if="!isEditing(department.id_department)"
              @click="restoreDeletedDepartment(department.id_department)"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              Restaurar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Cargando -->
    <div v-if="loading" class="mt-4">
      Cargando...
    </div>

    <!-- Crear Nuevo Departamento -->
    <div class="mt-4">
      <h2 class="text-xl font-bold">Crear Departamento</h2>
      <div class="flex items-center mt-2">
        <input
          v-model="newDepartmentName"
          type="text"
          placeholder="Nombre del departamento"
          class="border rounded px-4 py-2 mr-2"
        />
        <button
          @click="createDepartment"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDepartmentStore } from '@/stores/departmentStore';

const departmentStore = useDepartmentStore();
const showActive = ref(true);
const editingId = ref<number | null>(null);
const editingName = ref('');
const newDepartmentName = ref('');

const filteredDepartments = computed(() => {
  return departmentStore.departments.filter(department =>
    showActive.value ? !department.delete_log_department : department.delete_log_department
  );
});

const isEditing = (id: number) => {
  return editingId.value === id;
};

const startEdit = (id: number, name: string) => {
  editingId.value = id;
  editingName.value = name;
};

const saveEdit = async (id: number) => {
  if (editingName.value.trim()) {
    await departmentStore.editDepartment(id, editingName.value);
    editingId.value = null;
    editingName.value = '';
    await departmentStore.fetchDepartments(); // Refrescar la lista
  }
};

const showActiveDepartments = () => {
  showActive.value = true;
};

const showDeletedDepartments = () => {
  showActive.value = false;
};

const removeDepartment = async (id: number) => {
  await departmentStore.removeDepartment(id);
  await departmentStore.fetchDepartments(); // Refrescar la lista
};

const restoreDeletedDepartment = async (id: number) => {
  await departmentStore.restoreDeletedDepartment(id);
  await departmentStore.fetchDepartments(); // Refrescar la lista
};

const createDepartment = async () => {
  if (newDepartmentName.value.trim()) {
    await departmentStore.addDepartment(newDepartmentName.value);
    newDepartmentName.value = ''; // Limpiar el campo después de crear el departamento
    await departmentStore.fetchDepartments(); // Refrescar la lista
  }
};

onMounted(() => {
  departmentStore.fetchDepartments();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>