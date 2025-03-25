<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Registros de Errores</h1>

    <!-- Tabla de errores con buscador -->
    <DataTable 
      :value="filteredErrorLogs" 
      stripedRows 
      paginator 
      :rows="10" 
      :rowsPerPageOptions="[10, 20, 50]"
      :scrollable="true" 
      :scrollHeight="'280px'" 
      :loading="loading"
      tableStyle="min-width: 100%"
      :globalFilterFields="['message_error', 'source_error', 'timestamp']"
    >
      <template #header>
        <div class="flex justify-between items-center mb-4">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText 
              v-model="searchTerm" 
              placeholder="Buscar en registros..." 
              class="p-inputtext-sm"
            />
          </span>
        </div>
      </template>

      <template #empty>
        <div class="text-center py-4 text-gray-500">
          {{ loading ? 'Cargando registros...' : 'No se encontraron registros de errores' }}
        </div>
      </template>

      <Column field="message_error" header="Mensaje" :sortable="true">
        <template #body="{ data }">
          <div class="truncate max-w-xs">
            {{ data.message_error }}
          </div>
        </template>
      </Column>
      
      <Column field="source_error" header="Fuente" :sortable="true"></Column>
      
      <Column field="timestamp" header="Fecha y Hora" :sortable="true">
        <template #body="{ data }">
          {{ formatDateTime(data.timestamp) || 'N/A' }}
        </template>
      </Column>
      
      <Column header="Acciones">
        <template #body="{ data }">
          <Button 
            label="Ver Detalles" 
            icon="pi pi-code" 
            class="p-button-info p-button-sm"
            @click="showErrorDetails(data)"
          />
        </template>
      </Column>
    </DataTable>

    <!-- Modal para mostrar detalles del error -->
    <Dialog 
      v-model:visible="isModalOpen" 
      header="Detalles del Error" 
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <div class="space-y-4">
        <div>
          <h3 class="font-semibold">Mensaje:</h3>
          <p class="mt-1">{{ currentError.message_error }}</p>
        </div>
        
        <div>
          <h3 class="font-semibold">Fuente:</h3>
          <p class="mt-1">{{ currentError.source_error }}</p>
        </div>
        
        <div>
          <h3 class="font-semibold">Fecha y Hora:</h3>
          <p class="mt-1">{{ formatDateTime(currentError.timestamp) }}</p>
        </div>
        
        <div>
          <h3 class="font-semibold">Stacktrace:</h3>
          <pre class="bg-gray-700 p-4 rounded mt-1 overflow-auto max-h-64">{{ currentError.stacktrace_error }}</pre>
        </div>
      </div>
      
      <template #footer>
        <Button 
          label="Cerrar" 
          icon="pi pi-times" 
          class="p-button-danger"
          @click="closeModal"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useErrorLogStore } from '@/stores/errorLogStore';
import { useRoute } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const errorLogStore = useErrorLogStore();
const route = useRoute();
const searchTerm = ref('');

// Estado del modal
const isModalOpen = ref(false);
const currentError = ref({
  message_error: '',
  source_error: '',
  timestamp: '',
  stacktrace_error: ''
});

// Cargar datos al montar el componente y cuando cambia la ruta
onMounted(async () => {
  await loadErrorLogs();
});

watch(() => route.path, async () => {
  await loadErrorLogs();
}, { immediate: true });

// Función para cargar los registros
const loadErrorLogs = async () => {
  try {
    await errorLogStore.fetchErrorLogs();
  } catch (error) {
    console.error('Error al cargar registros:', error);
  }
};

// Formatear fecha y hora
const formatDateTime = (dateString: string) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return null;
  }
};

// Filtrar registros
const filteredErrorLogs = computed(() => {
  if (!searchTerm.value) return errorLogStore.errorLogs;
  
  const term = searchTerm.value.toLowerCase();
  return errorLogStore.errorLogs.filter(log => 
    Object.entries(log).some(([key, value]) => {
      if (key === 'stacktrace_error') return false;
      return String(value).toLowerCase().includes(term);
    })
  );
});

// Mostrar detalles del error
const showErrorDetails = (error: any) => {
  currentError.value = { ...error };
  isModalOpen.value = true;
};

// Cerrar modal
const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped>
.container {
  max-width: 100%;
  overflow-x: auto;
}

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

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>