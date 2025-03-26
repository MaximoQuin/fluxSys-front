<template>
  <div class="p-4 md:p-6" style="height: 552px; overflow-y: auto;">
    <!-- Sección de Bienvenida -->
    <Card class="mb-4">
      <template #title>
        <div class="flex items-center justify-between">
          <span>Bienvenido, {{ user?.name_user }}</span>
          <Tag :value="userRole" 
               :severity="userRole === 'Administrador' ? 'success' : 'info'" 
               class="text-sm font-bold" />
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center">
            <i class="pi pi-building mr-2 text-blue-500"></i>
            <span>{{ user?.company?.name_company }}</span>
          </div>
          <div class="flex items-center">
            <i class="pi pi-users mr-2 text-green-500"></i>
            <span>{{ user?.department?.name_department }}</span>
          </div>
          <div class="flex items-center">
            <i class="pi pi-briefcase mr-2 text-purple-500"></i>
            <span>{{ user?.position?.name_position }}</span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Sección solo para Administradores -->
    <div v-if="userRole === 'Administrador'">
      <!-- Estadísticas -->
      <Card class="mb-4" style="height: 370px; overflow-y: auto;">
        <template #title>Resumen del Sistema</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="p-4 border rounded-lg">
              <div class="flex items-center justify-between">
                <span class="font-semibold">Productos</span>
                <span class="text-2xl font-bold">{{ inventories.length }}</span>
              </div>
            </div>
            <div class="p-4 border rounded-lg">
              <div class="flex items-center justify-between">
                <span class="font-semibold">Facturas</span>
                <span class="text-2xl font-bold">{{ invoices.length }}</span>
              </div>
            </div>
            <div class="p-4 border rounded-lg">
              <div class="flex items-center justify-between">
                <span class="font-semibold">Proveedores</span>
                <span class="text-2xl font-bold">{{ suppliers.length }}</span>
              </div>
            </div>
          </div>

          <!-- Acciones rápidas -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Acciones Rápidas</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button label="Ver Usuarios" 
                      icon="pi pi-users" 
                      class="p-button-info"
                      @click="$router.push('/users-ua')" />
              <Button label="Ver Auditorías" 
                      icon="pi pi-history" 
                      class="p-button-secondary"
                      @click="$router.push('/audits-a')" />
            </div>
          </div>

          <!-- Productos recientes -->
          <h3 class="text-lg font-semibold mb-3">Productos Recientes</h3>
          <DataTable :value="recentProducts" 
                    :loading="loading"
                    :scrollable="true"
                    scrollHeight="200px"
                    stripedRows
                    responsiveLayout="scroll"
                    class="p-datatable-sm">
            <Column field="name_product" header="Nombre" :sortable="true"></Column>
            <Column field="stock_product" header="Stock" :sortable="true">
              <template #body="{data}">
                <Tag :value="data.stock_product" 
                     :severity="getStockSeverity(data.stock_product)" />
              </template>
            </Column>
            <Column field="price_product" header="Precio" :sortable="true">
              <template #body="{data}">
                {{ formatCurrency(data.price_product) }}
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- Sección para otros roles (no Administrador) -->
    <div v-else>
      <Card style="height: 370px; overflow-y: auto;">
        <template #title>Panel de Usuario</template>
        <template #content>
          <!-- Acciones disponibles -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Acciones Disponibles</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button label="Ver Inventario" 
                      icon="pi pi-box" 
                      class="p-button-info"
                      @click="$router.push('/inventories-u')" />
              <Button label="Órdenes de Compra" 
                      icon="pi pi-shopping-cart" 
                      class="p-button-help"
                      @click="$router.push('/purchase-orders-u')" />
              <Button label="Facturas" 
                      icon="pi pi-file" 
                      class="p-button-warning"
                      @click="$router.push('/invoices-u')" />
              <Button label="Proveedores" 
                      icon="pi pi-truck" 
                      class="p-button-success"
                      @click="$router.push('/suppliers-u')" />
            </div>
          </div>

          <!-- Inventario simplificado -->
          <h3 class="text-lg font-semibold mb-3">Productos en Inventario</h3>
          <div v-if="loading" class="flex justify-center items-center h-32">
            <ProgressSpinner style="width: 50px; height: 50px" />
          </div>
          <DataTable v-else
                    :value="inventories.slice(0, 5)"
                    :scrollable="true"
                    scrollHeight="200px"
                    stripedRows
                    responsiveLayout="scroll"
                    class="p-datatable-sm">
            <Column field="name_product" header="Nombre" :sortable="true"></Column>
            <Column field="stock_product" header="Stock" :sortable="true">
              <template #body="{data}">
                <Tag :value="data.stock_product" 
                     :severity="getStockSeverity(data.stock_product)" />
              </template>
            </Column>
            <Column field="price_product" header="Precio" :sortable="true">
              <template #body="{data}">
                {{ formatCurrency(data.price_product) }}
              </template>
            </Column>
            <Column field="name_category_product" header="Categoría" :sortable="true"></Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { useSupplierStore } from '@/stores/supplierStore';
import { roles } from '@/types/Roles';

// PrimeVue Components
import Card from 'primevue/card';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressSpinner from 'primevue/progressspinner';

const router = useRouter();

// Stores
const authStore = useAuthStore();
const inventoryStore = useInventoryStore();
const invoiceStore = useInvoiceStore();
const supplierStore = useSupplierStore();

// Refs
const showAllUsers = ref(false);

// Computed
const user = computed(() => authStore.user);
const userRole = computed(() => authStore.userRole);
const inventories = computed(() => inventoryStore.inventories);
const invoices = computed(() => invoiceStore.invoices);
const suppliers = computed(() => supplierStore.suppliers);
const loading = computed(() => inventoryStore.loading);

// Productos recientes (últimos 5)
const recentProducts = computed(() => {
  return [...inventories.value]
    .sort((a, b) => new Date(b.date_insert).getTime() - new Date(a.date_insert).getTime())
    .slice(0, 5);
});

// Métodos
const fetchInventories = async () => {
  await inventoryStore.fetchInventories();
};

const fetchInvoices = async () => {
  await invoiceStore.fetchInvoices();
};

const fetchSuppliers = async () => {
  await supplierStore.fetchSuppliers();
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value);
};

const getStockSeverity = (stock: number) => {
  if (stock > 10) return 'success';
  if (stock > 0) return 'warning';
  return 'danger';
};

// Cargar datos iniciales
onMounted(async () => {
  await fetchInventories();
  
  // Solo administradores cargan estos datos adicionales
  if (userRole.value === 'Administrador') {
    await fetchInvoices();
    await fetchSuppliers();
  }
});
</script>

<style scoped>
/* Estilos personalizados para el scroll */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>