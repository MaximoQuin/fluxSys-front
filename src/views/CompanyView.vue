<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Empresas</h1>

    <!-- Filtros -->
    <div class="mb-4">
      <button @click="showActiveCompanies" :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive }"
        class="px-4 py-2 rounded-l">
        Activas
      </button>
      <button @click="showDeletedCompanies" :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive }"
        class="px-4 py-2 rounded-r">
        Eliminadas
      </button>
    </div>

    <!-- Tabla de empresas -->
    <!-- <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">Nombre</th>
          <th class="py-2 px-4 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="company in filteredCompanies" :key="company.id_company" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b">{{ company.id_company }}</td>
          <td class="py-2 px-4 border-b">
            <span v-if="!isEditing(company.id_company)">{{ company.name_company }}</span>
            <div v-else class="flex items-center">
              <input v-model="editingName" class="border rounded px-2 py-1" />
              <button @click="saveEdit(company.id_company)" class="bg-green-500 text-white px-4 py-2 rounded ml-2">
                Aceptar
              </button>
            </div>
          </td>
          <td class="py-2 px-4 border-b">
            <button v-if="showActive && !isEditing(company.id_company)"
              @click="startEdit(company.id_company, company.name_company)"
              class="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
              Editar
            </button>
            <button v-if="showActive && !isEditing(company.id_company)" @click="removeCompany(company.id_company)"
              class="bg-red-500 text-white px-4 py-2 rounded">
              Eliminar
            </button>
            <button v-else-if="!isEditing(company.id_company)" @click="restoreDeletedCompany(company.id_company)"
              class="bg-green-500 text-white px-4 py-2 rounded">
              Restaurar
            </button>
          </td>
        </tr>
      </tbody>
    </table> -->
    <TableComponent v-if="!companyStore.loading" :columns="mappedColumns" :data="filteredCompanies" id="id_company"
      :flagRestore="showActive" @actionUpdate="startEdit($event)" @actionDanger="removeCompany($event)"
      @actionRestore="restoreDeletedCompany($event)">
    </TableComponent>

    <!-- Cargando -->
    <div v-else class="mt-4">
      Cargando...
    </div>

    <ConfirmDialog></ConfirmDialog>

    <!-- Crear Nueva Empresa -->
    <div class="mt-4">
      <h2 class="text-xl font-bold">Crear Empresa</h2>
      <div class="flex items-center mt-2">
        <input v-model="newCompanyName" type="text" placeholder="Nombre de la empresa"
          class="border rounded px-4 py-2 mr-2" />
        <button @click="createCompany" class="bg-blue-500 text-white px-4 py-2 rounded">
          Crear
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCompanyStore } from '@/stores/companyStore';
import TableComponent from '@/components/TableComponent.vue';

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();

const companyStore = useCompanyStore();
const showActive = ref(true);
const editingId = ref<number | null>(null);
const editingName = ref('');
const newCompanyName = ref('');

const mappedColumns = [
  { field: 'id_company', header: 'ID' },
  { field: 'name_company', header: 'Nombre' }
];

const filteredCompanies = computed(() => {
  return companyStore.companies.filter(company =>
    showActive.value ? !company.delete_log_company : company.delete_log_company
  );
});

const isEditing = (id: number) => {
  return editingId.value === id;
};

const startEdit = (id: number, name?: string) => {
  editingId.value = id;
  // editingName.value = name;
};

const saveEdit = async (id: number) => {
  if (editingName.value.trim()) {
    await companyStore.editCompany(id, editingName.value);
    editingId.value = null;
    editingName.value = '';
    await companyStore.fetchCompanies(); // Refrescar la lista
  }
};

const showActiveCompanies = () => {
  showActive.value = true;
};

const showDeletedCompanies = () => {
  showActive.value = false;
};

const removeCompany = async (id: number) => {
  confirmDelete(id)
};

const restoreDeletedCompany = async (id: number) => {
  await companyStore.restoreDeletedCompany(id);
  await companyStore.fetchCompanies(); // Refrescar la lista
};

const createCompany = async () => {
  if (newCompanyName.value.trim()) {
    await companyStore.addCompany(newCompanyName.value);
    newCompanyName.value = ''; // Limpiar el campo después de crear la empresa
    await companyStore.fetchCompanies(); // Refrescar la lista
  }
};

const confirmDelete = (id: number) => {
  confirm.require({
    message: '¿Quieres eliminar esta compañia?',
    header: 'Eliminar',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Eliminar',
      severity: 'danger'
    },
    accept: async () => {
      try {
        await companyStore.removeCompany(id);
        await companyStore.fetchCompanies();
        toast.add({ severity: 'info', summary: 'Eliminado', detail: 'Compañia eliminada', life: 3000 });
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al eliminar la compañía. Intenta nuevamente.', life: 3000 });
      }
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rechazado', detail: 'Rechazaste la operación', life: 3000 });
    }
  });
};

onMounted(() => {
  companyStore.fetchCompanies();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
