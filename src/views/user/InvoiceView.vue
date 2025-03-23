<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Gestión de Facturas</h1>
  
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
  
      <!-- Botón para crear factura -->
      <button
        @click="openCreateModal"
        class="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Crear Factura
      </button>
  
      <!-- Tabla de facturas -->
      <table class="min-w-full bg-black">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Nombre</th>
            <th class="py-2 px-4 border-b">Orden de Compra</th>
            <th class="py-2 px-4 border-b">Proveedor</th>
            <th class="py-2 px-4 border-b">Departamento</th>
            <th class="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="invoice in filteredInvoices"
            :key="invoice.id_invoice"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 border-b">{{ invoice.id_invoice }}</td>
            <td class="py-2 px-4 border-b">{{ invoice.name_invoice }}</td>
            <td class="py-2 px-4 border-b">{{ invoice.name_purchase_order }}</td>
            <td class="py-2 px-4 border-b">{{ invoice.name_supplier }}</td>
            <td class="py-2 px-4 border-b">{{ invoice.name_department }}</td>
            <td class="py-2 px-4 border-b">
              <button
                @click="viewInvoice(invoice)"
                class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Ver
              </button>
              <button
                @click="startEdit(invoice)"
                class="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              >
                Editar
              </button>
              <button
                v-if="showActive"
                @click="removeInvoice(invoice.id_invoice)"
                class="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Eliminar
              </button>
              <button
                v-else
                @click="restoreInvoice(invoice.id_invoice)"
                class="bg-green-500 text-white px-4 py-2 rounded"
              >
                Restaurar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Formulario para crear/editar factura -->
      <div v-if="isEditing || isCreating" class="mt-4">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Editar Factura' : 'Crear Factura' }}</h2>
        <form @submit.prevent="saveEdit()">
          <input
            v-model="form.name_invoice"
            placeholder="Nombre de la factura"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          />
          <select
            v-model="form.id_purchase_order_Id"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          >
            <option value="" disabled>Seleccione una orden de compra</option>
            <option
              v-for="order in purchaseOrderStore.purchaseOrders"
              :key="order.id_purchase_order"
              :value="order.id_purchase_order"
            >
              {{ order.name_purchase_order }}
            </option>
          </select>
          <select
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
              {{ isEditing ? 'Guardar Cambios' : 'Crear Factura' }}
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
  
      <!-- Vista de solo lectura para ver factura -->
      <div v-if="isViewing" class="mt-4">
        <h2 class="text-xl font-bold mb-4">Información de la Factura</h2>
        <div class="bg-white p-6 rounded-lg shadow">
          <p><strong>Nombre:</strong> {{ currentInvoice.name_invoice }}</p>
          <p><strong>Orden de Compra:</strong> {{ currentInvoice.name_purchase_order }}</p>
          <p><strong>Proveedor:</strong> {{ currentInvoice.name_supplier }}</p>
          <p><strong>Departamento:</strong> {{ currentInvoice.name_department }}</p>
          <p><strong>Precio Total:</strong> ${{ currentInvoice?.total_price_invoice }}</p>
          <p><strong>Cantidad de Productos:</strong> {{ currentInvoice?.amount_items_in_the_invoice }}</p>
          <h3 class="font-bold mt-4">Productos Asociados</h3>
          <ul>
            <li
              v-for="product in currentInvoice.products"
              :key="product.id_inventory_product"
              class="mb-2"
            >
              {{ product.name_product }} - Cantidad: {{ product.quantity }} - Precio Unitario: ${{ product.unit_price }}
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
  import { useInvoiceStore } from '@/stores/invoiceStore';
  import { useAuthStore } from '@/stores/authStore';
  import { useSupplierStore } from '@/stores/supplierStore';
  import { usePurchaseOrderStore } from '@/stores/purchaseOrderStore';
  import { useInventoryStore } from '@/stores/inventoryStore';
  import type { Invoice } from '@/interfaces/Invoice';
  
  // Stores
  const invoiceStore = useInvoiceStore();
  const authStore = useAuthStore();
  const supplierStore = useSupplierStore();
  const purchaseOrderStore = usePurchaseOrderStore();
  const inventoryStore = useInventoryStore();
  
  // Variables reactivas
  const showActive = ref(true);
  const isEditing = ref(false);
  const isCreating = ref(false);
  const isViewing = ref(false);
  const currentInvoice = ref<Invoice | null>(null);
  const form = ref({
    id_invoice: 0,
    name_invoice: '',
    id_purchase_order_Id: 0,
    id_supplier_Id: 0,
    id_department_Id: authStore.user?.department?.id_department || 0,
    id_company_Id: authStore.user?.company?.id_company || 0,
    products: [] as Array<{ id_inventory_product_Id: number; quantity: number }>,
  });
  
  // Filtro de facturas
  const filteredInvoices = computed(() => {
    return invoiceStore.invoices.filter((invoice) =>
      showActive.value ? !invoice.delete_log_invoices : invoice.delete_log_invoices
    );
  });
  
  // Ver información de la factura
  const viewInvoice = (invoice: Invoice) => {
    isViewing.value = true;
    isEditing.value = false;
    isCreating.value = false;
    currentInvoice.value = invoice;
  };
  
  // Cerrar vista de solo lectura
  const closeView = () => {
    isViewing.value = false;
    currentInvoice.value = null;
  };
  
  // Abrir modal de creación
  const openCreateModal = () => {
    isCreating.value = true;
    isEditing.value = false;
    isViewing.value = false;
    form.value = {
      id_invoice: 0,
      name_invoice: '',
      id_purchase_order_Id: 0,
      id_supplier_Id: 0,
      id_department_Id: authStore.user?.department?.id_department || 0,
      id_company_Id: authStore.user?.company?.id_company || 0,
      products: [],
    };
  };
  
  // Iniciar edición de una factura
  const startEdit = async (invoice: Invoice) => {
    // Recargar órdenes de compra, proveedores y productos si no están cargados
    await purchaseOrderStore.fetchPurchaseOrders();
    await supplierStore.fetchSuppliers();
    await inventoryStore.fetchInventories();
  
    isEditing.value = true;
    isCreating.value = false;
    isViewing.value = false;
  
    // Buscar el ID de la orden de compra por su nombre
    const purchaseOrder = purchaseOrderStore.purchaseOrders.find(
      (order) => order.name_purchase_order === invoice.name_purchase_order
    );
  
    // Buscar el ID del proveedor por su nombre
    const supplier = supplierStore.suppliers.find(
      (sup) => sup.name_supplier === invoice.name_supplier
    );
  
    // Mapear los productos para obtener sus IDs
    const products = invoice.products.map((product) => {
      const inventoryProduct = inventoryStore.inventories.find(
        (inv) => inv.name_product === product.name_product
      );
      return {
        id_inventory_product_Id: inventoryProduct ? inventoryProduct.id_inventory_product : 0,
        quantity: product.quantity,
      };
    });
  
    form.value = {
      id_invoice: invoice.id_invoice,
      name_invoice: invoice.name_invoice,
      id_purchase_order_Id: purchaseOrder ? purchaseOrder.id_purchase_order : 0,
      id_supplier_Id: supplier ? supplier.id_supplier : 0,
      id_department_Id: authStore.user?.department?.id_department || 0,
      id_company_Id: authStore.user?.company?.id_company || 0,
      products: products,
    };
  };
  
  // Cancelar edición/creación
  const cancelEdit = () => {
    isEditing.value = false;
    isCreating.value = false;
    form.value = {
      id_invoice: 0,
      name_invoice: '',
      id_purchase_order_Id: 0,
      id_supplier_Id: 0,
      id_department_Id: authStore.user?.department?.id_department || 0,
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
    try {
      const payload = {
        name_invoice: form.value.name_invoice,
        id_purchase_order_Id: form.value.id_purchase_order_Id,
        id_supplier_Id: form.value.id_supplier_Id,
        id_department_Id: form.value.id_department_Id,
        id_company_Id: form.value.id_company_Id,
        products: form.value.products,
      };
  
      if (isEditing.value) {
        await invoiceStore.editInvoice(form.value.id_invoice, payload);
      } else {
        await invoiceStore.addInvoice(payload);
      }
      cancelEdit();
    } catch (error) {
      console.error("Error al guardar la factura:", error);
    }
  };
  
  // Eliminar factura
  const removeInvoice = async (id: number) => {
    await invoiceStore.removeInvoice(id);
  };
  
  // Restaurar factura
  const restoreInvoice = async (id: number) => {
    await invoiceStore.restoreDeletedInvoice(id);
  };
  
  // Cargar datos al montar el componente
  onMounted(() => {
    invoiceStore.fetchInvoices();
    supplierStore.fetchSuppliers();
    purchaseOrderStore.fetchPurchaseOrders();
    inventoryStore.fetchInventories();
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales si son necesarios */
  </style>