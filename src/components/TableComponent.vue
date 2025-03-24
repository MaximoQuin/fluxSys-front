<template>
  <div>
    <!-- DataTable -->
    <DataTable :value="filteredData" stripedRows paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]" tableStyle=""
      :globalFilterFields="globalFilterFields" :scrollable="true" :scrollHeight="'300px'" :loading="loader">
      <template #header>
        <div class="flex gap-3 justify-end">
          <InputText v-model="filters['global'].value" placeholder="Buscar" />
          <Button label="Crear" icon="pi pi-plus" class="p-button-success" @click="handleCreate()" />
        </div>
      </template>
      <Column v-for="(column, index) in columns" :key="index" :field="column.field" :header="column.header">
        <!-- <template #body="props">
          <div v-if="isEditing(props.data[id])">
            <InputText v-model="editingValues[props.data[id]]" />
            <Button label="Guardar" icon="pi pi-check" class="p-button-success ml-2"
              @click="saveEdit(props.data[id])" />
            <Button label="Cancelar" icon="pi pi-times" class="p-button-secondary ml-2"
              @click="cancelEdit(props.data[id])" />
          </div>
          <div v-else>
            {{ props.data[column.field] }}
          </div>
        </template> -->
      </Column>

      <Column header="Acciones">
        <template #body="props">
          <div v-if="flagRestore" class="flex gap-3">
            <Button v-if="hasPermission('Ver')" label="Ver" icon="pi pi-eye" class="p-button-success"
              @click="handleSee(id, props.data)" />

            <!-- Botón Editar -->
            <!-- <Button v-if="hasPermission('Editar')" label="Editar" icon="pi pi-pencil" class="p-button-info"
              @click="startEdit(props.data[id])" /> -->

            <Button v-if="hasPermission('Editar')" label="Editar" icon="pi pi-pencil" class="p-button-info"
              @click="handleUpdate(id, props.data)" />

            <!-- Botón Eliminar -->
            <Button v-if="hasPermission('Borrar') && props.data.name_company !== currentUserCompany" label="Eliminar"
              icon="pi pi-times" class="p-button-danger" @click="handleDanger(id, props.data)" />
          </div>
          <div v-else>
            <!-- Botón Recuperar -->
            <Button v-if="hasPermission('Restaurar')" label="Recuperar" icon="pi pi-refresh" class="p-button-success"
              @click="handleRestore(id, props.data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useAuth } from '@/composables/useAuth'; // Importar useAuth

import { useToast } from "primevue/usetoast";

const toast = useToast();

const { hasPermission } = useAuth(); // Obtener la función hasPermission

const props = defineProps<{
  loader: boolean;
  data: any[];
  columns: { field: string; header: string }[];
  id: string;
  flagRestore: boolean;
  currentUserCompany: string; // Recibir el nombre de la compañía del usuario actual
}>();

const emit = defineEmits<{
  (event: 'actionSee', id: number): void;
  (event: 'actionCreate'): void;
  // (event: 'actionUpdate', id: number, newValue: string): void;
  (event: 'actionUpdate', id: number): void;
  (event: 'actionDanger', id: number): void;
  (event: 'actionRestore', id: number): void;
}>();

const dataTable = ref(props.data);
// const editingValues = ref<Record<string, string>>({});
// const editingId = ref<string | null>(null);

const filters = ref<Record<string, { value: any; matchMode: string }>>({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = computed(() => {
  if (props.columns && props.columns.length > 0) {
    return props.columns;
  }
  if (props.data && props.data.length > 0) {
    const firstItem = props.data[0];
    const dynamicColumns = Object.keys(firstItem).map(key => ({
      field: key,
      header: capitalize(key),
    }));

    Object.keys(firstItem).forEach(key => {
      if (!filters.value[key]) {
        filters.value[key] = { value: null, matchMode: FilterMatchMode.CONTAINS };
      }
    });

    return dynamicColumns;
  }
  return [];
});

const globalFilterFields = computed(() => {
  if (props.data && props.data.length > 0) {
    const firstItem = props.data[0];
    return Object.keys(firstItem);
  }
  return [];
});

const filteredData = computed(() => {
  let filtered = [...dataTable.value];

  if (filters.value.global.value) {
    filtered = filtered.filter(item =>
      Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(String(filters.value.global.value).toLowerCase())
      )
    );
  }

  Object.keys(filters.value).forEach(key => {
    if (key !== 'global' && filters.value[key].value) {
      filtered = filtered.filter(item =>
        String(item[key]).toLowerCase().includes(String(filters.value[key].value).toLowerCase())
      );
    }
  });

  return filtered;
});

watch(() => props.data, (newData) => {
  dataTable.value = newData;
}, { immediate: true });

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Acción de Editar
// const startEdit = (rowId: string) => {
//   editingId.value = rowId;
//   editingValues.value[rowId] = dataTable.value.find(item => item[props.id] === rowId)?.name_company || '';
// };

// const saveEdit = (rowId: string) => {
//   if (editingValues.value[rowId]) {
//     emit('actionUpdate', Number(rowId), editingValues.value[rowId]);
//     editingId.value = null;
//     editingValues.value[rowId] = '';
//   }
// };

// const cancelEdit = (rowId: string) => {
//   editingId.value = null;
//   editingValues.value[rowId] = '';
// };

// const isEditing = (rowId: string) => {
//   return editingId.value === rowId;
// };

const handleCreate = () => {
  if (!hasPermission('Crear')) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No tienes permiso para crear.', life: 3000 });
    // alert('No tienes permiso para crear.');
    return;
  }
  emit('actionCreate');
};

// Acción de Ver
const handleSee = (fieldName: string, rowData: any) => {
  if (!hasPermission('Ver')) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No tienes permiso para ver.', life: 3000 });
    // alert('No tienes permiso para restaurar.');
    return;
  }
  const id = rowData[fieldName];
  emit('actionSee', id);
};

// Acción de Editar
const handleUpdate = (fieldName: string, rowData: any) => {
  if (!hasPermission('Editar')) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No tienes permiso para ediatr.', life: 3000 });
    // alert('No tienes permiso para restaurar.');
    return;
  }
  const id = rowData[fieldName];
  emit('actionUpdate', id);
};

// Acción de Eliminar
const handleDanger = (fieldName: string, rowData: any) => {
  if (!hasPermission('Borrar')) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No tienes permiso para eliminar.', life: 3000 });
    // alert('No tienes permiso para eliminar.');
    return;
  }
  const id = rowData[fieldName];
  emit('actionDanger', id);
};

// Acción de Restaurar
const handleRestore = (fieldName: string, rowData: any) => {
  if (!hasPermission('Restaurar')) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No tienes permiso para restaurar.', life: 3000 });
    // alert('No tienes permiso para restaurar.');
    return;
  }
  const id = rowData[fieldName];
  emit('actionRestore', id);
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
