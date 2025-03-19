<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="text-center p-6 bg-white rounded-lg shadow-md max-w-lg w-full">
      <h1 class="text-3xl font-semibold text-gray-800 mb-4">Bienvenido: {{ authStore.user?.name_user }}</h1>
      <h2 class="text-xl text-gray-600 mb-2">Rol: {{ authStore.user?.role?.name_role }}</h2>
      <h2 class="text-xl text-gray-600 mb-2">Posicion: {{ authStore.user?.position?.name_position }}</h2>
      <h2 class="text-xl text-gray-600 mb-2">Departamento: {{ authStore.user?.department?.name_department }}</h2>
      <h2 class="text-xl text-gray-600 mb-2">Compañia: {{ authStore.user?.company?.name_company }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
</script>
