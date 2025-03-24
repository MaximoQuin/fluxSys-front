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
    <TableComponent :loader="companyStore.loading" :columns="mappedColumns" :data="filteredCompanies" id="id_company"
      :flagRestore="showActive" @actionSee="handleSee" @actionCreate="handleCreate" @actionUpdate="handleUpdate"
      @actionDanger="handleRemove" @actionRestore="restoreDeletedCompany" :currentUserCompany="currentUserCompany">
    </TableComponent>

    <!-- Modal de detalles -->
    <Dialog v-model:visible="visible2" modal header="Detalles de la compañia" :style="{ width: '25rem' }">
      <div class="flex gap-2 mb-4">
        <p><b>Nombre de compañia:</b></p>
        <p>{{ currentCompany.name_company }}</p>
      </div>
    </Dialog>

    <!-- Modal de editar y crear -->
    <Dialog v-model:visible="visible" modal :header="isEdit ? 'Editar compañia' : 'Crear compañia'"
      :style="{ width: '25rem' }">
      <div class="flex flex-col gap-2 mb-4">
        <label for="name" class="font-semibold w-24">Nombre de compañia:</label>
        <InputText v-model="newCompanyName" id="name" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="danger" @click="visible = false"></Button>
        <Button type="button" label="Guardar" severity="info"
          @click="isEdit ? updateCompany() : createCompany(); visible = false"></Button>
      </div>
    </Dialog>

    <!-- Modal de confirmación para borrar -->
    <ConfirmDialog></ConfirmDialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCompanyStore } from '@/stores/companyStore';
import { useAuthStore } from '@/stores/authStore'; // Importar el authStore
import TableComponent from '@/components/TableComponent.vue';

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();

const visible = ref(false);
const isEdit = ref(false);
const idCompany = ref(0);

const visible2 = ref(false);
const currentCompany = ref();

const companyStore = useCompanyStore();
const authStore = useAuthStore(); // Usar el authStore

const showActive = ref(true);
const newCompanyName = ref('');

// Obtener el nombre de la compañía del usuario actual
const currentUserCompany = computed(() => authStore.user?.company?.name_company || '');

// Solo incluye la columna "Nombre"
const mappedColumns = [
  { field: 'name_company', header: 'Nombre' }
];

const filteredCompanies = computed(() => {
  return companyStore.companies.filter(company =>
    showActive.value ? !company.delete_log_company : company.delete_log_company
  );
});

const showActiveCompanies = () => {
  showActive.value = true;
};

const showDeletedCompanies = () => {
  showActive.value = false;
};

const handleRemove = async (id: number) => {
  deleteCompany(id);
};

const restoreDeletedCompany = async (id: number) => {
  await companyStore.restoreDeletedCompany(id);
  await companyStore.fetchCompanies(); // Refrescar la lista
};

const handleSee = (id: number) => {
  const Findcompany = filteredCompanies.value.find(company => company.id_company === id);
  if (Findcompany) {
    currentCompany.value = Findcompany;
    console.log(currentCompany.value);

    visible2.value = true;
  }
};

const handleCreate = () => {
  isEdit.value = false;
  newCompanyName.value = '';
  visible.value = true;
};

const createCompany = async () => {
  // if (newCompanyName.value.trim()) {
  await companyStore.addCompany(newCompanyName.value);
  newCompanyName.value = ''; // Limpiar el campo después de crear la empresa
  await companyStore.fetchCompanies(); // Refrescar la lista
  // }
};

// const handleUpdate = async (id: number, newValue: string) => {
const handleUpdate = async (id: number) => {
  isEdit.value = true;
  idCompany.value = id;
  const companyEdit = filteredCompanies.value.find(company => company.id_company === id);
  newCompanyName.value = companyEdit!.name_company;
  visible.value = true;
};

const updateCompany = async () => {
  await companyStore.editCompany(idCompany.value, newCompanyName.value);
  await companyStore.fetchCompanies(); // Refrescar la lista
};

const deleteCompany = (id: number) => {
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
        toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al eliminar. Intenta nuevamente.', life: 3000 });
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
