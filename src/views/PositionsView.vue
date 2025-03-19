<script setup lang="ts">
import { onMounted, ref } from "vue";
import { usePositionsStore } from "@/stores/positionsStore";
import type { Position, PositionCreate, PositionUpdate } from "@/interfaces/positionsinterface";

// Se asume que la interfaz Position tiene opcionalmente el campo id_company_Id si se cuenta con él.
const positionsStore = usePositionsStore();
const loading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Formulario para agregar posición
const newPosition = ref<PositionCreate>({
  name_position: "",
  id_company_Id: 0
});

// Datos para edición
const editingPosition = ref<{ id: number; data: PositionUpdate } | null>(null);

onMounted(async () => {
  try {
    await positionsStore.fetchPositions();
  } catch (err) {
    error.value = "Error cargando las posiciones.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

// Función para agregar una posición
const addPosition = async () => {
  error.value = null;
  successMessage.value = null;
  if (!newPosition.value.name_position || newPosition.value.id_company_Id === 0) {
    error.value = "Todos los campos son obligatorios.";
    return;
  }
  try {
    await positionsStore.addPosition(newPosition.value);
    successMessage.value = "Posición agregada exitosamente.";
    newPosition.value = { name_position: "", id_company_Id: 0 };
  } catch (err) {
    error.value = "Error al agregar la posición.";
    console.error(err);
  }
};

// Inicia la edición, prellenando ambos campos
const startEdit = (position: Position) => {
  // Se asume que position incluye id_company_Id (si no, se deberá adaptar el formulario)
  editingPosition.value = {
    id: position.id_position,
    data: {
      name_position: position.name_position,
      id_company_Id: position.id_company_Id || 0
    }
  };
};

// Cancela la edición
const cancelEdit = () => {
  editingPosition.value = null;
};

// Guarda la edición
const saveEdit = async () => {
  if (!editingPosition.value) return;
  error.value = null;
  successMessage.value = null;
  const { name_position, id_company_Id } = editingPosition.value.data;
  if (!name_position || id_company_Id === 0) {
    error.value = "Todos los campos son obligatorios para editar.";
    return;
  }
  try {
    await positionsStore.updatePosition(editingPosition.value.id, editingPosition.value.data);
    editingPosition.value = null;
    successMessage.value = "Posición actualizada exitosamente.";
    await positionsStore.fetchPositions();
  } catch (err) {
    error.value = "Error al actualizar la posición.";
    console.error(err);
  }
};

// Elimina (soft delete) una posición
const deletePosition = async (id: number) => {
  error.value = null;
  successMessage.value = null;
  if (!window.confirm("¿Estás seguro de eliminar esta posición?")) return;
  try {
    await positionsStore.deletePosition(id);
    successMessage.value = "Posición eliminada correctamente.";
    await positionsStore.fetchPositions();
  } catch (err) {
    error.value = "Error al eliminar la posición.";
    console.error(err);
  }
};

// Restaura una posición eliminada
const restorePosition = async (id: number) => {
  error.value = null;
  successMessage.value = null;
  if (!window.confirm("¿Estás seguro de restaurar esta posición?")) return;
  try {
    await positionsStore.restorePosition(id);
    successMessage.value = "Posición restaurada correctamente.";
    await positionsStore.fetchPositions();
  } catch (err) {
    error.value = "Error al restaurar la posición.";
    console.error(err);
  }
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">👷🏼 Gestión de Cargos</h1>

    <!-- Mensajes de carga, error y éxito -->
    <p v-if="loading" class="text-gray-600 text-center">Cargando posiciones...</p>
    <p v-if="error" class="text-red-500 text-center font-semibold">{{ error }}</p>
    <p v-if="successMessage" class="text-green-500 text-center font-semibold">{{ successMessage }}</p>

    <!-- Formulario para agregar nueva posición -->
    <div class="bg-gray-100 p-4 rounded-xl shadow-md mb-6">
      <h2 class="text-lg font-semibold mb-2">Agregar Nueva Posición</h2>
      <div class="grid grid-cols-2 gap-4">
        <input
          v-model="newPosition.name_position"
          class="p-2 border rounded"
          placeholder="Nombre de la posición"
        />
        <input
          v-model.number="newPosition.id_company_Id"
          type="number"
          class="p-2 border rounded"
          placeholder="ID de la compañía"
        />
      </div>
      <button @click="addPosition" class="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Agregar
      </button>
    </div>

    <!-- Formulario de edición global (se muestra si se está editando) -->
    <div v-if="editingPosition" class="bg-yellow-100 p-4 rounded-xl shadow-md mb-6">
      <h2 class="text-lg font-semibold mb-2">Editar Posición</h2>
      <div class="grid grid-cols-2 gap-4">
        <input
          v-model="editingPosition.data.name_position"
          class="p-2 border rounded"
          placeholder="Nombre de la posición"
        />
        <input
          v-model.number="editingPosition.data.id_company_Id"
          type="number"
          class="p-2 border rounded"
          placeholder="ID de la compañía"
        />
      </div>
      <div class="mt-3 flex gap-2">
        <button @click="saveEdit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Guardar
        </button>
        <button @click="cancelEdit" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Cancelar
        </button>
      </div>
    </div>

    <!-- Cards de posiciones -->
    <div v-if="!loading && !error && positionsStore.positions.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="position in positionsStore.positions"
        :key="position.id_position"
        class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
      >
        <!-- Si la tarjeta está en modo edición inline -->
        <div v-if="editingPosition && editingPosition.id === position.id_position">
          <h3 class="text-xl font-semibold text-gray-800">Editando: {{ position.name_position }}</h3>
          <div class="grid grid-cols-2 gap-4 mt-2">
            <input
              v-model="editingPosition.data.name_position"
              class="p-2 border rounded"
              placeholder="Nombre de la posición"
            />
            <input
              v-model.number="editingPosition.data.id_company_Id"
              type="number"
              class="p-2 border rounded"
              placeholder="ID de la compañía"
            />
          </div>
          <div class="mt-3 flex gap-2">
            <button @click="saveEdit" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              Guardar
            </button>
            <button @click="cancelEdit" class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
              Cancelar
            </button>
          </div>
        </div>
        <!-- Vista normal de la tarjeta -->
        <div v-else>
          <h2 class="text-xl font-semibold text-gray-800">{{ position.name_position }}</h2>
          <p class="text-gray-600">🏢 {{ position.name_company }}</p>
          <div class="mt-4">
            <span
              :class="{
                'bg-green-100 text-green-700 border-green-500': !position.delete_log_position,
                'bg-red-100 text-red-700 border-red-500': position.delete_log_position
              }"
              class="px-3 py-1 border rounded-full text-sm font-semibold"
            >
              {{ position.delete_log_position ? "Inactivo" : "Activo" }}
            </span>
          </div>
          <div class="mt-4 flex gap-2">
            <button @click="startEdit(position)" class="bg-yellow-500 text-white px-3 py-1 rounded">
              ✏️ Editar
            </button>
            <button
              v-if="!position.delete_log_position"
              @click="deletePosition(position.id_position)"
              class="bg-red-500 text-white px-3 py-1 rounded"
            >
              🚫 Desactivar
            </button>
            <button
              v-if="position.delete_log_position"
              @click="restorePosition(position.id_position)"
              class="bg-green-500 text-white px-3 py-1 rounded"
            >
              🔄 Restaurar
            </button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="!loading && !error && positionsStore.positions.length === 0" class="text-gray-600 text-center mt-4">
      No hay posiciones disponibles.
    </p>
  </div>
</template>
