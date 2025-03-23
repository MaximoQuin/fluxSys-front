<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { computed, ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

const props = defineProps<{
  isSidebarActive: boolean;
}>();

const { userRole } = useAuth();

const sidebarClass = computed(() => {
  return props.isSidebarActive ? 'sidebar-true' : 'sidebar-false';
});

const items = [
  {
    key: 'Compañías',
    label: 'Administracion General',
    icon: 'dolly',
    visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento'],
    items: [
      {
        label: 'Compañías',
        icon: 'table-list',
        to: '/companies-a',
        visibleForRoles: ['Administrador'],
      },
      {
        label: 'Usuarios',
        icon: 'table-list',
        to: '/users-ua',
        visibleForRoles: ['Administrador Empresarial', 'Jefe de Departamento'],
      },
      {
        label: 'Departamentos',
        icon: 'table-list',
        to: '/departments-u',
        visibleForRoles: ['Administrador', 'Administrador Empresarial'],
      },
      {
        label: 'Posiciones',
        icon: 'table-list',
        to: '/positions-u',
      },
    ],
  },
  {
    key: 'Inventario',
    label: 'Gestión de Inventario',
    icon: 'boxes-stacked',
    visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento', 'Subjefe de Departamento', 'Colaborador'],
    items: [
      {
        label: 'Inventario',
        icon: 'table-list',
        to: '/inventories-u',
      },
      {
        label: 'Categorias',
        icon: 'table-list',
        to: '/ca-products-u',
      },
      {
        label: 'Tipos de Movimientos',
        icon: 'table-list',
        to: '/movements-types-u',
      },
      {
        label: 'Estados de Productos',
        icon: 'table-list',
        to: '/states-u',
      },
      {
        label: 'Movimientos de Inventario',
        icon: 'table-list',
        to: '/inv-movements-ua',
        visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento', 'Subjefe de Departamento'],
      },
    ],
  },
  {
    key: 'Proveedores',
    label: 'Proveedores',
    icon: 'user',
    visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento', 'Subjefe de Departamento', 'Colaborador'],
    items: [
      {
        label: 'Proveedores',
        icon: 'table-list',
        to: '/suppliers-u',
      },
      {
        label: 'Categorias',
        icon: 'table-list',
        to: '/ca-suppliers-u',
      },
    ],
  },
  {
    key: 'Ordenes de Compra',
    label: 'Ordenes de Compra',
    icon: 'dolly',
    visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento', 'Subjefe de Departamento', 'Colaborador'],
    items: [
      {
        label: 'Ordenes de Compra',
        icon: 'table-list',
        to: '/purchase-orders-u',
      },
      {
        label: 'Categorias',
        icon: 'table-list',
        to: '/ca-purchase-orders-u',
      },
    ],
  },
  {
    key: 'Facturas',
    label: 'Gestión de Facturas',
    icon: 'dolly',
    visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento', 'Subjefe de Departamento', 'Colaborador'],
    items: [
      {
        label: 'Facturas',
        icon: 'table-list',
        to: '/invoices-u',
      },
    ],
  },
  {
    key: 'Administración',
    label: 'Sistema',
    icon: 'user',
    visibleForRoles: ['Administrador'],
    items: [
      {
        label: 'Usuarios',
        icon: 'table-list',
        to: '/users-ua',
      },
      {
        label: 'Auditorias',
        icon: 'table-list',
        to: '/audits-a',
      },
      {
        label: 'Visor de Eventos',
        icon: 'table-list',
        to: '/errors-a',
      },
      {
        label: 'Movimientos de Inventario',
        icon: 'table-list',
        to: '/inv-movements-ua',
      },
    ],
  },
];

const filteredItems = computed(() => {
  return items
    .filter((item) => item.visibleForRoles.includes(userRole.value)) // Filtrar bloques
    .map((item) => ({
      ...item,
      items: item.items?.filter(
        (subItem) =>
          !subItem.visibleForRoles || subItem.visibleForRoles.includes(userRole.value) // Filtrar sub-ítems
      ),
    }));
});

const expandedKeys = ref({});
</script>

<template>
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
        <PanelMenu :model="filteredItems">
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
        <PanelMenu :model="filteredItems" :expandedKeys="expandedKeys">
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