<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { computed, ref, watch } from 'vue';
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
    icon: 'home',
    visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento'],
    to: '/users-ua',
    items: [
      {
        label: 'Compañías',
        icon: 'building',
        to: '/companies-a',
        visibleForRoles: ['Administrador'],
      },
      {
        label: 'Usuarios',
        icon: 'users',
        to: '/users-ua',
        visibleForRoles: ['Administrador Empresarial'],
      },
      {
        label: 'Departamentos',
        icon: 'building',
        to: '/departments-u',
        visibleForRoles: ['Administrador', 'Administrador Empresarial'],
      },
      {
        label: 'Posiciones',
        icon: 'briefcase',
        to: '/positions-u',
      },
    ],
  },
  {
    key: 'Inventario',
    label: 'Gestión de Inventario',
    icon: 'boxes-stacked',
    visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento', 'Subjefe de Departamento', 'Colaborador'],
    to: '/inventories-u',
    items: [
      {
        label: 'Inventario',
        icon: 'table-list',
        to: '/inventories-u',
      },
      {
        label: 'Categorias',
        icon: 'table-columns',
        to: '/ca-products-u',
      },
      {
        label: 'Tipos de Movimientos',
        icon: 'arrows-turn-to-dots',
        to: '/movements-types-u',
      },
      {
        label: 'Estados de Productos',
        icon: 'circle-info',
        to: '/states-u',
      },
      {
        label: 'Movimientos de Inventario',
        icon: 'arrows-turn-to-dots',
        to: '/inv-movements-ua',
        visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento', 'Subjefe de Departamento'],
      },
    ],
  },
  {
    key: 'Proveedores',
    label: 'Proveedores',
    icon: 'users',
    visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento', 'Subjefe de Departamento', 'Colaborador'],
    to: '/suppliers-u',
    items: [
      {
        label: 'Proveedores',
        icon: 'users',
        to: '/suppliers-u',
      },
      {
        label: 'Categorias',
        icon: 'table-columns',
        to: '/ca-suppliers-u',
      },
    ],
  },
  {
    key: 'Ordenes de Compra',
    label: 'Ordenes de Compra',
    icon: 'dolly',
    visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento', 'Subjefe de Departamento', 'Colaborador'],
    to: '/purchase-orders-u',
    items: [
      {
        label: 'Ordenes de Compra',
        icon: 'cart-shopping',
        to: '/purchase-orders-u',
      },
      {
        label: 'Categorias',
        icon: 'table-columns',
        to: '/ca-purchase-orders-u',
      },
    ],
  },
  {
    key: 'Facturas',
    label: 'Gestión de Facturas',
    icon: 'file-invoice-dollar',
    visibleForRoles: ['Administrador', 'Administrador Empresarial', 'Jefe de Departamento', 'Subjefe de Departamento', 'Colaborador'],
    to: '/invoices-u',
    items: [
      {
        label: 'Facturas',
        icon: 'file-invoice',
        to: '/invoices-u',
      },
    ],
  },
  {
    key: 'Administración',
    label: 'Sistema',
    icon: 'desktop',
    visibleForRoles: ['Administrador'],
    to: '/users-ua',
    items: [
      {
        label: 'Usuarios',
        icon: 'users',
        to: '/users-ua',
      },
      {
        label: 'Auditorias',
        icon: 'search',
        to: '/audits-a',
      },
      {
        label: 'Visor de Eventos',
        icon: 'calendar',
        to: '/errors-a',
      },
      {
        label: 'Movimientos de Inventario',
        icon: 'arrows-turn-to-dots',
        to: '/inv-movements-ua',
      },
    ],
  },
];

const filteredItems = computed(() => {
  return items
    .filter((item) => item.visibleForRoles.includes(userRole.value))
    .map((item) => ({
      ...item,
      items: item.items?.filter(
        (subItem) =>
          !subItem.visibleForRoles || subItem.visibleForRoles.includes(userRole.value)
      ),
    }));
});

const expandedKeys = ref<Record<string, boolean>>({});

// Cerrar todos los submenús cuando el sidebar se cierra
watch(() => props.isSidebarActive, (isActive) => {
  if (!isActive) {
    expandedKeys.value = {};
  }
});

const toggleItem = (itemKey: string) => {
  if (!props.isSidebarActive) return;

  // Comportamiento de acordeón: cerrar todos los demás
  const newExpandedKeys: Record<string, boolean> = {};

  // Si el item no estaba expandido, lo expandimos
  if (!expandedKeys.value[itemKey]) {
    newExpandedKeys[itemKey] = true;
  }

  expandedKeys.value = newExpandedKeys;
};

const handleMainItemClick = (event: Event, item: any) => {
  if (!props.isSidebarActive) {
    // Sidebar cerrado - permitir navegación
    return;
  }

  // Sidebar abierto - manejar expansión
  event.preventDefault();
  toggleItem(item.key);
};
</script>

<template>
  <aside class="flex mr-2 min-h-[95vh]">
    <div class="flex flex-col py-8 px-5 bg-white dark:bg-gray-900 dark:border-gray-700 rounded-lg gap-4">
      <RouterLink to="/">
        <button style="cursor: pointer;"
          class="flex items-center transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none p-4 sidebar"
          :class="sidebarClass">
          <img class="w-auto h-6" src="@/assets/logo.webp" alt="">
          <p class="text-sm font-medium text-gray-700 capitalize dark:text-white sidebar">
            FLUX-SYS
          </p>
        </button>
      </RouterLink>

      <PanelMenu :model="filteredItems" :expandedKeys="expandedKeys">
        <template #item="{ item }">
          <!-- Ítems principales (con key) -->
          <template v-if="item.key">
            <RouterLink :to="item.to" @click="(e) => handleMainItemClick(e, item)" custom
              v-slot="{ navigate, isActive }">
              <button style="cursor: pointer;"
                class="flex items-center transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none p-4 sidebar w-full"
                :class="[sidebarClass, { 'bg-gray-100 dark:bg-gray-800': isActive }]" @click="navigate">
                <font-awesome-icon :icon="['fas', item.icon]" />
                <p class="text-sm font-medium text-gray-700 capitalize dark:text-white sidebar">
                  {{ item.label }}
                </p>
                <!-- Flecha para indicar que es desplegable (solo cuando sidebar está abierto) -->
                <!-- <span  class="ml-auto"> -->
                <font-awesome-icon v-if="props.isSidebarActive && item.items"
                  :icon="['fas', expandedKeys[item.key] ? 'chevron-up' : 'chevron-down']" class="ml-auto text-xs" />
                <!-- </span> -->
              </button>
            </RouterLink>
          </template>

          <!-- Sub-ítems (sin key) -->
          <template v-else>
            <RouterLink v-if="item.to" :to="item.to" custom v-slot="{ navigate, isActive }">
              <button style="cursor: pointer;"
                class="flex items-center transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none p-4 sidebar"
                :class="[sidebarClass, { 'bg-gray-100 dark:bg-gray-800': isActive }]" @click="navigate">
                <font-awesome-icon :icon="['fas', item.icon]" />
                <p class="text-sm font-medium text-gray-700 capitalize dark:text-white sidebar">
                  {{ item.label }}
                </p>
              </button>
            </RouterLink>
            <button v-else style="cursor: pointer;"
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
  </aside>
</template>

<style lang="scss" scoped>
/* Estilos para resaltar el ítem activo */
.router-link-active {
  button {
    background-color: #f3f4f6;

    /* bg-gray-100 */
    .dark & {
      background-color: #1f2937;
      /* dark:bg-gray-800 */
    }
  }
}
</style>
