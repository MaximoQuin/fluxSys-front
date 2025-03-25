<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Estados</h1>

    <!-- Filtros mejorados -->
    <div class="mb-4">
      <button
        @click="showActiveStates"
        :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive }"
        class="px-4 py-2 rounded-l transition-colors duration-200"
      >
        Activos
      </button>
      <button
        @click="showDeletedStates"
        :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive }"
        class="px-4 py-2 rounded-r transition-colors duration-200"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla -->
    <TableComponent 
      :loader="stateStore.loading" 
      :columns="mappedColumns" 
      :data="filteredStates" 
      id="id_state"
      :flagRestore="showActive"
      @actionSee="handleSee"
      @actionCreate="handleCreate"
      @actionUpdate="handleUpdate"
      @actionDanger="handleRemove"
      @actionRestore="restoreDeletedState"
      :currentUserCompany="''"
    />

    <!-- Modal de detalles -->
    <Dialog v-model:visible="visibleDetails" modal header="Detalles del Estado" :style="{ width: '40rem' }">
      <div v-if="currentState" class="grid grid-cols-1 gap-6">
        <Card>
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-flag text-primary" style="font-size: 1.5rem"></i>
              <span>Información del Estado</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Nombre</span>
                <span class="font-semibold text-lg">{{ currentState.name_state }}</span>
              </div>
              <div class="flex flex-col col-span-2">
                <span class="text-sm font-medium text-gray-500">Estado</span>
                <Tag 
                  :value="currentState.delete_log_state ? 'Eliminado' : 'Activo'" 
                  :severity="currentState.delete_log_state ? 'danger' : 'success'" 
                  class="text-sm w-fit"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </Dialog>

    <!-- Modal de formulario -->
    <Dialog v-model:visible="visibleForm" modal :header="isEdit ? 'Editar Estado' : 'Crear Estado'" :style="{ width: '40rem' }">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="stateName" class="font-semibold">Nombre del estado*</label>
          <InputText
            v-model="formState.name_state"
            id="stateName"
            autocomplete="off"
            :class="{ 'p-invalid': nameError }"
            @keypress="preventInvalidChars"
            placeholder="Ingrese el nombre (solo letras y espacios)"
          />
          <small v-if="nameError" class="p-error">
            {{ nameError }}
          </small>
          <small v-else class="text-gray-500 text-xs">
            Requerido (3-50 caracteres, solo letras y espacios)
          </small>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancelar" severity="secondary" outlined @click="closeForm" />
        <Button type="button" label="Guardar" severity="primary" :disabled="!isFormValid" @click="submitForm" :loading="loadingSubmit" />
      </div>
    </Dialog>

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStateStore } from '@/stores/stateStore';
import TableComponent from '@/components/TableComponent.vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const stateStore = useStateStore();
const confirm = useConfirm();
const toast = useToast();

const showActive = ref(true);
const visibleDetails = ref(false);
const visibleForm = ref(false);
const isEdit = ref(false);
const currentState = ref<any>(null);
const editingId = ref<number | null>(null);
const loadingSubmit = ref(false);

const formState = ref({
  name_state: '',
});

const mappedColumns = [
  { field: 'name_state', header: 'Nombre' },
];

// Validaciones
const nameError = computed(() => {
  const name = formState.value.name_state || '';
  if (!name.trim()) return 'El nombre es requerido';
  if (name.length < 3) return 'Mínimo 3 caracteres';
  if (name.length > 50) return 'Máximo 50 caracteres';
  const validPattern = /^[a-zA-Z\s]+$/;
  if (!validPattern.test(name)) return 'Solo se permiten letras y espacios';
  return null;
});

const isFormValid = computed(() => !nameError.value && formState.value.name_state.trim().length > 0);

const preventInvalidChars = (e: KeyboardEvent) => {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];
  if (allowedKeys.includes(e.key)) return;
  const validChar = /^[a-zA-Z]$/;
  if (!validChar.test(e.key)) e.preventDefault();
};

// Datos filtrados
const filteredStates = computed(() =>
  stateStore.states.filter(state =>
    showActive.value ? !state.delete_log_state : state.delete_log_state
  )
);

// Métodos
const showActiveStates = () => showActive.value = true;
const showDeletedStates = () => showActive.value = false;

const handleSee = (id: number) => {
  currentState.value = stateStore.states.find(s => s.id_state === id);
  visibleDetails.value = true;
};

const handleCreate = () => {
  isEdit.value = false;
  formState.value = { name_state: '' };
  visibleForm.value = true;
};

const handleUpdate = (id: number) => {
  const state = stateStore.states.find(s => s.id_state === id);
  if (state) {
    isEdit.value = true;
    editingId.value = id;
    formState.value = { name_state: state.name_state };
    visibleForm.value = true;
  }
};

const closeForm = () => {
  visibleForm.value = false;
  formState.value = { name_state: '' };
};

const submitForm = async () => {
  if (!isFormValid.value) return;
  loadingSubmit.value = true;
  try {
    if (isEdit.value && editingId.value) {
      await stateStore.editState(editingId.value, formState.value.name_state);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Estado actualizado', life: 3000 });
    } else {
      await stateStore.addState(formState.value.name_state);
      toast.add({ severity: 'success', summary: 'Éxito', detail: 'Estado creado', life: 3000 });
    }
    await stateStore.fetchStates();
    visibleForm.value = false;
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el estado', life: 3000 });
  } finally {
    loadingSubmit.value = false;
  }
};

const handleRemove = (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar este estado?',
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
        await stateStore.removeState(id);
        await stateStore.fetchStates();
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Estado eliminado', life: 3000 });
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar', life: 3000 });
      }
    }
  });
};

const restoreDeletedState = async (id: number) => {
  try {
    await stateStore.restoreDeletedState(id);
    await stateStore.fetchStates();
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Estado restaurado', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Error al restaurar el estado', life: 3000 });
  }
};

onMounted(() => {
  stateStore.fetchStates();
});
</script>


<style scoped>
/* Estilos adicionales si son necesarios */
</style>