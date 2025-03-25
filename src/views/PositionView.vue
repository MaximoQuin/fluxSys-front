<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Gestión de Puestos</h1>

    <!-- Filtros -->
    <div class="flex mb-6">
      <button
        @click="showActivePositions"
        :class="showActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-l shadow-md hover:bg-blue-700"
      >
        Activos
      </button>
      <button
        @click="showDeletedPositions"
        :class="!showActive ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-r shadow-md hover:bg-red-600"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla de Puestos con componente reutilizable -->
    <TableComponent
      :loader="positionStore.loading"
      :columns="columns"
      :data="filteredPositions"
      id="id_position"
      :flagRestore="showActive"
      :currentUserCompany="authStore.user?.company?.name_company || ''"
      @actionSee="handleSee"
      @actionCreate="handleCreate"
      @actionUpdate="handleUpdate"
      @actionDanger="handleRemove"
      @actionRestore="handleRestore"
    />

    <!-- Modal Detalles -->
    <Dialog v-model:visible="visibleDetails" modal header="Detalles del Puesto" :style="{ width: '40rem' }">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-500">Nombre del puesto</span>
          <span class="font-semibold">{{ currentPosition?.name_position }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-500">Compañía</span>
          <span class="font-semibold">{{ currentPosition?.name_company }}</span>
        </div>
      </div>
    </Dialog>

    <!-- Modal Crear/Editar -->
    <Dialog v-model:visible="visibleForm" modal :header="isEdit ? 'Editar Puesto' : 'Crear Puesto'" :style="{ width: '30rem' }">
      <div class="flex flex-col gap-3">
        <label for="name" class="font-semibold">Nombre del puesto *</label>
        <InputText
          id="name"
          v-model="form.name_position"
          :class="{ 'p-invalid': nameError }"
          autocomplete="off"
        />
        <small v-if="nameError" class="p-error">{{ nameError }}</small>

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" severity="danger" @click="visibleForm = false" />
          <Button
            label="Guardar"
            severity="info"
            :disabled="!!nameError"
            @click="isEdit ? updatePosition() : createPosition()"
          />
        </div>
      </div>
    </Dialog>

    <!-- Confirmación -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePositionStore } from '@/stores/positionStore';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import TableComponent from '@/components/TableComponent.vue';

const toast = useToast();
const confirm = useConfirm();

const positionStore = usePositionStore();
const authStore = useAuthStore();

const showActive = ref(true);
const visibleDetails = ref(false);
const visibleForm = ref(false);
const isEdit = ref(false);
const currentPosition = ref<any>(null);
const editingId = ref<number | null>(null);

const form = ref({
  name_position: ''
});

const nameError = computed(() => {
  const name = form.value.name_position?.trim() || '';
  if (!name) return 'El nombre es obligatorio';
  if (name.length < 3) return 'Mínimo 3 caracteres';
  if (name.length > 100) return 'Máximo 100 caracteres';
  return null;
});

const filteredPositions = computed(() =>
  positionStore.positions.filter(p =>
    showActive.value ? !p.delete_log_position : p.delete_log_position
  )
);

const columns = [
  { field: 'id_position', header: 'ID' },
  { field: 'name_position', header: 'Nombre' },
  { field: 'name_company', header: 'Compañía' }
];

onMounted(() => {
  positionStore.fetchPositions();
});

const showActivePositions = () => (showActive.value = true);
const showDeletedPositions = () => (showActive.value = false);

const handleSee = async (id: number) => {
  await positionStore.fetchPositionById(id);
  currentPosition.value = positionStore.currentPosition;
  visibleDetails.value = true;
};

const handleCreate = () => {
  isEdit.value = false;
  form.value.name_position = '';
  visibleForm.value = true;
};

const handleUpdate = (id: number) => {
  const pos = positionStore.positions.find(p => p.id_position === id);
  if (pos) {
    isEdit.value = true;
    editingId.value = id;
    form.value.name_position = pos.name_position;
    visibleForm.value = true;
  }
};

const createPosition = async () => {
  if (nameError.value) return;
  try {
    await positionStore.addPosition(form.value.name_position);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Puesto creado', life: 3000 });
    visibleForm.value = false;
    positionStore.fetchPositions();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear', life: 3000 });
  }
};

const updatePosition = async () => {
  if (!editingId.value || nameError.value) return;
  try {
    await positionStore.editPosition(editingId.value, form.value.name_position);
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Puesto actualizado', life: 3000 });
    visibleForm.value = false;
    positionStore.fetchPositions();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar', life: 3000 });
  }
};

const handleRemove = (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar este puesto?',
    header: 'Confirmar',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await positionStore.removePosition(id);
      toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Puesto eliminado', life: 3000 });
      positionStore.fetchPositions();
    }
  });
};

const handleRestore = async (id: number) => {
  try {
    await positionStore.restoreDeletedPosition(id);
    toast.add({ severity: 'success', summary: 'Restaurado', detail: 'Puesto restaurado', life: 3000 });
    positionStore.fetchPositions();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo restaurar', life: 3000 });
  }
};
</script>

<style scoped>
.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
