<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Tipos de movimientos</h1>

        <!-- Sección para crear nueva categoría -->
        <div class="mb-4 p-4 bg-white rounded shadow">
            <h2 class="text-xl font-bold mb-2">Crear Nueva Tipo de movimiento</h2>
            <div class="flex flex-wrap gap-2">
                <input v-model="newmovementypeName" placeholder="Nombre del tipo de movimiento"
                    class="border rounded px-3 py-2 flex-grow" />

                <select v-model="selectedCompany" class="border rounded px-3 py-2">
                    <option value="" disabled>Seleccionar empresa</option>
                    <option v-for="company in companyStore.companies" :key="company.id_company" :value="company.id_company">
                        {{ company.name_company }}
                    </option>
                </select>

                <select v-model="selectedClasification" class="border rounded px-3 py-2">
                    <option value="" disabled>Seleccionar clasificacion</option>
                    <option v-for="clasification in ClasificationMovementStore.clasifications_movements" :key="clasification.id_clasification_movement" :value="clasification.id_clasification_movement">
                        {{ clasification.name_clasification_movement }}
                    </option>
                </select>

                <button @click="createMovementType" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    :disabled="!newmovementypeName.trim() || !selectedCompany || !selectedClasification">
                    Crear Categoría
                </button>

            </div>
        </div>

        <!-- Filtros de visualización -->
        <div class="mb-4 flex">
            <button @click="showActiveMovemenstypes"
                :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive }"
                class="px-4 py-2 rounded-l">
                Activas
            </button>
            <button @click="showDeletedMovemenstypes"
                :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive }"
                class="px-4 py-2 rounded-r">
                Eliminadas
            </button>
        </div>

        <!-- Tabla de categorías de productos -->
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="py-2 px-4 border-b text-left">ID</th>
                        <th class="py-2 px-4 border-b text-left">Nombre</th>
                        <th class="py-2 px-4 border-b text-left">Empresa</th>
                        <th class="py-2 px-4 border-b text-left">Clasificacion del movimiento</th>
                        <th class="py-2 px-4 border-b text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="movementype in filteredMovementsTypes" :key="movementype.id_movement_type">
                        <td class="py-2 px-4 border-b">{{ movementype.id_movement_type }}</td>
                        <td class="py-2 px-4 border-b">
                            <span v-if="!isEditing(movementype.id_movement_type)">{{ movementype.name_movement_type
                                }}</span>
                            <input v-else v-model="editingName" class="border rounded px-2 py-1 w-full" />
                        </td>
                        <td class="py-2 px-4 border-b">
                            <span v-if="!isEditing(movementype.id_movement_type)">
                                <span>{{ movementype.name_company }}</span>
                            </span>
                            <select v-else v-model="editingCompany" class="border rounded px-2 py-1 w-full">
                                <option value="" disabled selected>Seleccionar empresa</option>
                                <option v-for="company in companyStore.companies" :key="company.id_company"
                                    :value="company.id_company">
                                    {{ company.name_company }}
                                </option>
                            </select>
                        </td>
                        <td class="py-2 px-4 border-b">
                            <span v-if="!isEditing(movementype.id_movement_type)">
                                <span>{{ movementype.name_clasification_movement }}</span>
                            </span>
                            <select v-else v-model="editingClasification" class="border rounded px-2 py-1 w-full">
                                <option value="" disabled selected>Seleccionar clasificacion</option>
                                <option v-for="clasification in ClasificationMovementStore.clasifications_movements" :key="clasification.id_clasification_movement" :value="clasification.id_clasification_movement">
                                    {{ clasification.name_clasification_movement }}
                                </option>
                            </select>
                        </td>

                        <td class="py-2 px-4 border-b">
                            <div v-if="!isEditing(movementype.id_movement_type)" class="flex space-x-2">
                                <button v-if="showActive"
                                    @click="startEdit(movementype.id_movement_type, movementype.name_movement_type, movementype.id_movement_type, movementype.id_movement_type)"
                                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                                    Editar
                                </button>
                                <button v-if="showActive && !isEditing(movementype.id_movement_type)"
                                    @click="removeMovementType(movementype.id_movement_type)"
                                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                                    Eliminar
                                </button>

                                <button v-if="!showActive"
                                    @click="restoreDeletedMovementType(movementype.id_movement_type)"
                                    class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                                    Restaurar
                                </button>
                            </div>

                            <div v-else class="flex space-x-2">
                                <button @click="saveEdit(movementype.id_movement_type)"
                                    class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                                    Guardar
                                </button>

                            </div>
                        </td>


                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMovementTypesStore } from '@/stores/movement_type_Store';
import { useCompanyStore } from '@/stores/companyStore';
import { useClasificationMovementStore } from '@/stores/clasificationStore';

const movementStore = useMovementTypesStore();
const showActive = ref(true);
const editingId = ref<number | null>(null);
const editingName = ref('');
const newmovementypeName = ref('');

const companyStore = useCompanyStore();
const editingCompany = ref(0);
const selectedCompany = ref(0);

const ClasificationMovementStore = useClasificationMovementStore();
const editingClasification = ref(0);
const selectedClasification = ref(0);

const filteredMovementsTypes = computed(() => {
    return movementStore.MovementTypes.filter(movementype =>
        showActive.value ? !movementype.delete_log_movement_type : movementype.delete_log_movement_type
    );
});

const isEditing = (id: number) => {
    return editingId.value === id;
};

const startEdit = (id: number, name: string, companyId: number, clasificationId: number) => {
    editingId.value = id;
    editingName.value = name;
    editingCompany.value = companyId;
    editingClasification.value = clasificationId;
};

const saveEdit = async (id: number) => {
    if (editingName.value.trim() && editingCompany.value && editingClasification.value) {
        await movementStore.editMovementType(id, editingName.value, editingCompany.value, editingClasification.value);
        editingId.value = null;
        editingName.value = '';
        editingCompany.value = 0;
        editingClasification.value = 0;
        await movementStore.fetchMovementTypes();
    }
};

const showActiveMovemenstypes = () => {
    showActive.value = true;
};

const showDeletedMovemenstypes = () => {
    showActive.value = false;
};

const removeMovementType = async (id: number) => {
    await movementStore.removeMovementType(id);
    await movementStore.fetchMovementTypes();
};

const restoreDeletedMovementType = async (id: number) => {
    await movementStore.restoreDeletedMovementType(id);
    await movementStore.fetchMovementTypes();
};

const createMovementType = async () => {
  if (newmovementypeName.value.trim() && selectedCompany.value && selectedClasification.value) {
      await movementStore.addMovementType(newmovementypeName.value, selectedCompany.value, selectedClasification.value);
      newmovementypeName.value = '';
      selectedCompany.value = 0;
      selectedClasification.value = 0;
      await movementStore.fetchMovementTypes();
}};

onMounted(async () => {
    await movementStore.fetchMovementTypes();
});

</script>