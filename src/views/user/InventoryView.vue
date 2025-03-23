<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Inventario</h1>

    <!-- Filtros -->
    <div class="mb-4">
      <button
        @click="showActiveInventories"
        :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive }"
        class="px-4 py-2 rounded-l"
      >
        Activos
      </button>
      <button
        @click="showDeletedInventories"
        :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive }"
        class="px-4 py-2 rounded-r"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla de inventario -->
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">Nombre</th>
          <th class="py-2 px-4 border-b">Stock</th>
          <th class="py-2 px-4 border-b">Precio</th>
          <th class="py-2 px-4 border-b">Categoría</th>
          <th class="py-2 px-4 border-b">Estado</th>
          <th class="py-2 px-4 border-b">Tipo de Movimiento</th>
          <th class="py-2 px-4 border-b">Proveedor</th>
          <th class="py-2 px-4 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="inventory in filteredInventories"
          :key="inventory.id_inventory_product"
          class="hover:bg-gray-50"
        >
          <td class="py-2 px-4 border-b">{{ inventory.id_inventory_product }}</td>
          <td class="py-2 px-4 border-b">
            <input
              v-if="isEditing(inventory.id_inventory_product)"
              v-model="editingProduct.name_product"
              type="text"
              class="border rounded px-2 py-1"
            />
            <span v-else>{{ inventory.name_product }}</span>
          </td>
          <td class="py-2 px-4 border-b">
            <input
              v-if="isEditing(inventory.id_inventory_product)"
              v-model="editingProduct.stock_product"
              type="number"
              class="border rounded px-2 py-1"
            />
            <span v-else>{{ inventory.stock_product }}</span>
          </td>
          <td class="py-2 px-4 border-b">
            <input
              v-if="isEditing(inventory.id_inventory_product)"
              v-model="editingProduct.price_product"
              type="number"
              class="border rounded px-2 py-1"
            />
            <span v-else>{{ inventory.price_product }}</span>
          </td>
          <td class="py-2 px-4 border-b">
            <select
              v-if="isEditing(inventory.id_inventory_product)"
              v-model="editingProduct.id_category_product_Id"
              class="border rounded px-2 py-1"
            >
              <option
                v-for="category in categoryProductStore.categoriesProducts"
                :key="category.id_category_product"
                :value="category.id_category_product"
              >
                {{ category.name_category_product }}
              </option>
            </select>
            <span v-else>{{ inventory.name_category_product }}</span>
          </td>
          <td class="py-2 px-4 border-b">
            <select
              v-if="isEditing(inventory.id_inventory_product)"
              v-model="editingProduct.id_state_Id"
              class="border rounded px-2 py-1"
            >
              <option
                v-for="state in stateStore.states"
                :key="state.id_state"
                :value="state.id_state"
              >
                {{ state.name_state }}
              </option>
            </select>
            <span v-else>{{ inventory.name_state }}</span>
          </td>
          <td class="py-2 px-4 border-b">
            <select
              v-if="isEditing(inventory.id_inventory_product)"
              v-model="editingProduct.id_movement_type_Id"
              class="border rounded px-2 py-1"
            >
              <option
                v-for="movementType in movementTypeStore.movementsTypes"
                :key="movementType.id_movement_type"
                :value="movementType.id_movement_type"
              >
                {{ movementType.name_movement_type }}
              </option>
            </select>
            <span v-else>{{ inventory.name_movement_type }}</span>
          </td>
          <td class="py-2 px-4 border-b">
            <select
              v-if="isEditing(inventory.id_inventory_product)"
              v-model="editingProduct.id_supplier_Id"
              class="border rounded px-2 py-1"
            >
              <option
                v-for="supplier in supplierStore.suppliers"
                :key="supplier.id_supplier"
                :value="supplier.id_supplier"
              >
                {{ supplier.name_supplier }}
              </option>
            </select>
            <span v-else>{{ inventory.name_supplier }}</span>
          </td>
          <td class="py-2 px-4 border-b">
            <button
              v-if="isEditing(inventory.id_inventory_product)"
              @click="saveEdit(inventory.id_inventory_product)"
              class="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Guardar
            </button>
            <button
              v-if="isEditing(inventory.id_inventory_product)"
              @click="cancelEdit"
              class="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <template v-else>
              <button
                @click="viewDetails(inventory.id_inventory_product)"
                class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Ver Detalles
              </button>
              <button
                v-if="showActive"
                @click="startEdit(inventory.id_inventory_product)"
                class="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              >
                Editar
              </button>
              <button
                v-if="showActive"
                @click="removeInventory(inventory.id_inventory_product)"
                class="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Eliminar
              </button>
              <button
                v-else
                @click="restoreDeletedInventory(inventory.id_inventory_product)"
                class="bg-green-500 text-white px-4 py-2 rounded"
              >
                Restaurar
              </button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Cargando -->
    <div v-if="loading" class="mt-4">Cargando...</div>

    <!-- Crear Nuevo Producto -->
    <div class="mt-4">
      <h2 class="text-xl font-bold">Crear Producto</h2>
      <div class="flex flex-wrap gap-4 mt-2">
        <input
          v-model="newProduct.name_product"
          type="text"
          placeholder="Nombre del producto"
          class="border rounded px-4 py-2"
        />
        <input
          v-model="newProduct.stock_product"
          type="number"
          placeholder="Stock"
          class="border rounded px-4 py-2"
        />
        <input
          v-model="newProduct.price_product"
          type="number"
          placeholder="Precio"
          class="border rounded px-4 py-2"
        />
        <select
          v-model="newProduct.id_category_product_Id"
          class="border rounded px-4 py-2"
        >
          <option :value="null" disabled>Seleccione una categoría</option>
          <option
            v-for="category in categoryProductStore.categoriesProducts"
            :key="category.id_category_product"
            :value="category.id_category_product"
          >
            {{ category.name_category_product }}
          </option>
        </select>
        <select
          v-model="newProduct.id_state_Id"
          class="border rounded px-4 py-2"
        >
          <option :value="null" disabled>Seleccione un estado</option>
          <option
            v-for="state in stateStore.states"
            :key="state.id_state"
            :value="state.id_state"
          >
            {{ state.name_state }}
          </option>
        </select>
        <select
          v-model="newProduct.id_movement_type_Id"
          class="border rounded px-4 py-2"
        >
          <option :value="null" disabled>Seleccione un tipo de movimiento</option>
          <option
            v-for="movementType in movementTypeStore.movementsTypes"
            :key="movementType.id_movement_type"
            :value="movementType.id_movement_type"
          >
            {{ movementType.name_movement_type }}
          </option>
        </select>
        <select
          v-model="newProduct.id_supplier_Id"
          class="border rounded px-4 py-2"
        >
          <option :value="null" disabled>Seleccione un proveedor</option>
          <option
            v-for="supplier in supplierStore.suppliers"
            :key="supplier.id_supplier"
            :value="supplier.id_supplier"
          >
            {{ supplier.name_supplier }}
          </option>
        </select>
        <button
          @click="createProduct"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear
        </button>
      </div>
    </div>

    <!-- Descargar PDF (no funciono jajaja mejor lo quito)-->
    <!-- <div class="mt-4">
      <button
        @click="downloadPDF"
        class="bg-green-500 text-white px-4 py-2 rounded"
      >
        Descargar PDF
      </button>
    </div> -->

    <!-- Detalles del producto -->
    <div v-if="currentProduct" class="mt-4">
      <h2 class="text-xl font-bold mb-4">Detalles del Producto</h2>
      <div class="bg-white p-6 rounded-lg shadow">
        <p><strong>Nombre:</strong> {{ currentProduct.name_product }}</p>
        <p><strong>Stock:</strong> {{ currentProduct.stock_product }}</p>
        <p><strong>Precio:</strong> {{ currentProduct.price_product }}</p>
        <p><strong>Categoría:</strong> {{ currentProduct.name_category_product }}</p>
        <p><strong>Estado:</strong> {{ currentProduct.name_state }}</p>
        <p><strong>Tipo de Movimiento:</strong> {{ currentProduct.name_movement_type }}</p>
        <p><strong>Proveedor:</strong> {{ currentProduct.name_supplier }}</p>
        <p><strong>Departamento:</strong> {{ currentProduct.name_department }}</p>

        <!-- Información adicional -->
        <h3 class="font-bold mt-4">Información Adicional</h3>

        <!-- Proveedores asociados -->
        <details class="mb-4">
          <summary class="font-semibold cursor-pointer">
            Proveedores asociados ({{ currentProduct.suppliers.length }})
          </summary>
          <ul class="mt-2 pl-4">
            <li v-for="supplier in currentProduct.suppliers" :key="supplier.id_supplier" class="mb-2">
              {{ supplier.name_supplier }}
            </li>
          </ul>
        </details>

        <!-- Facturas asociadas -->
        <details class="mb-4">
          <summary class="font-semibold cursor-pointer">
            Facturas asociadas ({{ currentProduct.invoices.length }})
          </summary>
          <ul class="mt-2 pl-4">
            <li v-for="invoice in currentProduct.invoices" :key="invoice.id_invoice" class="mb-2">
              {{ invoice.name_invoice }}
            </li>
          </ul>
        </details>

        <!-- Órdenes de compra asociadas -->
        <details class="mb-4">
          <summary class="font-semibold cursor-pointer">
            Órdenes de compra asociadas ({{ currentProduct.purchaseOrders.length }})
          </summary>
          <ul class="mt-2 pl-4">
            <li v-for="order in currentProduct.purchaseOrders" :key="order.id_purchase_order" class="mb-2">
              {{ order.name_purchase_order }}
            </li>
          </ul>
        </details>

        <button
          @click="currentProduct = null"
          class="bg-gray-500 text-white px-4 py-2 rounded mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>
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

// Stores
const inventoryStore = useInventoryStore();
const categoryProductStore = useCategoryProductStore();
const stateStore = useStateStore();
const movementTypeStore = useMovementTypeStore();
const supplierStore = useSupplierStore();
const authStore = useAuthStore();

// Variables reactivas
const showActive = ref(true);
const editingId = ref<number | null>(null);
const editingProduct = ref<Partial<InventoryProduct>>({});
const newProduct = ref({
  name_product: '',
  stock_product: null as number | null,
  price_product: null as number | null,
  id_category_product_Id: null as number | null,
  id_state_Id: null as number | null,
  id_movement_type_Id: null as number | null,
  id_supplier_Id: null as number | null,
  id_department_Id: null as number | null,
  id_company_Id: null as number | null,
  id_user_Id: null as number | null,
});
const currentProduct = ref<InventoryProduct | null>(null);

// Función para verificar si un producto está en modo de edición
const isEditing = (id: number) => {
  return editingId.value === id;
};

// Función para iniciar la edición de un producto
const startEdit = (id: number) => {
  const product = inventoryStore.inventories.find(inv => inv.id_inventory_product === id);
  if (product) {
    // Buscar el ID de la categoría por su nombre
    const category = categoryProductStore.categoriesProducts.find(
      (cat) => cat.name_category_product === product.name_category_product
    );

    // Buscar el ID del estado por su nombre
    const state = stateStore.states.find(
      (st) => st.name_state === product.name_state
    );

    // Buscar el ID del tipo de movimiento por su nombre
    const movementType = movementTypeStore.movementsTypes.find(
      (mt) => mt.name_movement_type === product.name_movement_type
    );

    // Buscar el ID del proveedor por su nombre
    const supplier = supplierStore.suppliers.find(
      (sup) => sup.name_supplier === product.name_supplier
    );

    editingProduct.value = {
      ...product,
      id_category_product_Id: category ? category.id_category_product : null,
      id_state_Id: state ? state.id_state : null,
      id_movement_type_Id: movementType ? movementType.id_movement_type : null,
      id_supplier_Id: supplier ? supplier.id_supplier : null,
      id_department_Id: authStore.user?.department?.id_department,
      id_company_Id: authStore.user?.company?.id_company,
      id_user_Id: authStore.user?.id_user,
    };
    editingId.value = id;
  }
};

// Función para guardar los cambios de la edición
const saveEdit = async (id: number) => {
  if (editingProduct.value) {
    try {
      if (
        !editingProduct.value.name_product ||
        editingProduct.value.stock_product === null ||
        editingProduct.value.price_product === null ||
        editingProduct.value.id_category_product_Id === null ||
        editingProduct.value.id_state_Id === null ||
        editingProduct.value.id_movement_type_Id === null ||
        editingProduct.value.id_supplier_Id === null ||
        editingProduct.value.id_department_Id === null ||
        editingProduct.value.id_company_Id === null ||
        editingProduct.value.id_user_Id === null
      ) {
        throw new Error('Todos los campos son obligatorios.');
      }

      const nameUser = authStore.user?.name_user || '';
      const nameDepartment = authStore.user?.department?.name_department || '';

      await inventoryStore.editInventory(id, editingProduct.value, nameUser, nameDepartment);
      editingId.value = null;
      editingProduct.value = {};
    } catch (error) {
      console.error('Error al editar el producto:', error);
      alert('Hubo un error al editar el producto. Por favor, verifica los datos e intenta nuevamente.');
    }
  }
};

// Función para cancelar la edición
const cancelEdit = () => {
  editingId.value = null;
  editingProduct.value = {};
};

// Función para ver detalles del producto
const viewDetails = async (id: number) => {
  await inventoryStore.fetchInventoryById(id);
  currentProduct.value = inventoryStore.currentInventory;
};

// Función para eliminar un producto
const removeInventory = async (id: number) => {
  try {
    await inventoryStore.removeInventory(id);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    alert('Hubo un error al eliminar el producto. Por favor, intenta nuevamente.');
  }
};

// Función para restaurar un producto
const restoreDeletedInventory = async (id: number) => {
  try {
    await inventoryStore.restoreDeletedInventory(id);
  } catch (error) {
    console.error('Error al restaurar el producto:', error);
    alert('Hubo un error al restaurar el producto. Por favor, intenta nuevamente.');
  }
};

// Función para crear un nuevo producto
const createProduct = async () => {
  const user = authStore.user;

  if (
    newProduct.value.name_product.trim() &&
    newProduct.value.stock_product !== null &&
    newProduct.value.price_product !== null &&
    newProduct.value.id_category_product_Id !== null &&
    newProduct.value.id_state_Id !== null &&
    newProduct.value.id_movement_type_Id !== null &&
    newProduct.value.id_supplier_Id !== null
  ) {
    const data = {
      ...newProduct.value,
      id_department_Id: user?.department?.id_department,
      id_company_Id: user?.company?.id_company,
      id_user_Id: user?.id_user,
    };

    try {
      await inventoryStore.addInventory(data);
      newProduct.value = {
        name_product: '',
        stock_product: null,
        price_product: null,
        id_category_product_Id: null,
        id_state_Id: null,
        id_movement_type_Id: null,
        id_supplier_Id: null,
      };
    } catch (error) {
      console.error('Error al crear el producto:', error);
      alert('Hubo un error al crear el producto. Por favor, verifica los datos e intenta nuevamente.');
    }
  }
};

// Función para descargar PDF
const downloadPDF = async () => {
  try {
    await inventoryStore.downloadPDF();
  } catch (error) {
    console.error('Error al descargar el PDF:', error);
    alert('Hubo un error al descargar el PDF. Por favor, intenta nuevamente.');
  }
};

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