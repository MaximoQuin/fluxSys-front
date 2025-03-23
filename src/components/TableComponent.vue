<template>
  <DataTable :value="filteredData" stripedRows paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]" tableStyle=""
    :globalFilterFields="globalFilterFields" :scrollable="true" :scrollHeight="'300px'">
    <template #header>
      <div class="flex justify-end">
        <InputText v-model="filters['global'].value" placeholder="Buscar" />
      </div>
    </template>
    <Column v-for="(column, index) in columns" :key="index" :field="column.field" :header="column.header" />

    <Column header="Acciones">
      <template #body="props">
        <div v-if="flagRestore" class="flex gap-3">
          <Button label="Editar" icon="pi pi-pencil" class="p-button-info" @click="handleUpdate(id, props.data)" />
          <Button label="Eliminar" icon="pi pi-times" class="p-button-danger" @click="handleDanger(id, props.data)" />
        </div>
        <div v-else>
          <Button label="Recuperar" icon="pi pi-refresh" class="p-button-success"
            @click="handleRestore(id, props.data)" />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

const props = defineProps<{
  data: any[];
  columns: { field: string; header: string }[];
  id: string;
  flagRestore: boolean;
}>();

const emit = defineEmits<{
  (event: 'actionUpdate', id: number): void;
  (event: 'actionDanger', id: number): void;
  (event: 'actionRestore', id: number): void;
}>();

const dataTable = ref(props.data);

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

const handleUpdate = (fieldName: string, rowData: any) => {
  const id = rowData[fieldName];
  emit('actionUpdate', id);
};

const handleDanger = (fieldName: string, rowData: any) => {
  const id = rowData[fieldName];
  emit('actionDanger', id);
};

const handleRestore = (fieldName: string, rowData: any) => {
  const id = rowData[fieldName];
  emit('actionRestore', id);
};

</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
