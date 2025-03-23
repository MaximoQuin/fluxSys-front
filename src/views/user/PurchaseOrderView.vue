<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Gestión de Órdenes de Compra</h1>
  
      <!-- Filtros para mostrar activos/eliminados -->
      <div class="mb-4">
        <button
          @click="showActive = true"
          :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive }"
          class="px-4 py-2 rounded-l"
        >
          Activos
        </button>
        <button
          @click="showActive = false"
          :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive }"
          class="px-4 py-2 rounded-r"
        >
          Eliminados
        </button>
      </div>
  
      <!-- Botón para crear orden de compra -->
      <button
        @click="openCreateModal"
        class="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Crear Orden de Compra
      </button>
  
      <!-- Tabla de órdenes de compra -->
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Nombre</th>
            <th class="py-2 px-4 border-b">Usuario</th>
            <th class="py-2 px-4 border-b">Proveedor</th>
            <th class="py-2 px-4 border-b">Categoría</th>
            <th class="py-2 px-4 border-b">Estado</th>
            <th class="py-2 px-4 border-b">Tipo de Movimiento</th>
            <th class="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in filteredPurchaseOrders"
            :key="order.id_purchase_order"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 border-b">{{ order.id_purchase_order }}</td>
            <td class="py-2 px-4 border-b">{{ order.name_purchase_order }}</td>
            <td class="py-2 px-4 border-b">{{ order.name_user }}</td>
            <td class="py-2 px-4 border-b">{{ order.name_supplier }}</td>
            <td class="py-2 px-4 border-b">{{ order.name_category_purchase_order }}</td>
            <td class="py-2 px-4 border-b">{{ order.name_state }}</td>
            <td class="py-2 px-4 border-b">{{ order.name_movement_type }}</td>
            <td class="py-2 px-4 border-b">
              <button
                @click="viewOrder(order)"
                class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Ver
              </button>
              <button
                @click="startEdit(order)"
                class="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              >
                Editar
              </button>
              <button
                v-if="showActive"
                @click="removeOrder(order.id_purchase_order)"
                class="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Eliminar
              </button>
              <button
                v-else
                @click="restoreOrder(order.id_purchase_order)"
                class="bg-green-500 text-white px-4 py-2 rounded"
              >
                Restaurar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Formulario para crear/editar orden de compra -->
      <div v-if="isEditing || isCreating" class="mt-4">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Editar Orden de Compra' : 'Crear Orden de Compra' }}</h2>
        <form @submit.prevent="saveEdit()">
          <input
            v-model="form.name_purchase_order"
            placeholder="Nombre de la orden"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          />
  
          <!-- Select de categorías -->
          <select
            v-if="categoryPurchaseOrderStore.categoriesPurchaseOrders.length > 0"
            v-model="form.id_category_purchase_order_Id"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          >
            <option value="" disabled>Seleccione una categoría</option>
            <option
              v-for="category in categoryPurchaseOrderStore.categoriesPurchaseOrders"
              :key="category.id_category_purchase_order"
              :value="category.id_category_purchase_order"
            >
              {{ category.name_category_purchase_order }}
            </option>
          </select>
  
          <!-- Select de proveedores -->
          <select
            v-if="supplierStore.suppliers.length > 0"
            v-model="form.id_supplier_Id"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          >
            <option value="" disabled>Seleccione un proveedor</option>
            <option
              v-for="supplier in supplierStore.suppliers"
              :key="supplier.id_supplier"
              :value="supplier.id_supplier"
            >
              {{ supplier.name_supplier }}
            </option>
          </select>
  
          <!-- Select de estados -->
          <select
            v-if="stateStore.states.length > 0"
            v-model="form.id_state_Id"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          >
            <option value="" disabled>Seleccione un estado</option>
            <option
              v-for="state in stateStore.states"
              :key="state.id_state"
              :value="state.id_state"
            >
              {{ state.name_state }}
            </option>
          </select>
  
          <!-- Select de tipos de movimiento -->
          <select
            v-if="movementTypeStore.movementsTypes.length > 0"
            v-model="form.id_movement_type_Id"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          >
            <option value="" disabled>Seleccione un tipo de movimiento</option>
            <option
              v-for="movementType in movementTypeStore.movementsTypes"
              :key="movementType.id_movement_type"
              :value="movementType.id_movement_type"
            >
              {{ movementType.name_movement_type }}
            </option>
          </select>
  
          <!-- Lista de productos asociados -->
          <div class="mb-4">
            <h3 class="font-bold mb-2">Productos Asociados</h3>
            <div v-for="(product, index) in form.products" :key="index" class="flex gap-2 mb-2">
              <select
                v-model="product.id_inventory_product_Id"
                class="border rounded px-4 py-2"
                required
              >
                <option value="" disabled>Seleccione un producto</option>
                <option
                  v-for="inventoryProduct in inventoryStore.inventories"
                  :key="inventoryProduct.id_inventory_product"
                  :value="inventoryProduct.id_inventory_product"
                >
                  {{ inventoryProduct.name_product }}
                </option>
              </select>
              <input
                v-model="product.quantity"
                type="number"
                placeholder="Cantidad"
                class="border rounded px-4 py-2"
                required
              />
              <button
                type="button"
                @click="removeProduct(index)"
                class="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
            <button
              type="button"
              @click="addProduct"
              class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
              Añadir Producto
            </button>
          </div>
  
          <!-- Botones del formulario -->
          <div class="flex justify-end gap-2">
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">
              {{ isEditing ? 'Guardar Cambios' : 'Crear Orden de Compra' }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
  
      <!-- Vista de solo lectura para ver orden de compra -->
      <div v-if="isViewing" class="mt-4">
        <h2 class="text-xl font-bold mb-4">Información de la Orden de Compra</h2>
        <div class="bg-white p-6 rounded-lg shadow">
          <p><strong>Nombre:</strong> {{ currentOrder.name_purchase_order }}</p>
          <p><strong>Usuario:</strong> {{ currentOrder.name_user }}</p>
          <p><strong>Proveedor:</strong> {{ currentOrder.name_supplier }}</p>
          <p><strong>Categoría:</strong> {{ currentOrder.name_category_purchase_order }}</p>
          <p><strong>Estado:</strong> {{ currentOrder.name_state }}</p>
          <p><strong>Tipo de Movimiento:</strong> {{ currentOrder.name_movement_type }}</p>
          <p><strong>Cantidad de productos:</strong> {{ currentOrder?.amount_items_in_the_order }}</p>
          <p><strong>Precio total:</strong> {{ currentOrder?.total_price_products }}</p>
          <h3 class="font-bold mt-4">Productos Asociados</h3>
          <ul>
            <li
              v-for="product in currentOrder.products"
              :key="product.id_inventory_product"
              class="mb-2"
            >
              {{ product.name_product }} - Cantidad: {{ product.quantity }} - Precio Unitario: ${{ product.price }}
            </li>
          </ul>
          <button
            @click="closeView"
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
  import { usePurchaseOrderStore } from '@/stores/purchaseOrderStore';
  import { useAuthStore } from '@/stores/authStore';
  import { useCategoryPurchaseOrderStore } from '@/stores/categoryPurchaseOrderStore';
  import { useSupplierStore } from '@/stores/supplierStore';
  import { useStateStore } from '@/stores/stateStore';
  import { useMovementTypeStore } from '@/stores/movementTypeStore';
  import { useInventoryStore } from '@/stores/inventoryStore';
  import type { PurchaseOrder } from '@/interfaces/PurchaseOrder';
  
  // Stores
  const purchaseOrderStore = usePurchaseOrderStore();
  const authStore = useAuthStore();
  const categoryPurchaseOrderStore = useCategoryPurchaseOrderStore();
  const supplierStore = useSupplierStore();
  const stateStore = useStateStore();
  const movementTypeStore = useMovementTypeStore();
  const inventoryStore = useInventoryStore();
  
  // Variables reactivas
  const showActive = ref(true);
  const isEditing = ref(false);
  const isCreating = ref(false);
  const isViewing = ref(false);
  const currentOrder = ref<PurchaseOrder | null>(null);
  const form = ref({
    id_purchase_order: 0,
    name_purchase_order: '',
    id_user_Id: authStore.user?.id_user || 0,
    id_category_purchase_order_Id: 0,
    id_department_Id: authStore.user?.department?.id_department || 0,
    id_supplier_Id: 0,
    id_state_Id: 0,
    id_movement_type_Id: 0,
    id_company_Id: authStore.user?.company?.id_company || 0,
    products: [] as Array<{ id_inventory_product_Id: number; quantity: number }>,
  });
  
  // Filtro de órdenes de compra
  const filteredPurchaseOrders = computed(() => {
    return purchaseOrderStore.purchaseOrders.filter((order) =>
      showActive.value ? !order.delete_log_purchase_orders : order.delete_log_purchase_orders
    );
  });
  
  // Ver información de la orden de compra
  const viewOrder = (order: PurchaseOrder) => {
    isViewing.value = true;
    isEditing.value = false;
    isCreating.value = false;
    currentOrder.value = order;
  };
  
  // Cerrar vista de solo lectura
  const closeView = () => {
    isViewing.value = false;
    currentOrder.value = null;
  };
  
  // Abrir modal de creación
  const openCreateModal = () => {
    isCreating.value = true;
    isEditing.value = false;
    isViewing.value = false;
    form.value = {
      id_purchase_order: 0,
      name_purchase_order: '',
      id_user_Id: authStore.user?.id_user || 0,
      id_category_purchase_order_Id: 0,
      id_department_Id: authStore.user?.department?.id_department || 0,
      id_supplier_Id: 0,
      id_state_Id: 0,
      id_movement_type_Id: 0,
      id_company_Id: authStore.user?.company?.id_company || 0,
      products: [],
    };
  };
  
  // Iniciar edición de una orden de compra
  const startEdit = async (order: PurchaseOrder) => {
    // Recargar datos necesarios si no están cargados
    await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders();
    await supplierStore.fetchSuppliers();
    await stateStore.fetchStates();
    await movementTypeStore.fetchMovementsTypes();
    await inventoryStore.fetchInventories();
  
    isEditing.value = true;
    isCreating.value = false;
    isViewing.value = false;
  
    // Buscar el ID de la categoría por su nombre
    const category = categoryPurchaseOrderStore.categoriesPurchaseOrders.find(
      (cat) => cat.name_category_purchase_order === order.name_category_purchase_order
    );
  
    // Buscar el ID del proveedor por su nombre
    const supplier = supplierStore.suppliers.find(
      (sup) => sup.name_supplier === order.name_supplier
    );
  
    // Buscar el ID del estado por su nombre
    const state = stateStore.states.find(
      (st) => st.name_state === order.name_state
    );
  
    // Buscar el ID del tipo de movimiento por su nombre
    const movementType = movementTypeStore.movementsTypes.find(
      (mt) => mt.name_movement_type === order.name_movement_type
    );
  
    // Mapear los productos para obtener sus IDs
    const products = order.products.map((product) => {
      const inventoryProduct = inventoryStore.inventories.find(
        (inv) => inv.name_product === product.name_product
      );
      return {
        id_inventory_product_Id: inventoryProduct ? inventoryProduct.id_inventory_product : 0,
        quantity: product.quantity,
      };
    });
  
    form.value = {
      id_purchase_order: order.id_purchase_order,
      name_purchase_order: order.name_purchase_order,
      id_user_Id: authStore.user?.id_user || 0,
      id_category_purchase_order_Id: category ? category.id_category_purchase_order : 0,
      id_department_Id: authStore.user?.department?.id_department || 0,
      id_supplier_Id: supplier ? supplier.id_supplier : 0,
      id_state_Id: state ? state.id_state : 0,
      id_movement_type_Id: movementType ? movementType.id_movement_type : 0,
      id_company_Id: authStore.user?.company?.id_company || 0,
      products: products,
    };
  };
  
  // Cancelar edición/creación
  const cancelEdit = () => {
    isEditing.value = false;
    isCreating.value = false;
    form.value = {
      id_purchase_order: 0,
      name_purchase_order: '',
      id_user_Id: 0,
      id_category_purchase_order_Id: 0,
      id_department_Id: 0,
      id_supplier_Id: 0,
      id_state_Id: 0,
      id_movement_type_Id: 0,
      id_company_Id: 0,
      products: [],
    };
  };
  
  // Añadir producto al formulario
  const addProduct = () => {
    form.value.products.push({ id_inventory_product_Id: 0, quantity: 0 });
  };
  
  // Eliminar producto del formulario
  const removeProduct = (index: number) => {
    form.value.products.splice(index, 1);
  };
  
  // Guardar cambios (editar o crear)
  const saveEdit = async () => {
    if (isEditing.value) {
      await purchaseOrderStore.editPurchaseOrder(form.value.id_purchase_order, form.value);
    } else {
      await purchaseOrderStore.addPurchaseOrder(form.value);
    }
    cancelEdit();
  };
  
  // Eliminar orden de compra
  const removeOrder = async (id: number) => {
    await purchaseOrderStore.removePurchaseOrder(id);
  };
  
  // Restaurar orden de compra
  const restoreOrder = async (id: number) => {
    await purchaseOrderStore.restoreDeletedPurchaseOrder(id);
  };
  
  // Cargar datos al montar el componente
  onMounted(async () => {
    await purchaseOrderStore.fetchPurchaseOrders();
    await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders();
    await supplierStore.fetchSuppliers();
    await stateStore.fetchStates();
    await movementTypeStore.fetchMovementsTypes();
    await inventoryStore.fetchInventories();
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales si son necesarios */
  </style>