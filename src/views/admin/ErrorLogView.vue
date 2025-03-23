<!-- src/views/ErrorLogView.vue -->
<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Registros de Errores</h1>
  
      <!-- Tabla de errores -->
      <table class="min-w-full bg-black">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Mensaje</th>
            <th class="py-2 px-4 border-b">Fuente</th>
            <th class="py-2 px-4 border-b">Fecha y Hora</th>
            <th class="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="errorLog in errorLogs" :key="errorLog.id_error_log" class="hover:bg-gray-50">
            <td class="py-2 px-4 border-b">{{ errorLog.id_error_log }}</td>
            <td class="py-2 px-4 border-b">{{ errorLog.message_error }}</td>
            <td class="py-2 px-4 border-b">{{ errorLog.source_error }}</td>
            <td class="py-2 px-4 border-b">{{ errorLog.timestamp }}</td>
            <td class="py-2 px-4 border-b">
              <button
                @click="showStacktrace(errorLog.stacktrace_error)"
                class="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Ver Stacktrace
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Cargando -->
      <div v-if="loading" class="mt-4">
        Cargando...
      </div>
  
      <!-- Modal para mostrar el stacktrace -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg max-w-2xl w-full">
          <h2 class="text-xl font-bold mb-4">Stacktrace</h2>
          <pre class="bg-gray-100 p-4 rounded overflow-auto">{{ currentStacktrace }}</pre>
          <button
            @click="closeModal"
            class="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useErrorLogStore } from '@/stores/errorLogStore';
  
  const errorLogStore = useErrorLogStore();
  const { errorLogs, loading, fetchErrorLogs } = errorLogStore;
  
  // Estado para el modal
  const isModalOpen = ref(false);
  const currentStacktrace = ref('');
  
  // Mostrar el stacktrace en un modal
  const showStacktrace = (stacktrace: string) => {
    currentStacktrace.value = stacktrace;
    isModalOpen.value = true;
  };
  
  // Cerrar el modal
  const closeModal = () => {
    isModalOpen.value = false;
    currentStacktrace.value = '';
  };
  
  onMounted(() => {
    fetchErrorLogs();
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales si son necesarios */
  </style>