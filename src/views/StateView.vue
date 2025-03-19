<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Estados</h1>

    <!-- Filtros -->
    <div class="mb-4">
      <button
        @click="showActiveStates"
        :class="{'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive}"
        class="px-4 py-2 rounded-l"
      >
        Activos
      </button>
      <button
        @click="showDeletedStates"
        :class="{'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive}"
        class="px-4 py-2 rounded-r"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla de estados -->
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">Nombre</th>
          <th class="py-2 px-4 border-b">Compañía</th>
          <th class="py-2 px-4 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="state in filteredStates" :key="state.id_state" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b">{{ state.id_state }}</td>
          <td class="py-2 px-4 border-b">
            <span v-if="!isEditing(state.id_state)">{{ state.name_state }}</span>
            <div v-else class="flex items-center">
              <input
                v-model="editingName"
                class="border rounded px-2 py-1"
              />
              <button
                @click="saveEdit(state.id_state)"
                class="bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Aceptar
              </button>
            </div>
          </td>
          <td class="py-2 px-4 border-b">{{ state.name_company }}</td>
          <td class="py-2 px-4 border-b">
            <button
              v-if="showActive && !isEditing(state.id_state)"
              @click="startEdit(state.id_state, state.name_state)"
              class="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Editar
            </button>
            <button
              v-if="showActive && !isEditing(state.id_state)"
              @click="removeState(state.id_state)"
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              Eliminar
            </button>
            <button
              v-else-if="!isEditing(state.id_state)"
              @click="restoreDeletedState(state.id_state)"
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

    <!-- Crear Nuevo Estado -->
    <div class="mt-4">
      <h2 class="text-xl font-bold">Crear Estado</h2>
      <div class="flex items-center mt-2">
        <input
          v-model="newStateName"
          type="text"
          placeholder="Nombre del estado"
          class="border rounded px-4 py-2 mr-2"
        />
        <button
          @click="createState"
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
import { useStateStore } from '@/stores/stateStore';

const stateStore = useStateStore();
const showActive = ref(true);
const editingId = ref<number | null>(null);
const editingName = ref('');
const newStateName = ref('');

const filteredStates = computed(() => {
  return stateStore.states.filter(state =>
    showActive.value ? !state.delete_log_state : state.delete_log_state
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
    await stateStore.editState(id, editingName.value);
    editingId.value = null;
    editingName.value = '';
    await stateStore.fetchStates(); // Refrescar la lista
  }
};

const showActiveStates = () => {
  showActive.value = true;
};

const showDeletedStates = () => {
  showActive.value = false;
};

const removeState = async (id: number) => {
  await stateStore.removeState(id);
  await stateStore.fetchStates(); // Refrescar la lista
};

const restoreDeletedState = async (id: number) => {
  await stateStore.restoreDeletedState(id);
  await stateStore.fetchStates(); // Refrescar la lista
};

const createState = async () => {
  if (newStateName.value.trim()) {
    await stateStore.addState(newStateName.value);
    newStateName.value = ''; // Limpiar el campo después de crear el estado
    await stateStore.fetchStates(); // Refrescar la lista
  }
};

onMounted(() => {
  stateStore.fetchStates();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>