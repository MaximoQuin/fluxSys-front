<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Movimientos de Inventario</h1>

    <!-- Tabla de movimientos con ancho optimizado -->
    <div class="card overflow-hidden">
      <DataTable :value="filteredMovements" stripedRows paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]"
        :scrollable="true" :scrollHeight="'350px'" :loading="loading" :globalFilterFields="[
          'amount_modify', 'name_product',
          'name_department', 'name_supplier', 'name_user'
        ]">
        <template #header>
          <div class="flex justify-end mb-4">
            <!-- <span class="p-input-icon-left"> -->
            <!-- <i class="pi pi-search" /> -->
            <InputText v-model="searchTerm" placeholder="Buscar movimientos..." />
            <!-- </span> -->
          </div>
        </template>

        <template #empty>
          <div class="text-center py-4 text-gray-500">
            {{ loading ? 'Cargando movimientos...' : 'No se encontraron movimientos' }}
          </div>
        </template>

        <!-- Columnas con anchos optimizados -->
        <Column field="amount_modify" header="Cantidad" :sortable="true" headerStyle="width: 90px"
          bodyStyle="width: 90px">
          <template #body="{ data }">
            {{ formatNumber(data.amount_modify) }}
          </template>
        </Column>

        <Column field="name_product" header="Producto" :sortable="true" headerStyle="width: 120px"
          bodyStyle="width: 120px">
        </Column>

        <Column field="name_department" header="Depto" :sortable="true" headerStyle="width: 100px"
          bodyStyle="width: 100px">
        </Column>

        <Column field="name_supplier" header="Proveedor" :sortable="true" headerStyle="width: 100px"
          bodyStyle="width: 100px">
        </Column>

        <Column field="name_user" header="Usuario" :sortable="true" headerStyle="width: 100px" bodyStyle="width: 100px">
        </Column>

        <Column field="date_insert" header="F. Inserción" :sortable="true" headerStyle="width: 120px"
          bodyStyle="width: 120px">
          <template #body="{ data }">
            <div class="whitespace-nowrap text-sm">
              {{ formatDateTime(data.date_insert) || 'N/A' }}
            </div>
          </template>
        </Column>

        <Column field="date_update" header="F. Actualización" :sortable="true" headerStyle="width: 120px"
          bodyStyle="width: 120px">
          <template #body="{ data }">
            <div class="whitespace-nowrap text-sm">
              {{ formatDateTime(data.date_update) || 'N/A' }}
            </div>
          </template>
        </Column>

        <Column field="date_delete" header="F. Eliminación" :sortable="true" headerStyle="width: 120px"
          bodyStyle="width: 120px">
          <template #body="{ data }">
            <div class="whitespace-nowrap text-sm">
              {{ formatDateTime(data.date_delete) || 'N/A' }}
            </div>
          </template>
        </Column>

        <Column field="date_restore" header="F. Restauración" :sortable="true" headerStyle="width: 120px"
          bodyStyle="width: 120px">
          <template #body="{ data }">
            <div class="whitespace-nowrap text-sm">
              {{ formatDateTime(data.date_restore) || 'N/A' }}
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useInventoryMovementStore } from '@/stores/inventoryMovementStore';
import { useRoute } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';

const inventoryMovementStore = useInventoryMovementStore();
const route = useRoute();
const searchTerm = ref('');

// Cargar datos al montar el componente y cuando cambia la ruta
onMounted(async () => {
  await loadMovements();
});

watch(() => route.path, async () => {
  await loadMovements();
}, { immediate: true });

// Función para cargar los movimientos
const loadMovements = async () => {
  try {
    await inventoryMovementStore.fetchInventoryMovements();
  } catch (error) {
    console.error('Error al cargar movimientos:', error);
  }
};

// Formatear números
const formatNumber = (value: number) => {
  return value?.toLocaleString('es-ES') || '0';
};

// Formatear fecha y hora
const formatDateTime = (dateString: string) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return null;
  }
};

// Filtrar movimientos
const filteredMovements = computed(() => {
  if (!searchTerm.value) return inventoryMovementStore.inventoryMovements;

  const term = searchTerm.value.toLowerCase();
  return inventoryMovementStore.inventoryMovements.filter(movement =>
    Object.entries(movement).some(([key, value]) => {
      if (key.includes('date')) return false; // Excluir fechas de la búsqueda
      return String(value).toLowerCase().includes(term);
    })
  );
});
</script>

<style scoped>
.container {
  max-width: 100%;
}

.card {
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  overflow-x: auto;
  width: 100%;
}

.p-input-icon-left {
  position: relative;
  margin-bottom: 1rem;
}

.p-input-icon-left i {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 0.875rem;
}

/* Scroll horizontal personalizado */
:deep(.p-datatable-wrapper) {
  overflow-x: auto;
  scrollbar-width: thin;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar) {
  height: 8px;
}

:deep(.p-datatable-wrapper::-webkit-scrollbar-thumb) {
  background-color: #c1c1c1;
  border-radius: 4px;
}

/* Estilos compactos para celdas */
:deep(.p-datatable .p-datatable-thead > tr > th),
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.5rem 0.75rem;
}
</style>
