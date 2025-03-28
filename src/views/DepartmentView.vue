<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Departamentos</h1>

    <!-- Filtros -->
    <div class="flex mb-6">
      <button
        @click="setActive(true)"
        :class="showActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-l shadow-md hover:bg-blue-700 hover:text-white active:bg-blue-800 transition-colors"
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
    <TableComponent class="h-118"
      :loader="departmentStore.loading"
      :columns="columns"
      :data="filteredDepartments"
      id="id_department"
      :flagRestore="showActive"
      :currentUserId="0"
      @actionSee="handleSee"
      @actionCreate="handleCreate"
      @actionUpdate="handleUpdate"
      @actionDanger="handleRemove"
      @actionRestore="handleRestore"
    ></TableComponent>

    <!-- Modal Detalles -->
    <Dialog v-model:visible="visibleDetails" modal header="Detalles del Departamento" :style="{ width: '30rem' }">
      <div class="flex flex-col gap-4">
        <div><strong>Nombre:</strong> {{ currentDepartment?.name_deparment }}</div>
        <div><strong>Compañía:</strong> {{ currentDepartment?.name_company }}</div>
      </div>
    </Dialog>

    <!-- Modal Crear/Editar -->
    <Dialog v-model:visible="visibleForm" modal :header="isEdit ? 'Editar Departamento' : 'Crear Departamento'"
      :style="{ width: '30rem' }">
      <div class="flex flex-col gap-3">
        <label class="font-semibold">Nombre del departamento *</label>
        <InputText v-model="formDepartmentName" :class="{ 'p-invalid': nameError }"
          placeholder="Ingrese el nombre del departamento"></InputText>
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

import { useDepartmentStore } from '@/stores/departmentStore';
import { useAuthStore } from '@/stores/authStore';
import { useCompanyStore } from '@/stores/companyStore';

const toast = useToast();
const confirm = useConfirm();

const departmentStore = useDepartmentStore();
const authStore = useAuthStore();
const companyStore = useCompanyStore();

const showActive = ref(true);
const visibleDetails = ref(false);
const visibleForm = ref(false);
const isEdit = ref(false);
const editingId = ref<number | null>(null);
const currentDepartment = ref<any>(null);

const formDepartmentName = ref('');
const formCompanyId = ref<number | null>(null);

// Validación
const nameError = computed(() => {
  const name = formDepartmentName.value.trim();

  if (!name) return 'El nombre es obligatorio';

  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(name)) {
    return 'No se permiten caracteres especiales';
  }

  const validCharsRegex = /^[a-zA-Z\s]+$/;
  if (!validCharsRegex.test(name)) {
    return 'Solo se permiten letras y espacios';
  }

  if (name.length < 3) return 'Mínimo 3 caracteres';
  if (name.length > 50) return 'Máximo 50 caracteres';

  return null;
});

const companyError = computed(() => {
  return authStore.isAdmin && formCompanyId.value === null ? 'La compañía es obligatoria' : null;
});

const isFormValid = computed(() => {
  return !nameError.value && (!authStore.isAdmin || !companyError.value);
});

const columns = [
  { field: 'name_deparment', header: 'Nombre' },
  { field: 'name_company', header: 'Compañía' }
];

const filteredDepartments = computed(() =>
  departmentStore.departments.filter(d =>
    showActive.value ? !d.delete_log_department : d.delete_log_department
  )
);

const companyOptions = computed(() => companyStore.companies);

onMounted(() => {
  departmentStore.fetchDepartments();
  companyStore.fetchCompanies();
});

const setActive = (val: boolean) => (showActive.value = val);

const handleSee = (id: number) => {
  currentDepartment.value = departmentStore.departments.find(d => d.id_department === id);
  visibleDetails.value = true;
};

const handleCreate = () => {
  isEdit.value = false;
  editingId.value = null;
  formDepartmentName.value = '';

  if (!authStore.isAdmin) {
    formCompanyId.value = authStore.user?.company?.id_company || null;
  } else {
    formCompanyId.value = null;
  }

  visibleForm.value = true;
};

const handleUpdate = (id: number) => {
  const dept = departmentStore.departments.find(d => d.id_department === id);
  if (dept) {
    isEdit.value = true;
    editingId.value = id;
    formDepartmentName.value = dept.name_deparment;
    formCompanyId.value = dept.id_company || null;
    visibleForm.value = true;
  }
};

const submitForm = async () => {
  if (!isFormValid.value) return;

  try {
    const companyIdToUse = authStore.isAdmin ? formCompanyId.value : authStore.user?.company?.id_company;

    if (isEdit.value && editingId.value !== null) {
      await departmentStore.editDepartment(
        editingId.value,
        formDepartmentName.value.trim(),
        companyIdToUse
      );
      toast.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'Departamento actualizado correctamente',
        life: 3000
      });
    } else {
      await departmentStore.addDepartment(
        formDepartmentName.value.trim(),
        companyIdToUse
      );
      toast.add({
        severity: 'success',
        summary: 'Creado',
        detail: 'Departamento creado correctamente',
        life: 3000
      });
    }

    await departmentStore.fetchDepartments();
    visibleForm.value = false;
    editingId.value = null;
    formDepartmentName.value = '';
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
    message: '¿Estás seguro de eliminar este departamento?',
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
      departmentStore.removeDepartment(id)
        .then(() => {
          departmentStore.fetchDepartments();
          toast.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Departamento eliminado correctamente',
            life: 3000
          });
        })
        .catch(() => {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el departamento',
            life: 3000
          });
        });
    }
  });
};

const handleRestore = (id: number) => {
  departmentStore.restoreDeletedDepartment(id)
    .then(() => {
      departmentStore.fetchDepartments();
      toast.add({
        severity: 'success',
        summary: 'Restaurado',
        detail: 'Departamento restaurado correctamente',
        life: 3000
      });
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo restaurar el departamento',
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

.p-invalid {
  border-color: var(--red-500) !important;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
