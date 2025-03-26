<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Puestos</h1>

    <!-- Filtros -->
    <div class="flex mb-6">
      <button
        @click="setActive(true)"
        :class="showActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-l shadow-md hover:bg-blue-700 hover:text-white active:bg-blue-800 transiton-colors"
      >
        Activos
      </button>
      <button
        @click="setActive(false)"
        :class="!showActive ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-r shadow-md hover:bg-red-600 hover:text-white active:bg-red-800 transition-colors"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla -->
    <TableComponent
      :loader="positionStore.loading"
      :columns="columns"
      :data="filteredData"
      id="id_position"
      :flagRestore="showActive"
      :currentUserId="0"
      @actionSee="handleSee"
      @actionCreate="handleCreate"
      @actionUpdate="handleUpdate"
      @actionDanger="handleRemove"
      @actionRestore="handleRestore"
    ></TableComponent>

    <!-- Modal Detalles -->
    <Dialog v-model:visible="visibleDetails" modal header="Detalles del Puesto" :style="{ width: '30rem' }">
      <div class="flex flex-col gap-4">
        <div><strong>Nombre:</strong> {{ currentPosition?.name_position }}</div>
        <div><strong>Compañía:</strong> {{ currentPosition?.name_company }}</div>
      </div>
    </Dialog>

    <!-- Modal Crear/Editar -->
    <Dialog v-model:visible="visibleForm" modal :header="isEdit ? 'Editar Puesto' : 'Crear Puesto'"
      :style="{ width: '30rem' }">
      <div class="flex flex-col gap-3">
        <label class="font-semibold">Nombre del puesto *</label>
        <InputText v-model="formPositionName" :class="{ 'p-invalid': nameError }"
          placeholder="Ingrese el nombre del puesto"></InputText>
        <small v-if="nameError" class="p-error">{{ nameError }}</small>

        <!-- Selector de compañía solo para administradores -->
        <template v-if="authStore.isAdmin">
          <label class="font-semibold">Compañía *</label>
          <Dropdown v-model="formCompanyId" :options="companyOptions" optionLabel="name_company"
            optionValue="id_company" placeholder="Seleccione una compañía" :class="{ 'p-invalid': companyError }">
          </Dropdown>
          <small v-if="companyError" class="p-error">{{ companyError }}</small>
        </template>

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" severity="danger" @click="visibleForm = false"></Button>
          <Button label="Guardar" severity="info" :disabled="!isFormValid" @click="submitForm"></Button>
        </div>
      </div>
    </Dialog>

    <!-- Confirmación -->
    <ConfirmDialog></ConfirmDialog>
    <Toast />
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
import Toast from 'primevue/toast';

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

// Validación mejorada basada en el ViewModel
const nameError = computed(() => {
  const name = formPositionName.value.trim();

  // Validar si está vacío
  if (!name) return 'El nombre es obligatorio';

  // Validar contra caracteres especiales
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(name)) {
    return 'No se permiten caracteres especiales';
  }

  // Validar solo letras y espacios según el pattern del ViewModel
  const validCharsRegex = /^[a-zA-Z\s]+$/;
  if (!validCharsRegex.test(name)) {
    return 'Solo se permiten letras y espacios';
  }

  // Validar longitud mínima y máxima
  if (name.length < 3) return 'Mínimo 3 caracteres';
  if (name.length > 50) return 'Máximo 50 caracteres';

  return null;
});

// Validación de compañía solo para administradores
const companyError = computed(() => {
  return authStore.isAdmin && formCompanyId.value === null ? 'La compañía es obligatoria' : null;
});

// Validar formulario según rol
const isFormValid = computed(() => {
  return !nameError.value && (!authStore.isAdmin || !companyError.value);
});

const columns = [
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

  // Si no es admin, asignar automáticamente la compañía del usuario
  if (!authStore.isAdmin) {
    formCompanyId.value = authStore.user?.company?.id_company || null;
  } else {
    formCompanyId.value = null;
  }

  visibleForm.value = true;
};

const handleUpdate = (id: number) => {
  const pos = positionStore.positions.find(p => p.id_position === id);
  if (pos) {
    isEdit.value = true;
    editingId.value = id;
    formPositionName.value = pos.name_position;
    formCompanyId.value = pos.id_company || null;
    visibleForm.value = true;
  }
};

const submitForm = async () => {
  if (!isFormValid.value) return;

  try {
    // Para usuarios no admin, asegurar que siempre use su compañía
    const companyIdToUse = authStore.isAdmin ? formCompanyId.value : authStore.user?.company?.id_company;

    if (isEdit.value && editingId.value !== null) {
      await positionStore.editPosition(
        editingId.value,
        formPositionName.value.trim(),
        companyIdToUse
      );
      toast.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'Puesto actualizado correctamente',
        life: 3000
      });
    } else {
      await positionStore.addPosition(
        formPositionName.value.trim(),
        companyIdToUse
      );
      toast.add({
        severity: 'success',
        summary: 'Creado',
        detail: 'Puesto creado correctamente',
        life: 3000
      });
    }

    await positionStore.fetchPositions();
    visibleForm.value = false;
    editingId.value = null;
    formPositionName.value = '';
    formCompanyId.value = null;
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Operación fallida',
      life: 3000
    });
  }
};

const handleRemove = (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar este puesto?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Eliminar',
      severity: 'danger'
    },
    accept: () => {
      positionStore.removePosition(id)
        .then(() => {
          positionStore.fetchPositions();
          toast.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Puesto eliminado correctamente',
            life: 3000
          });
        })
        .catch(() => {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el puesto',
            life: 3000
          });
        });
    }
  });
};

const handleRestore = (id: number) => {
  positionStore.restoreDeletedPosition(id)
    .then(() => {
      positionStore.fetchPositions();
      toast.add({
        severity: 'success',
        summary: 'Restaurado',
        detail: 'Puesto restaurado correctamente',
        life: 3000
      });
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo restaurar el puesto',
        life: 3000
      });
    });
};
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
