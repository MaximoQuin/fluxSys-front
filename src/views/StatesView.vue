<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de estados</h1>

    <!-- Filtros -->
    <div class="mb-4">
      <button @click="showActiveStates" :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive }"
        class="px-4 py-2 rounded-l">
        Activas
      </button>
      <button @click="showDeletedStates" :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive }"
        class="px-4 py-2 rounded-r">
        Eliminadas
      </button>
    </div>

    <!-- Tabla de estados -->
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">Nombre</th>
          <th class="py-2 px-4 border-b">Compañia</th>
          <th class="py-2 px-4 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="state in filteredStates" :key="state.id_state" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b">{{ state.id_state }}</td>
          <td class="py-2 px-4 border-b">
            <span v-if="!isEditing(state.id_state)">{{ state.name_state
            }}</span>
            <div v-else class="flex items-center">
              <input v-model="editingName" class="border rounded px-2 py-1" />
              <button @click="saveEdit(state.id_state)" class="bg-green-500 text-white px-4 py-2 rounded ml-2">
                Aceptar
              </button>
            </div>
          </td>
          <td class="py-2 px-4 border-b">{{ state.name_company }}</td>
          <td class="py-2 px-4 border-b">
            <button v-if="showActive && !isEditing(state.id_state)"
              @click="startEdit(state.id_state, state.name_state, state.id_company_Id)"
              class="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
              Editar
            </button>
            <button v-if="showActive && !isEditing(state.id_state)" @click="removeState(state.id_state)"
              class="bg-red-500 text-white px-4 py-2 rounded">
              Eliminar
            </button>
            <button v-else-if="!isEditing(state.id_state)" @click="restoreDeletedState(state.id_state)"
              class="bg-green-500 text-white px-4 py-2 rounded">
              Restaurar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Cargando -->
    <!-- <div v-if="loading" class="mt-4">
      Cargando...
    </div> -->

    <!-- Crear Nuevo estado -->
    <div class="mt-4">
      <h2 class="text-xl font-bold">Crear estado</h2>
      <div class="flex items-center mt-2">
        <input v-model="newStateName" type="text" placeholder="Nombre del estado"
          class="border rounded px-4 py-2 mr-2" />
        <div class="dropdown" ref="dropdown" @click="toggleDropdown">
          <button class="dropdown-btn">{{ selectedCompany || "Selecciona una empresa" }}</button>
          <div v-if="isOpen" class="dropdown-content">
            <a v-for="company in filteredCompanies" :key="company.id_company"
              @click="selectCompany(company.id_company, company.name_company)">
              {{ company.name_company }}
            </a>
          </div>
        </div>
        <button @click="createState" class="bg-blue-500 text-white px-4 py-2 rounded">
          Crear
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useStateStore } from '../stores/stateStore';
import { useCompanyStore } from '@/stores/companyStore';

const statesStore = useStateStore();
const showActive = ref(true);
const editingId = ref<number | null>(null);
const editingName = ref('');
const editingCompany = ref('');

const newStateName = ref('');

const isOpen = ref(false);
const idSelectedCompany = ref(null);
const selectedCompany = ref(null);
const dropdown = ref(null);

const companyStore = useCompanyStore();

const filteredCompanies = computed(() => {
  return companyStore.companies.filter(company =>
    showActive.value ? !company.delete_log_company : company.delete_log_company
  );
});

const filteredStates = computed(() => {
  return statesStore.states.filter(state =>
    showActive.value ? !state.delete_log_state : state.delete_log_state
  );
});

const isEditing = (id: number) => {
  return editingId.value === id;
};

const startEdit = (id: number, name: string, idCompanyId: number) => {
  editingId.value = id;
  editingName.value = name;
  editingCompany.value = idCompanyId;
  // console.log(editingCompany.value);

};

const saveEdit = async (id: number) => {
  if (editingName.value.trim()) {
    await statesStore.editState(id, editingName.value, 1);
    editingId.value = null;
    editingName.value = '';
    editingCompany.value = '';
    await statesStore.fetchStates();
  }
};

const showActiveStates = () => {
  showActive.value = true;
};

const showDeletedStates = () => {
  showActive.value = false;
};

const removeState = async (id: number) => {
  await statesStore.removeState(id);
  await statesStore.fetchStates();
};

const restoreDeletedState = async (id: number) => {
  await statesStore.restoreDeletedState(id);
  await statesStore.fetchStates();
};

const createState = async () => {
  if (newStateName.value.trim()) {
    await statesStore.addState(newStateName.value, idSelectedCompany.value);
    newStateName.value = '';
    await statesStore.fetchStates();
  }
};

onMounted(() => {
  statesStore.fetchStates();
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectCompany = (id, name) => {
  idSelectedCompany.value = id;
  selectedCompany.value = name;
  isOpen.value = false;
};

onClickOutside(dropdown, () => isOpen.value = false);
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.dropdown-content {
  z-index: 999;
  position: absolute;
  background: white;
  min-width: 160px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  margin-top: 5px;
}

.dropdown-content a {
  display: block;
  padding: 10px;
  text-decoration: none;
  color: #333;
  transition: background 0.3s;
  cursor: pointer;
}

.dropdown-content a:hover {
  background: #f0f0f0;
}
</style>
