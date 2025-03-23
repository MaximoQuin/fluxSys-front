<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Puestos</h1>

    <!-- Filtros -->
    <div class="mb-4">
      <button
        @click="showActivePositions"
        :class="{'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive}"
        class="px-4 py-2 rounded-l"
      >
        Activos
      </button>
      <button
        @click="showDeletedPositions"
        :class="{'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive}"
        class="px-4 py-2 rounded-r"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla de puestos -->
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
        <tr v-for="position in filteredPositions" :key="position.id_position" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b">{{ position.id_position }}</td>
          <td class="py-2 px-4 border-b">
            <span v-if="!isEditing(position.id_position)">{{ position.name_position }}</span>
            <div v-else class="flex items-center">
              <input
                v-model="editingName"
                class="border rounded px-2 py-1"
              />
              <button
                @click="saveEdit(position.id_position)"
                class="bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Aceptar
              </button>
            </div>
          </td>
          <td class="py-2 px-4 border-b">{{ position.name_company }}</td>
          <td class="py-2 px-4 border-b">
            <button
              v-if="showActive && !isEditing(position.id_position)"
              @click="startEdit(position.id_position, position.name_position)"
              class="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Editar
            </button>
            <button
              v-if="showActive && !isEditing(position.id_position)"
              @click="removePosition(position.id_position)"
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              Eliminar
            </button>
            <button
              v-else-if="!isEditing(position.id_position)"
              @click="restoreDeletedPosition(position.id_position)"
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

    <!-- Crear Nuevo Puesto -->
    <div class="mt-4">
      <h2 class="text-xl font-bold">Crear Puesto</h2>
      <div class="flex items-center mt-2">
        <input
          v-model="newPositionName"
          type="text"
          placeholder="Nombre del puesto"
          class="border rounded px-4 py-2 mr-2"
        />
        <button
          @click="createPosition"
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
import { usePositionStore } from '@/stores/positionStore';

const positionStore = usePositionStore();
const showActive = ref(true);
const editingId = ref<number | null>(null);
const editingName = ref('');
const newPositionName = ref('');

const filteredPositions = computed(() => {
  return positionStore.positions.filter(position =>
    showActive.value ? !position.delete_log_position : position.delete_log_position
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
    await positionStore.editPosition(id, editingName.value);
    editingId.value = null;
    editingName.value = '';
    await positionStore.fetchPositions(); // Refrescar la lista
  }
};

const showActivePositions = () => {
  showActive.value = true;
};

const showDeletedPositions = () => {
  showActive.value = false;
};

const removePosition = async (id: number) => {
  await positionStore.removePosition(id);
  await positionStore.fetchPositions(); // Refrescar la lista
};

const restoreDeletedPosition = async (id: number) => {
  await positionStore.restoreDeletedPosition(id);
  await positionStore.fetchPositions(); // Refrescar la lista
};

const createPosition = async () => {
  if (newPositionName.value.trim()) {
    await positionStore.addPosition(newPositionName.value);
    newPositionName.value = ''; // Limpiar el campo después de crear el puesto
    await positionStore.fetchPositions(); // Refrescar la lista
  }
};

onMounted(() => {
  positionStore.fetchPositions();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>