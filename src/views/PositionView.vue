<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Gestión de Puestos</h1>

    <!-- Filtros -->
    <div class="flex mb-6">
      <button
        @click="setActive(true)"
        :class="showActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-l shadow-md hover:bg-blue-700"
      >
        Activos ({{ totalActivos }})
      </button>
      <button
        @click="setActive(false)"
        :class="!showActive ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-r shadow-md hover:bg-red-600"
      >
        Eliminados ({{ totalEliminados }})
      </button>
    </div>

    <!-- Tabla -->
    <TableComponent
      :loader="positionStore.loading"
      :columns="columns"
      :data="filteredData"
      id="id_position"
      :flagRestore="showActive"
      :currentUserCompany="''"
      @actionSee="handleSee"
      @actionCreate="handleCreate"
      @actionUpdate="handleUpdate"
      @actionDanger="handleRemove"
      @actionRestore="handleRestore"
    ></TableComponent>

    <!-- Modal Detalles -->
    <Dialog v-model:visible="visibleDetails" modal header="Detalles del Puesto" :style="{ width: '30rem' }">
      <div class="flex flex-col gap-4">
        <div><strong>ID:</strong> {{ currentPosition?.id_position }}</div>
        <div><strong>Nombre:</strong> {{ currentPosition?.name_position }}</div>
        <div><strong>Compañía:</strong> {{ currentPosition?.name_company }}</div>
      </div>
    </Dialog>

    <!-- Modal Crear/Editar -->
    <Dialog v-model:visible="visibleForm" modal :header="isEdit ? 'Editar Puesto' : 'Crear Puesto'" :style="{ width: '30rem' }">
      <div class="flex flex-col gap-3">
        <label class="font-semibold">Nombre del puesto *</label>
        <InputText v-model="formPositionName" :class="{ 'p-invalid': nameError }"></InputText>
        <small v-if="nameError" class="p-error">{{ nameError }}</small>

        <label class="font-semibold">Compañía *</label>
        <Dropdown
          v-model="formCompanyId"
          :options="companyOptions"
          optionLabel="name_company"
          optionValue="id_company"
          placeholder="Seleccione una compañía"
          :class="{ 'p-invalid': companyError }"
        ></Dropdown>
        <small v-if="companyError" class="p-error">{{ companyError }}</small>

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" severity="danger" @click="visibleForm = false"></Button>
          <Button label="Guardar" severity="info" :disabled="!isFormValid" @click="submitForm"></Button>
        </div>
      </div>
    </Dialog>

    <!-- Confirmación -->
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import TableComponent from '@/components/TableComponent.vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';

import { usePositionStore } from '@/stores/positionStore';
import { useAuthStore } from '@/stores/authStore';
import { useCompanyStore } from '@/stores/companyStore';

const toast = useToast();
const confirm = useConfirm();

const positionStore = usePositionStore();
const authStore = useAuthStore();
const companyStore = useCompanyStore();

const showActive = ref(true);
const visibleDetails = ref(false);
const visibleForm = ref(false);
const isEdit = ref(false);
const editingId = ref<number | null>(null);
const currentPosition = ref<any>(null);

const formPositionName = ref('');
const formCompanyId = ref<number | null>(null);

const nameError = computed(() => {
  const name = formPositionName.value.trim();
  if (!name) return 'El nombre es obligatorio';
  if (name.length < 3) return 'Mínimo 3 caracteres';
  if (name.length > 100) return 'Máximo 100 caracteres';
  return null;
});

const companyError = computed(() => {
  return formCompanyId.value === null ? 'La compañía es obligatoria' : null;
});

const isFormValid = computed(() => !nameError.value && !companyError.value);

const columns = [
  { field: 'id_position', header: 'ID' },
  { field: 'name_position', header: 'Nombre' },
  { field: 'name_company', header: 'Compañía' }
];

const filteredData = computed(() =>
  positionStore.positions.filter(p =>
    showActive.value ? !p.delete_log_position : p.delete_log_position
  )
);

const totalActivos = computed(() =>
  positionStore.positions.filter(p => !p.delete_log_position).length
);

const totalEliminados = computed(() =>
  positionStore.positions.filter(p => p.delete_log_position).length
);

const companyOptions = computed(() => companyStore.companies);

onMounted(() => {
  positionStore.fetchPositions();
  companyStore.fetchCompanies();
});

const setActive = (val: boolean) => (showActive.value = val);

const handleSee = (id: number) => {
  currentPosition.value = positionStore.positions.find(p => p.id_position === id);
  visibleDetails.value = true;
};

const handleCreate = () => {
  isEdit.value = false;
  editingId.value = null;
  formPositionName.value = '';
  formCompanyId.value = null;
  visibleForm.value = true;
};

const handleUpdate = (id: number) => {
  const pos = positionStore.positions.find(p => p.id_position === id);
  if (pos) {
    isEdit.value = true;
    editingId.value = id;
    formPositionName.value = pos.name_position;
    // Se asume que el objeto pos contiene la propiedad id_company
    formCompanyId.value = pos.id_company || null;
    visibleForm.value = true;
  }
};

const submitForm = async () => {
  if (!isFormValid.value) return;
  // Guarda el id_company original del usuario
  const originalCompanyId = authStore.user?.company?.id_company;
  try {
    // Actualiza temporalmente el id_company del usuario con el seleccionado
    if (formCompanyId.value !== null) {
      authStore.user.company.id_company = formCompanyId.value;
    }
    if (isEdit.value && editingId.value !== null) {
      await positionStore.editPosition(editingId.value, formPositionName.value.trim());
      toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Puesto actualizado', life: 3000 });
    } else {
      await positionStore.addPosition(formPositionName.value.trim());
      toast.add({ severity: 'success', summary: 'Creado', detail: 'Puesto creado', life: 3000 });
    }
    await positionStore.fetchPositions();
    visibleForm.value = false;
    editingId.value = null;
    formPositionName.value = '';
    formCompanyId.value = null;
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Operación fallida', life: 3000 });
  } finally {
    // Restaura el id_company original del usuario
    if (originalCompanyId !== undefined) {
      authStore.user.company.id_company = originalCompanyId;
    }
  }
};

const handleRemove = (id: number) =>
  confirm.require({
    message: '¿Deseas eliminar este puesto?',
    accept: () => positionStore.removePosition(id).then(() => positionStore.fetchPositions())
  });

const handleRestore = (id: number) =>
  positionStore.restoreDeletedPosition(id).then(() => positionStore.fetchPositions());
</script>

<style scoped>
.p-invalid {
  border-color: var(--red-500) !important;
}
.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
