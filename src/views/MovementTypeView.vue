<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Gestión de Tipos de Movimiento</h1>

        <!-- Filtros -->
        <div class="mb-4">
            <button @click="showActiveMovements"
                :class="{'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive}" class="px-4 py-2 rounded-l">
                Activos
            </button>
            <button @click="showDeletedMovements"
                :class="{'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive}" class="px-4 py-2 rounded-r">
                Eliminados
            </button>
        </div>

        <!-- Tabla de tipos de movimiento -->
        <table class="min-w-full bg-white">
            <thead>
                <tr>
                    <th class="py-2 px-4 border-b">ID</th>
                    <th class="py-2 px-4 border-b">Nombre</th>
                    <th class="py-2 px-4 border-b">Compañía</th>
                    <th class="py-2 px-4 border-b">Clasificación</th>
                    <th class="py-2 px-4 border-b">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="movement in filteredMovements" :key="movement.id_movement_type" class="hover:bg-gray-50">
                    <td class="py-2 px-4 border-b">{{ movement.id_movement_type }}</td>
                    <td class="py-2 px-4 border-b">
                        <span v-if="!isEditing(movement.id_movement_type)">{{ movement.name_movement_type }}</span>
                        <div v-else class="flex items-center">
                            <input v-model="editingName" class="border rounded px-2 py-1" />
                            <select v-model="editingClasificationId" class="border rounded px-2 py-1 ml-2">
                                <option :value="null" disabled>Escoge una Clasificación</option>
                                <option v-for="clasification in movementTypeStore.clasificationMovements"
                                    :key="clasification.id_clasification_movement"
                                    :value="clasification.id_clasification_movement">
                                    {{ clasification.name_clasification_movement }}
                                </option>
                            </select>
                            <button @click="saveEdit(movement.id_movement_type)"
                                class="bg-green-500 text-white px-4 py-2 rounded ml-2">
                                Aceptar
                            </button>
                        </div>
                    </td>
                    <td class="py-2 px-4 border-b">{{ movement.name_company }}</td>
                    <td class="py-2 px-4 border-b">{{ movement.name_clasification_movement }}</td>
                    <td class="py-2 px-4 border-b">
                        <button v-if="showActive && !isEditing(movement.id_movement_type)"
                            @click="startEdit(movement.id_movement_type, movement.name_movement_type, movement.id_clasification_movement)"
                            class="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
                            Editar
                        </button>
                        <button v-if="showActive && !isEditing(movement.id_movement_type)"
                            @click="removeMovementType(movement.id_movement_type)"
                            class="bg-red-500 text-white px-4 py-2 rounded">
                            Eliminar
                        </button>
                        <button v-else-if="!isEditing(movement.id_movement_type)"
                            @click="restoreDeletedMovementType(movement.id_movement_type)"
                            class="bg-green-500 text-white px-4 py-2 rounded">
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

        <!-- Crear Nuevo Tipo de Movimiento -->
        <div class="mt-4">
            <h2 class="text-xl font-bold">Crear Tipo de Movimiento</h2>
            <div class="flex items-center mt-2">
                <input v-model="newMovementName" type="text" placeholder="Nombre del tipo de movimiento"
                    class="border rounded px-4 py-2 mr-2" />
                <select v-model="newClasificationId" class="border rounded px-4 py-2 mr-2">
                    <option :value="null" disabled>Escoge una Clasificación</option>
                    <option v-for="clasification in movementTypeStore.clasificationMovements"
                        :key="clasification.id_clasification_movement" :value="clasification.id_clasification_movement">
                        {{ clasification.name_clasification_movement }}
                    </option>
                </select>
                <button @click="createMovementType" class="bg-blue-500 text-white px-4 py-2 rounded">
                    Crear
                </button>
            </div>
        </div>
    </div>
</template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useMovementTypeStore } from '@/stores/movementTypeStore';
  
  const movementTypeStore = useMovementTypeStore();
  const showActive = ref(true);
  const editingId = ref<number | null>(null);
  const editingName = ref('');
  const editingClasificationId = ref<number | null>(null);
  const newMovementName = ref('');
  const newClasificationId = ref<number | null>(null);
  
  const filteredMovements = computed(() => {
    return movementTypeStore.movementsTypes.filter(movement =>
      showActive.value ? !movement.delete_log_movement_type : movement.delete_log_movement_type
    );
  });
  
  const isEditing = (id: number) => {
    return editingId.value === id;
  };
  
  const startEdit = (id: number, name: string, id_clasification_movement: number) => {
    editingId.value = id;
    editingName.value = name;
    editingClasificationId.value = id_clasification_movement;
  };
  
  const saveEdit = async (id: number) => {
    if (editingName.value.trim() && editingClasificationId.value !== null) {
      await movementTypeStore.editMovementType(id, editingName.value, editingClasificationId.value);
      editingId.value = null;
      editingName.value = '';
      editingClasificationId.value = null;
      await movementTypeStore.fetchMovementsTypes(); // Refrescar la lista
    }
  };
  
  const showActiveMovements = () => {
    showActive.value = true;
  };
  
  const showDeletedMovements = () => {
    showActive.value = false;
  };
  
  const removeMovementType = async (id: number) => {
    await movementTypeStore.removeMovementType(id);
    await movementTypeStore.fetchMovementsTypes(); // Refrescar la lista
  };
  
  const restoreDeletedMovementType = async (id: number) => {
    await movementTypeStore.restoreDeletedMovementType(id);
    await movementTypeStore.fetchMovementsTypes(); // Refrescar la lista
  };
  
  const createMovementType = async () => {
    if (newMovementName.value.trim() && newClasificationId.value !== null) {
      await movementTypeStore.addMovementType(newMovementName.value, newClasificationId.value);
      newMovementName.value = ''; // Limpiar el campo después de crear el tipo de movimiento
      newClasificationId.value = null; // Limpiar el campo después de crear el tipo de movimiento
      await movementTypeStore.fetchMovementsTypes(); // Refrescar la lista
    }
  };
  
  onMounted(() => {
    movementTypeStore.fetchMovementsTypes();
    movementTypeStore.fetchClasificationMovements();
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales si son necesarios */
  </style>