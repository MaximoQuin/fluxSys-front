<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Gestión de Puestos</h1>

    <!-- Filtros -->
    <div class="flex mb-6">
      <button
        @click="showActivePositions"
        :class="showActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-l shadow-md hover:bg-blue-700"
      >
        Activos
      </button>
      <button
        @click="showDeletedPositions"
        :class="!showActive ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-r shadow-md hover:bg-red-600"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla de puestos -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="py-3 px-4 border-b">ID</th>
            <th class="py-3 px-4 border-b">Nombre</th>
            <th class="py-3 px-4 border-b">Compañía</th>
            <th class="py-3 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="position in filteredPositions"
            :key="position.id_position"
            class="hover:bg-gray-50 transition-colors duration-200"
          >
            <td class="py-3 px-4 border-b">{{ position.id_position }}</td>
            <td class="py-3 px-4 border-b">
              <span v-if="!isEditing(position.id_position)">{{ position.name_position }}</span>
              <div v-else class="flex items-center">
                <input
                  v-model="editingName"
                  class="border rounded px-2 py-1"
                />
                <button
                  @click="saveEdit(position.id_position)"
                  class="ml-2 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded shadow-sm"
                >
                  Aceptar
                </button>
              </div>
            </td>
            <td class="py-3 px-4 border-b">{{ position.name_company }}</td>
            <td class="py-3 px-4 border-b space-x-2">
              <template v-if="showActive && !isEditing(position.id_position)">
                <button
                  @click="startEdit(position.id_position, position.name_position)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow-sm"
                >
                  Editar
                </button>
                <button
                  @click="removePosition(position.id_position)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm"
                >
                  Eliminar
                </button>
              </template>
              <template v-else-if="!isEditing(position.id_position)">
                <button
                  @click="restoreDeletedPosition(position.id_position)"
                  class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm"
                >
                  Restaurar
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cargando -->
    <div v-if="loading" class="mt-4 text-gray-600">
      Cargando...
    </div>

    <!-- Crear Nuevo Puesto -->
    <div class="mt-10 bg-white rounded-xl shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Crear Puesto</h2>
      <div class="flex items-center space-x-4">
        <input
          v-model="newPositionName"
          type="text"
          placeholder="Nombre del puesto"
          class="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <button
          @click="createPosition"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md"
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

const isEditing = (id: number) => editingId.value === id;

const startEdit = (id: number, name: string) => {
  editingId.value = id;
  editingName.value = name;
};

const saveEdit = async (id: number) => {
  if (editingName.value.trim()) {
    await positionStore.editPosition(id, editingName.value);
    editingId.value = null;
    editingName.value = '';
    await positionStore.fetchPositions();
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
  await positionStore.fetchPositions();
};

const restoreDeletedPosition = async (id: number) => {
  await positionStore.restoreDeletedPosition(id);
  await positionStore.fetchPositions();
};

const createPosition = async () => {
  if (newPositionName.value.trim()) {
    await positionStore.addPosition(newPositionName.value);
    newPositionName.value = '';
    await positionStore.fetchPositions();
  }
};

onMounted(() => {
  positionStore.fetchPositions();
});
</script>

<style scoped>
/* No necesitas estilos adicionales, todo está manejado con Tailwind */
</style>
