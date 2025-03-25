<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Auditorías</h1>

    <!-- Tabla de auditorías con buscador -->
    <DataTable :value="filteredAudits" stripedRows paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]"
      :scrollable="true" :scrollHeight="'280px'" :loading="auditStore.loading" tableStyle="min-width: 100px"
      :globalFilterFields="['date_insert', 'date_update', 'date_delete', 'date_restore', 'amount_modify', 'name_user', 'name_department', 'name_module', 'name_company']">
      <template #header>
        <div class="flex justify-between items-center mb-4">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="searchTerm" placeholder="Buscar en auditorías..." class="p-inputtext-sm" />
          </span>
        </div>
      </template>

      <Column field="date_insert" header="Fecha Inserción" :sortable="true">
        <template #body="{ data }">
          {{ safeFormatDate(data.date_insert) || 'N/A' }}
        </template>
      </Column>
      <Column field="date_update" header="Fecha Actualización" :sortable="true">
        <template #body="{ data }">
          {{ safeFormatDate(data.date_update) || 'N/A' }}
        </template>
      </Column>
      <Column field="date_delete" header="Fecha Eliminación" :sortable="true">
        <template #body="{ data }">
          {{ safeFormatDate(data.date_delete) || 'N/A' }}
        </template>
      </Column>
      <Column field="date_restore" header="Fecha Restauración" :sortable="true">
        <template #body="{ data }">
          {{ safeFormatDate(data.date_restore) || 'N/A' }}
        </template>
      </Column>
      <Column field="amount_modify" header="Cantidad Modificado" :sortable="true">
        <template #body="{ data }">
          {{ formatNumber(data.amount_modify) }}
        </template>
      </Column>
      <Column field="name_user" header="Usuario" :sortable="true"></Column>
      <Column field="name_department" header="Departamento" :sortable="true"></Column>
      <Column field="name_module" header="Módulo" :sortable="true"></Column>
      <Column field="name_company" header="Empresa" :sortable="true"></Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuditStore } from '@/stores/auditStore';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';

const auditStore = useAuditStore();
const searchTerm = ref('');

// Función segura para formatear fechas
const safeFormatDate = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null;
  
  try {
    // Asegurarnos que la fecha es válida antes de formatear
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // Asegurar consistencia en la zona horaria
    };
    
    return date.toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return null;
  }
};

// Función para formatear números
const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  return value.toLocaleString('es-ES');
};

// Filtrado de auditorías
const filteredAudits = computed(() => {
  if (!searchTerm.value) return auditStore.audits;
  
  const term = searchTerm.value.toLowerCase();
  return auditStore.audits.filter(audit => 
    Object.entries(audit).some(([key, value]) => {
      // Excluir campos de fecha de la búsqueda si no son strings
      if (key.includes('date') && typeof value !== 'string') return false;
      return String(value).toLowerCase().includes(term);
    })
  );
});

// Cargar datos iniciales
onMounted(() => {
  auditStore.fetchAudits();
});
</script>

<style scoped>
.container {
  max-width: 100%;
  overflow-x: auto;
}

/* Estilo para el buscador */
.p-input-icon-left {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.p-input-icon-left i {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #6b7280;
}
</style>