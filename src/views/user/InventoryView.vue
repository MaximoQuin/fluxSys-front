<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Inventario</h1>

    <!-- Filtros -->
    <div class="mb-4">
      <button @click="showActiveInventories"
        :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive }" class="px-4 py-2 rounded-l">
        Activos
      </button>
      <button @click="showDeletedInventories"
        :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive }" class="px-4 py-2 rounded-r">
        Eliminados
      </button>
    </div>

    <!-- Tabla de inventario -->
    <TableComponent :loader="inventoryStore.loading" :columns="mappedColumns" :data="filteredInventories"
      id="id_inventory_product" :flagRestore="showActive" @actionSee="handleSee" @actionCreate="handleCreate"
      @actionUpdate="handleUpdate" @actionDanger="handleRemove" @actionRestore="restoreDeletedProduct"
      :currentUserCompany="currentUserCompany">
    </TableComponent>

    <!-- Modal de ver -->
    <Dialog v-model:visible="visible2" modal header="Detalles del Producto" :style="{ width: '25rem' }">
      <!-- <h2 class="text-xl font-bold mb-4">Detalles del Producto</h2> -->
      <div class="bg-white p-6 rounded-lg shadow">
        <p><strong>Nombre:</strong> {{ currentProduct.name_product }}</p>
        <p><strong>Stock:</strong> {{ currentProduct.stock_product }}</p>
        <p><strong>Precio:</strong> {{ currentProduct.price_product }}</p>
        <p><strong>Categoría:</strong> {{ currentProduct.name_category_product }}</p>
        <p><strong>Estado:</strong> {{ currentProduct.name_state }}</p>
        <p><strong>Tipo de Movimiento:</strong> {{ currentProduct.name_movement_type }}</p>
        <p><strong>Proveedor:</strong> {{ currentProduct.name_supplier }}</p>
        <p><strong>Departamento:</strong> {{ currentProduct.name_department }}</p>

        <h3 class="font-bold mt-4">Información Adicional</h3>

        <details class="mb-4">
          <summary class="font-semibold cursor-pointer">
            Proveedores asociados ({{ currentProduct?.suppliers?.length || 0 }})
          </summary>
          <ul class="mt-2 pl-4">
            <li v-for="supplier in currentProduct?.suppliers || []" :key="supplier.id_supplier" class="mb-2">
              {{ supplier.name_supplier }}
            </li>
          </ul>
        </details>

        <details class="mb-4">
          <summary class="font-semibold cursor-pointer">
            Facturas asociadas ({{ currentProduct?.invoices?.length || 0 }})
          </summary>
          <ul class="mt-2 pl-4">
            <li v-for="invoice in currentProduct?.invoices || []" :key="invoice.id_invoice" class="mb-2">
              {{ invoice.name_invoice }}
            </li>
          </ul>
        </details>

        <details>
          <summary class="font-semibold cursor-pointer">
            Órdenes de compra asociadas ({{ currentProduct?.purchaseOrders?.length || 0 }})
          </summary>
          <ul class="mt-2 pl-4">
            <li v-for="order in currentProduct?.purchaseOrders || []" :key="order.id_purchase_order" class="mb-2">
              {{ order.name_purchase_order }}
            </li>
          </ul>
        </details>

      </div>
    </Dialog>

    <!-- Modal de editar y crear -->
    <Dialog v-model:visible="visible" modal :header="isEdit ? 'Editar inventario' : 'Crear inventario'"
      :style="{ width: '25rem' }">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2 mb-4">
          <label for="name" class="font-semibold w-24">Nombre de inventario:</label>
          <InputText v-model="editingProduct.name_product" type="text" placeholder="Nombre del producto" id="name"
            class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label for="stock" class="font-semibold w-24">Stock:</label>
          <InputText v-model="editingProduct.stock_product" type="number" placeholder="Stock" id="stock"
            class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label for="price" class="font-semibold w-24">Precio:</label>
          <InputText v-model="editingProduct.price_product" type="number" placeholder="Precio" id="price"
            class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label class="font-semibold w-24">Categoría:</label>
          <select v-model="editingProduct.id_category_product_Id" class="border rounded px-4 py-2">
            <option :value="null" disabled>Seleccione una categoría</option>
            <option v-for="category in categoryProductStore.categoriesProducts" :key="category.id_category_product"
              :value="category.id_category_product">
              {{ category.name_category_product }}
            </option>
          </select>
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label class="font-semibold w-24">Estado:</label>
          <select v-model="editingProduct.id_state_Id" class="border rounded px-4 py-2">
            <option :value="null" disabled>Seleccione un estado</option>
            <option v-for="state in stateStore.states" :key="state.id_state" :value="state.id_state">
              {{ state.name_state }}
            </option>
          </select>
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label class="font-semibold w-24">Movimiento:</label>
          <select v-model="editingProduct.id_movement_type_Id" class="border rounded px-4 py-2">
            <option :value="null" disabled>Seleccione un tipo de movimiento</option>
            <option v-for="movementType in movementTypeStore.movementsTypes" :key="movementType.id_movement_type"
              :value="movementType.id_movement_type">
              {{ movementType.name_movement_type }}
            </option>
          </select>
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label class="font-semibold w-24">Proveedor:</label>
          <select v-model="editingProduct.id_supplier_Id" class="border rounded px-4 py-2">
            <option :value="null" disabled>Seleccione un proveedor</option>
            <option v-for="supplier in supplierStore.suppliers" :key="supplier.id_supplier"
              :value="supplier.id_supplier">
              {{ supplier.name_supplier }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="danger" @click="visible = false"></Button>
        <Button type="button" label="Guardar" severity="info"
          @click="isEdit ? updateProduct() : createProduct(); visible = false"></Button>
      </div>
    </Dialog>

    <!-- Modal de confirmación para borrar -->
    <ConfirmDialog></ConfirmDialog>

    <!-- Descargar PDF (no funciono jajaja mejor lo quito)-->
    <!-- <div class="mt-4">
      <button
        @click="downloadPDF"
        class="bg-green-500 text-white px-4 py-2 rounded"
      >
        Descargar PDF
      </button>
    </div> -->

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useCategoryProductStore } from '@/stores/categoryProductStore';
import { useStateStore } from '@/stores/stateStore';
import { useMovementTypeStore } from '@/stores/movementTypeStore';
import { useSupplierStore } from '@/stores/supplierStore';
import { useAuthStore } from '@/stores/authStore';
import type { InventoryProduct } from '@/interfaces/InventoryProduct';

import TableComponent from '@/components/TableComponent.vue';

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();

const visible = ref(false);
const isEdit = ref(false);
const idProduct = ref(0);
const editingProduct = ref<InventoryProduct>();

const visible2 = ref(false);
const currentProduct = ref();

// Stores
const inventoryStore = useInventoryStore();
const categoryProductStore = useCategoryProductStore();
const stateStore = useStateStore();
const movementTypeStore = useMovementTypeStore();
const supplierStore = useSupplierStore();
const authStore = useAuthStore();

const showActive = ref(true);

// Función para descargar PDF
// const downloadPDF = async () => {
//   try {
//     await inventoryStore.downloadPDF();
//   } catch (error) {
//     console.error('Error al descargar el PDF:', error);
//     alert('Hubo un error al descargar el PDF. Por favor, intenta nuevamente.');
//   }
// };

// Obtener el nombre de la compañía del usuario actual
const currentUserCompany = computed(() => authStore.user?.company?.name_company || '');

const mappedColumns = [
  { field: 'name_product', header: 'Nombre' },
  { field: 'stock_product', header: 'Stock' },
  { field: 'price_product', header: 'Precio' },
  { field: 'name_category_product', header: 'Categoría' },
  { field: 'name_state', header: 'Estado' },
  { field: 'name_movement_type', header: 'Tipo de Movimiento' },
  { field: 'name_supplier', header: 'Proveedor' }
];

// Filtro de inventarios
const filteredInventories = computed(() => {
  return inventoryStore.inventories.filter(inventory =>
    showActive.value ? !inventory.delete_log_inventory : inventory.delete_log_inventory
  );
});

// Mostrar inventarios activos
const showActiveInventories = () => {
  showActive.value = true;
};

// Mostrar inventarios eliminados
const showDeletedInventories = () => {
  showActive.value = false;
};

const handleRemove = async (id: number) => {
  deleteProduct(id);
};

const restoreDeletedProduct = async (id: number) => {
  await inventoryStore.restoreDeletedInventory(id);
  await inventoryStore.fetchInventories(); // Refrescar la lista
};

const handleSee = (id: number) => {
  const FindInventary = filteredInventories.value.find(inventary => inventary.id_inventory_product === id);
  if (FindInventary) {
    currentProduct.value = FindInventary;
    console.log(currentProduct.value);

    visible2.value = true;
  }
};

const handleCreate = () => {
  isEdit.value = false;
  editingProduct.value = {};
  visible.value = true;
};

const createProduct = async () => {
  const user = authStore.user;
  const data = {
    ...editingProduct.value,
    id_department_Id: user?.department?.id_department,
    id_company_Id: user?.company?.id_company,
    id_user_Id: user?.id_user,
  };
  await inventoryStore.addInventory(data);
  editingProduct.value = {}; // Limpiar el campo después de crear la empresa
  await inventoryStore.fetchInventories(); // Refrescar la lista
};

// const handleUpdate = async (id: number, newValue: string) => {
const handleUpdate = async (id: number) => {
  isEdit.value = true;
  idProduct.value = id;
  const inventaryEdit = filteredInventories.value.find(inventary => inventary.id_inventory_product === id);
  editingProduct.value = inventaryEdit;
  visible.value = true;
};

const updateProduct = async () => {
  const nameUser = authStore.user?.name_user || '';
  const nameDepartment = authStore.user?.department?.name_department || '';
  await inventoryStore.editInventory(idProduct.value, editingProduct.value, nameUser, nameDepartment);
  await inventoryStore.fetchInventories(); // Refrescar la lista
};

const deleteProduct = (id: number) => {
  confirm.require({
    message: '¿Quieres eliminar este producto?',
    header: 'Eliminar',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Eliminar',
      severity: 'danger'
    },
    accept: async () => {
      try {
        await inventoryStore.removeInventory(id);
        await inventoryStore.fetchInventories();
        toast.add({ severity: 'info', summary: 'Eliminado', detail: 'Producto eliminado', life: 3000 });
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al eliminar. Intenta nuevamente.', life: 3000 });
      }
    },
    reject: () => {
      // toast.add({ severity: 'error', summary: 'Rechazado', detail: 'Rechazaste la operación', life: 3000 });
    }
  });
};

// Cargar datos al montar el componente
onMounted(() => {
  inventoryStore.fetchInventories();
  supplierStore.fetchSuppliers();
  categoryProductStore.fetchCategoriesProducts();
  stateStore.fetchStates();
  movementTypeStore.fetchMovementsTypes();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
