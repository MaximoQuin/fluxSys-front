<!-- src/views/AuditView.vue -->
<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Auditorías</h1>
  
      <!-- Tabla de auditorías -->
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Fecha de Inserción</th>
            <th class="py-2 px-4 border-b">Fecha de Actualización</th>
            <th class="py-2 px-4 border-b">Fecha de Eliminación</th>
            <th class="py-2 px-4 border-b">Fecha de Restauración</th>
            <th class="py-2 px-4 border-b">Monto Modificado</th>
            <th class="py-2 px-4 border-b">Usuario</th>
            <th class="py-2 px-4 border-b">Departamento</th>
            <th class="py-2 px-4 border-b">Módulo</th>
            <th class="py-2 px-4 border-b">Empresa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="audit in audits" :key="audit.id_audit" class="hover:bg-gray-50">
            <td class="py-2 px-4 border-b">{{ audit.id_audit }}</td>
            <td class="py-2 px-4 border-b">{{ audit.date_insert }}</td>
            <td class="py-2 px-4 border-b">{{ audit.date_update }}</td>
            <td class="py-2 px-4 border-b">{{ audit.date_delete }}</td>
            <td class="py-2 px-4 border-b">{{ audit.date_restore }}</td>
            <td class="py-2 px-4 border-b">{{ audit.amount_modify }}</td>
            <td class="py-2 px-4 border-b">{{ audit.name_user }}</td>
            <td class="py-2 px-4 border-b">{{ audit.name_department }}</td>
            <td class="py-2 px-4 border-b">{{ audit.name_module }}</td>
            <td class="py-2 px-4 border-b">{{ audit.name_company }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Cargando -->
      <div v-if="loading" class="mt-4">
        Cargando...
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue';
  import { useAuditStore } from '@/stores/auditStore';
  
  const auditStore = useAuditStore();
  const { audits, loading, fetchAudits } = auditStore;
  
  onMounted(() => {
    fetchAudits();
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales si son necesarios */
  </style>