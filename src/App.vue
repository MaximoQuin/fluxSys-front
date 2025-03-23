<script setup lang="ts">
import AppTopbar from './layout/AppTopbar.vue';
import AppSidebar from './layout/AppSidebar.vue';
import { RouterView } from 'vue-router';
import AppFooter from './layout/AppFooter.vue';
import { ref, onMounted } from 'vue';
import { useAuthStore } from './stores/authStore'; // Importa el store de autenticación

// Estado para controlar la visibilidad del sidebar
const isSidebarActive = ref(true);

// Función para alternar la visibilidad del sidebar
const toggleSidebar = () => {
  isSidebarActive.value = !isSidebarActive.value;
};

// Verifica el token al cargar la aplicación
const authStore = useAuthStore();
onMounted(async () => {
  try {
    await authStore.validateToken(); // Valida el token almacenado
  } catch (error) {
    console.error('Error validating token:', error);
    authStore.logout(); // Cierra la sesión si el token no es válido
  }
});
</script>

<template>
  <Toast />
  <div>
    <!-- Renderiza el layout solo si el usuario está autenticado -->
    <template v-if="authStore.token">
      <div class="flex w-full">
        <div class="w-fit">
          <AppSidebar :isSidebarActive="isSidebarActive"></AppSidebar>
        </div>
        <div class="w-full">
          <AppTopbar @toggle-sidebar="toggleSidebar"></AppTopbar>
          <RouterView />
          <!-- <AppFooter></AppFooter> -->
        </div>
      </div>
    </template>

    <!-- Renderiza solo el RouterView si el usuario no está autenticado -->
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<style scoped></style>
