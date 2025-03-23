<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { computed } from 'vue';

import { ref } from "vue";

const props = defineProps<{
  isSidebarActive: boolean;
}>();

const sidebarClass = computed(() => {
  return props.isSidebarActive ? 'sidebar-true' : 'sidebar-false';
});

const items = [
  {
    key: 'Compañías',
    label: 'Compañías',
    icon: 'house',
    items: [
      {
        label: 'Compañías',
        icon: '',
        to: '/compañias'
      },
    ]
  },
  {
    key: 'Tipos de Movimiento',
    label: 'Tipos de Movimiento',
    icon: 'house',
    to: '/tipos-movimientos',
  },
  {
    key: 'CA - Órdenes de Compra',
    label: 'CA - Órdenes de Compra',
    icon: 'boxes-stacked',
    to: '/ca-purchase-orders',
  },
  {
    key: 'CA - Proveedores',
    label: 'CA - Proveedores',
    icon: 'file-csv',
    to: '/ca-suppliers',
  },
  {
    key: 'Departamentos',
    label: 'Departamentos',
    icon: 'user',
    to: '/departments',
  },
  {
    key: 'Posiciones',
    label: 'Posiciones',
    icon: 'dolly',
    to: '/positions',
  },
  {
    key: 'CA - Productos',
    label: 'CA - Productos',
    icon: 'dolly',
    to: '/ca-products',
  },
  {
    key: 'Estados',
    label: 'Estados',
    icon: 'dolly',
    to: '/states',
  }
];

const expandedKeys = ref({});

</script>

<template>
  <!-- component -->
  <aside class="flex my-2 mx-2 min-h-[95vh]">
    <div class="flex flex-col py-8 px-5 bg-white dark:bg-gray-900 dark:border-gray-700 rounded-lg gap-4">

      <RouterLink to="/">
        <button style="cursor: pointer;"
          class="flex items-center transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none p-4 sidebar"
          :class="sidebarClass">
          <img class="w-auto h-6" src="@/assets/logo.svg" alt="">
          <p class="text-sm font-medium text-gray-700 capitalize dark:text-white sidebar">
            FLUX-SYS
          </p>
        </button>
      </RouterLink>

      <div v-if="props.isSidebarActive">
        <PanelMenu :model="items">
          <template #item="{ item }">
            <template v-if="item.to">
              <RouterLink :to="item.to">
                <button style="cursor: pointer;"
                  class="flex items-center transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none p-4 sidebar"
                  :class="sidebarClass">
                  <font-awesome-icon :icon="['fas', item.icon]" />
                  <p class="text-sm font-medium text-gray-700 capitalize dark:text-white sidebar">
                    {{ item.label }}
                  </p>
                </button>
              </RouterLink>
            </template>
            <template v-else>
              <button style="cursor: pointer;"
                class="flex items-center transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none p-4 sidebar"
                :class="sidebarClass">
                <font-awesome-icon :icon="['fas', item.icon]" />
                <p class="text-sm font-medium text-gray-700 capitalize dark:text-white sidebar">
                  {{ item.label }}
                </p>
              </button>
            </template>
          </template>
        </PanelMenu>
      </div>
      <div v-else>
        <PanelMenu :model="items" :expandedKeys="expandedKeys">
          <template #item="{ item }">
            <template v-if="item.to">
              <RouterLink :to="item.to">
                <button style="cursor: pointer;"
                  class="flex items-center transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none p-4 sidebar"
                  :class="sidebarClass">
                  <font-awesome-icon :icon="['fas', item.icon]" />
                  <p class="text-sm font-medium text-gray-700 capitalize dark:text-white sidebar">
                    {{ item.label }}
                  </p>
                </button>
              </RouterLink>
            </template>
            <template v-else>
              <button style="cursor: pointer;"
                class="flex items-center transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none p-4 sidebar"
                :class="sidebarClass">
                <font-awesome-icon :icon="['fas', item.icon]" />
                <p class="text-sm font-medium text-gray-700 capitalize dark:text-white sidebar">
                  {{ item.label }}
                </p>
              </button>
            </template>
          </template>
        </PanelMenu>
      </div>


    </div>
  </aside>
</template>

<style lang="scss" scoped></style>
