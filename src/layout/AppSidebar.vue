<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { computed } from 'vue';

const props = defineProps<{
  isSidebarActive: boolean;
}>();

const sidebarClass = computed(() => {
  return props.isSidebarActive ? 'sidebar-true' : 'sidebar-false';
});

</script>

<template>
  <!-- component -->
  <aside class="flex my-2 ml-2 min-h-[95vh] h-full">
    <div class="flex flex-col items-center w-16  py-8 bg-white dark:bg-gray-900 dark:border-gray-700 rounded-lg gap-4">
      <RouterLink to="/" style="cursor: pointer;">
        <img class="w-auto h-6" src="@/assets/logo.svg" alt="">
      </RouterLink>

      <RouterLink to="/"
        class="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
        <font-awesome-icon :icon="['fas', 'house']" />
      </RouterLink>

      <RouterLink to="/"
        class="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
        <font-awesome-icon :icon="['fas', 'boxes-stacked']" />
      </RouterLink>

      <RouterLink to="/"
        class="p-1.5 text-blue-500 transition-colors duration-200 bg-blue-100 rounded-lg dark:text-blue-400 dark:bg-gray-800">
        <font-awesome-icon :icon="['fas', 'file-csv']" />
      </RouterLink>

      <RouterLink to="/"
        class="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
        <font-awesome-icon :icon="['fas', 'user']" />
      </RouterLink>

      <RouterLink to="/"
        class="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
        <font-awesome-icon :icon="['fas', 'dolly']" />
      </RouterLink>

      <RouterLink to="/"
        class="p-1.5 text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
        <font-awesome-icon :icon="['far', 'rectangle-list']" />
      </RouterLink>
    </div>

    <div :class="sidebarClass"
      class="flex flex-col py-8 overflow-y-auto bg-white dark:bg-gray-900 rounded-lg gap-5 sidebar">
      <RouterLink to="/">
        <h2 class="px-5 text-lg font-medium text-gray-800 dark:text-white">FLUXSYS</h2>
      </RouterLink>

      <div class="flex flex-col gap-8">
        <RouterLink to="/dashboard">
          <button style="cursor: pointer;"
            class="flex items-center w-full px-5 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
            <div class="text-left rtl:text-right">
              <h1 class="text-sm font-medium text-gray-700 capitalize dark:text-white">Dashboard</h1>
            </div>
          </button>
        </RouterLink>

        <RouterLink to="/">
          <button style="cursor: pointer;"
            class="flex items-center w-full px-5 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
            <div class="text-left rtl:text-right">
              <h1 class="text-sm font-medium text-gray-700 capitalize dark:text-white">Inventario</h1>
            </div>
          </button>
        </RouterLink>

        <RouterLink to="/">
          <button style="cursor: pointer;"
            class="flex items-center w-full px-5 transition-colors duration-200 bg-gray-100 dark:bg-gray-800 gap-x-2 focus:outline-none">
            <div class="text-left rtl:text-right">
              <h1 class="text-sm font-medium text-gray-700 capitalize dark:text-white">Reportes</h1>
            </div>
          </button>
        </RouterLink>

        <RouterLink to="/">
          <button style="cursor: pointer;"
            class="flex items-center w-full px-5 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
            <div class="text-left rtl:text-right">
              <h1 class="text-sm font-medium text-gray-700 capitalize dark:text-white">Proveedores</h1>
            </div>
          </button>
        </RouterLink>

        <RouterLink to="/">
          <button style="cursor: pointer;"
            class="flex items-center w-full px-5 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
            <div class="text-left rtl:text-right">
              <h1 class="text-sm font-medium text-gray-700 capitalize dark:text-white">Ordenes</h1>
            </div>
          </button>
        </RouterLink>

        <RouterLink to="/">
          <button style="cursor: pointer;"
            class="flex items-center w-full px-5 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none">
            <div class="text-left rtl:text-right">
              <h1 class="text-sm font-medium text-gray-700 capitalize dark:text-white">Gestion</h1>
            </div>
          </button>
        </RouterLink>
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped></style>
