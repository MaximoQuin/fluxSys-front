<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Departamentos</h1>

    <!-- Filtros -->
<div class="mb-4">
      <button
        @click="showActiveDepartments"
        :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive }"
        class="px-4 py-2 rounded-l"
      >
        Activos
      </button>
      <button
        @click="showDeletedDepartments"
        :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive }"
        class="px-4 py-2 rounded-r"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla reutilizable -->
    <TableComponent
      :loader="departmentStore.loading"
      :columns="mappedColumns"
      :data="filteredDepartments"
      id="id_department"
      :flagRestore="showActive"
      :currentUserCompany="''"
      @actionSee="handleSee"
      @actionCreate="handleCreate"
      @actionUpdate="handleUpdate"
      @actionDanger="confirmDelete"
      @actionRestore="restoreDeletedDepartment"
    />

    <!-- Modal de crear/editar -->
    <Dialog
      v-model:visible="visibleForm"
      modal
      :header="isEdit ? 'Editar Departamento' : 'Crear Departamento'"
      :style="{ width: '30rem' }"
    >
      <div class="flex flex-col gap-4">
        <label for="name" class="font-semibold">Nombre del departamento:</label>
        <InputText
          v-model="formDepartment"
          id="name"
          :class="{ 'p-invalid': departmentError }"
        />
        <small v-if="departmentError" class="p-error">
          {{ departmentError }}
        </small>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancelar" severity="danger" @click="visibleForm = false" />
        <Button
          label="Guardar"
          severity="info"
          :disabled="!isFormValid"
          @click="isEdit ? updateDepartment() : createDepartment()"
        />
      </div>
    </Dialog>

    <!-- Modal de detalles del departamento -->
    <Dialog
      v-model:visible="visibleDetails"
      modal
      header="Detalles del Departamento"
      :style="{ width: '40rem' }"
    >
      <div v-if="currentDepartment" class="grid grid-cols-1 gap-6">
        <Card>
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-sitemap text-blue-500" style="font-size: 1.5rem"></i>
              <span>Información del Departamento</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Nombre</span>
                <span class="font-semibold text-lg">{{ currentDepartment.name_deparment }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Compañía</span>
                <span class="font-semibold text-lg">{{ currentDepartment.name_company }}</span>
              </div>
              <div class="flex flex-col col-span-2">
                <span class="text-sm font-medium text-gray-500">Estado</span>
                <Tag
                  :value="currentDepartment.delete_log_department ? 'Eliminado' : 'Activo'"
                  :severity="currentDepartment.delete_log_department ? 'danger' : 'success'"
                  class="text-sm w-fit"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </Dialog>

    <!-- Confirmación -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDepartmentStore } from '@/stores/departmentStore';
import TableComponent from '@/components/TableComponent.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const departmentStore = useDepartmentStore();
const confirm = useConfirm();
const toast = useToast();

// Estado local
const showActive = ref(true);
const visibleForm = ref(false);
const isEdit = ref(false);
const editingId = ref<number | null>(null);
const formDepartment = ref('');
const visibleDetails = ref(false);
const currentDepartment = ref<any | null>(null);

// Columnas para la tabla
const mappedColumns = [
  { field: 'id_department', header: 'ID' },
  { field: 'name_deparment', header: 'Nombre' },
  { field: 'name_company', header: 'Compañía' }
];

// Computeds
const filteredDepartments = computed(() =>
  departmentStore.departments.filter(dept =>
    showActive.value ? !dept.delete_log_department : dept.delete_log_department
  )
);

const departmentError = computed(() => {
  const name = formDepartment.value.trim();
  if (!name) return 'El nombre es obligatorio';
  if (name.length < 3) return 'Debe tener al menos 3 caracteres';
  if (name.length > 100) return 'Máximo 100 caracteres';
  return null;
});

const isFormValid = computed(() => !departmentError.value);

// Métodos
const showActiveDepartments = () => (showActive.value = true);
const showDeletedDepartments = () => (showActive.value = false);

const handleCreate = () => {
  isEdit.value = false;
  formDepartment.value = '';
  visibleForm.value = true;
};

const handleUpdate = (id: number) => {
  const dept = departmentStore.departments.find(d => d.id_department === id);
  if (dept) {
    isEdit.value = true;
    editingId.value = id;
    formDepartment.value = dept.name_deparment;
    visibleForm.value = true;
  }
};

const updateDepartment = async () => {
  if (!isFormValid.value || !editingId.value) return;
  await departmentStore.editDepartment(editingId.value, formDepartment.value);
  toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Departamento actualizado', life: 3000 });
  visibleForm.value = false;
  editingId.value = null;
  formDepartment.value = '';
  await departmentStore.fetchDepartments();
};

const createDepartment = async () => {
  if (!isFormValid.value) return;
  await departmentStore.addDepartment(formDepartment.value);
  toast.add({ severity: 'success', summary: 'Creado', detail: 'Departamento creado', life: 3000 });
  visibleForm.value = false;
  formDepartment.value = '';
  await departmentStore.fetchDepartments();
};

const confirmDelete = (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar este departamento?',
    header: 'Confirmación',
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
    accept: async () => {
      try {
        await departmentStore.removeDepartment(id);
        await departmentStore.fetchDepartments();
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Departamento eliminado correctamente',
          life: 3000
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el departamento',
          life: 3000
        });
      }
    },
    reject: () => {}
  });
};


const restoreDeletedDepartment = async (id: number) => {
  await departmentStore.restoreDeletedDepartment(id);
  toast.add({ severity: 'success', summary: 'Restaurado', detail: 'Departamento restaurado', life: 3000 });
  await departmentStore.fetchDepartments();
};

const handleSee = async (id: number) => {
  const dept = departmentStore.departments.find(d => d.id_department === id);
  if (dept) {
    currentDepartment.value = dept;
    visibleDetails.value = true;
  }
};

onMounted(() => {
  departmentStore.fetchDepartments();
});
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
