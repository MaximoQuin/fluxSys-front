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
        visibleForRoles: ['Administrador', 'Administrador Empresarial'],
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
        label: 'Historial de Inventario',
        icon: 'table-list',
        label: 'Historial de Inventario',
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
    to: '/audits-a',
    items: [
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

watch(() => props.isSidebarActive, (isActive) => {
  if (!isActive) {
    expandedKeys.value = {};
  }
});

const toggleItem = (itemKey: string) => {
  if (!props.isSidebarActive) return;

  const newExpandedKeys: Record<string, boolean> = {};
  
  if (!expandedKeys.value[itemKey]) {
    newExpandedKeys[itemKey] = true;
  }

  expandedKeys.value = newExpandedKeys;
};

const handleMainItemClick = (event: Event, item: any, navigate: Function) => {
  if (props.isSidebarActive) {
    event.preventDefault();
    toggleItem(item.key);
  } else {
    navigate();
  }
};
</script>

<template>
  <aside class="flex mr-2 min-h-[94vh]">
    <div class="flex flex-col py-8 px-5 bg-white dark:bg-gray-900 dark:border-gray-700 rounded-lg gap-4">
      <RouterLink to="/" active-class="" exact-active-class="">
  <button 
    style="cursor: pointer;"
    class="flex items-center transition-colors duration-200 gap-x-2 focus:outline-none p-4 sidebar"
    :class="sidebarClass"
  >
    <img class="w-auto h-8" src="@/assets/logo.png" alt="">
    <p class="text-sm font-medium text-gray-700 capitalize dark:text-white sidebar">
      FluxSYS
    </p>
  </button>
</RouterLink>

      <PanelMenu :model="filteredItems" :expandedKeys="expandedKeys">
        <template #item="{ item }">
          <!-- Ítems principales (con key) -->
          <template v-if="item.key">
            <RouterLink 
              :to="item.to" 
              custom
              v-slot="{ navigate, isActive }"
            >
              <button 
                style="cursor: pointer;"
                class="flex items-center transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none p-4 sidebar w-full"
                :class="[sidebarClass, { 'bg-gray-100 dark:bg-gray-800': isActive }]"
                @click="(e) => handleMainItemClick(e, item, navigate)"
                @keydown.enter="(e) => handleMainItemClick(e, item, navigate)"
              >
                <font-awesome-icon :icon="['fas', item.icon]" />
                <p class="text-sm font-medium text-gray-700 capitalize dark:text-white sidebar">
                  {{ item.label }}
                </p>
                <span v-if="props.isSidebarActive && item.items" class="ml-auto">
                  <font-awesome-icon 
                    :icon="['fas', expandedKeys[item.key] ? 'chevron-up' : 'chevron-down']" 
                    class="text-xs"
                  />
                </span>
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
.router-link-active {
  button {
    background-color: #f3f4f6;
    .dark & {
      background-color: #1f2937;
    }
  }
}
</style>
