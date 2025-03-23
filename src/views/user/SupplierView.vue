<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Gestión de Proveedores</h1>
  
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
  
      <!-- Botón para crear proveedor -->
      <button
        @click="openCreateModal"
        class="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Crear Proveedor
      </button>
  
      <!-- Tabla de proveedores -->
      <table class="min-w-full bg-black">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Nombre</th>
            <th class="py-2 px-4 border-b">Correo</th>
            <th class="py-2 px-4 border-b">Teléfono</th>
            <th class="py-2 px-4 border-b">Categoría</th>
            <th class="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="supplier in filteredSuppliers"
            :key="supplier.id_supplier"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 border-b">{{ supplier.id_supplier }}</td>
            <td class="py-2 px-4 border-b">{{ supplier.name_supplier }}</td>
            <td class="py-2 px-4 border-b">{{ supplier.mail_supplier }}</td>
            <td class="py-2 px-4 border-b">{{ supplier.phone_supplier }}</td>
            <td class="py-2 px-4 border-b">{{ supplier.name_category_supplier }}</td>
            <td class="py-2 px-4 border-b">
              <button
                @click="viewSupplier(supplier)"
                class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Ver
              </button>
              <button
                @click="startEdit(supplier)"
                class="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              >
                Editar
              </button>
              <button
                v-if="showActive"
                @click="removeSupplier(supplier.id_supplier)"
                class="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Eliminar
              </button>
              <button
                v-else
                @click="restoreSupplier(supplier.id_supplier)"
                class="bg-green-500 text-white px-4 py-2 rounded"
              >
                Restaurar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Formulario para crear/editar proveedor -->
      <div v-if="isEditing || isCreating" class="mt-4">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Editar Proveedor' : 'Crear Proveedor' }}</h2>
        <form @submit.prevent="saveEdit()">
          <input
            v-model="form.name_supplier"
            placeholder="Nombre"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          />
          <input
            v-model="form.mail_supplier"
            placeholder="Correo"
            type="email"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          />
          <input
            v-model="form.phone_supplier"
            placeholder="Teléfono"
            type="number"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          />
          <select
            v-model="form.id_category_supplier_Id"
            class="border rounded px-4 py-2 mb-2 w-full"
            required
          >
            <option value="" disabled>Seleccione una categoría</option>
            <option
              v-for="category in categorySupplierStore.categoriesSuppliers"
              :key="category.id_category_supplier"
              :value="category.id_category_supplier"
            >
              {{ category.name_category_supplier }}
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
                v-model="product.suggested_price"
                type="number"
                placeholder="Precio sugerido"
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
              {{ isEditing ? 'Guardar Cambios' : 'Crear Proveedor' }}
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
  
      <!-- Vista de solo lectura para ver proveedor -->
      <div v-if="isViewing" class="mt-4">
        <h2 class="text-xl font-bold mb-4">Información del Proveedor</h2>
        <div class="bg-white p-6 rounded-lg shadow">
          <p><strong>Nombre:</strong> {{ currentSupplier.name_supplier }}</p>
          <p><strong>Correo:</strong> {{ currentSupplier.mail_supplier }}</p>
          <p><strong>Teléfono:</strong> {{ currentSupplier.phone_supplier }}</p>
          <p><strong>Categoría:</strong> {{ currentSupplier.name_category_supplier }}</p>
          <h3 class="font-bold mt-4">Productos Asociados</h3>
          <ul>
            <li
              v-for="product in currentSupplier.products"
              :key="product.id_inventory_product"
              class="mb-2"
            >
              {{ product.name_product }} - ${{ product.suggested_price }}
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
  import { useSupplierStore } from '@/stores/supplierStore';
  import { useCategorySupplierStore } from '@/stores/categorySupplierStore';
  import { useInventoryStore } from '@/stores/inventoryStore';
  import { useAuthStore } from '@/stores/authStore';
  import type { Supplier } from '@/interfaces/Supplier';
  
  // Stores
  const supplierStore = useSupplierStore();
  const categorySupplierStore = useCategorySupplierStore();
  const inventoryStore = useInventoryStore();
  const authStore = useAuthStore();
  
  // Variables reactivas
  const showActive = ref(true);
  const isEditing = ref(false);
  const isCreating = ref(false);
  const isViewing = ref(false);
  const currentSupplier = ref<Supplier | null>(null);
  const form = ref({
    id_supplier: 0,
    name_supplier: '',
    mail_supplier: '',
    phone_supplier: 0,
    id_category_supplier_Id: 0,
    products: [] as Array<{ id_inventory_product_Id: number; suggested_price: number }>,
  });
  
  // Filtro de proveedores
  const filteredSuppliers = computed(() => {
    return supplierStore.suppliers.filter((supplier) =>
      showActive.value ? !supplier.delete_log_suppliers : supplier.delete_log_suppliers
    );
  });
  
  // Ver información del proveedor
  const viewSupplier = (supplier: Supplier) => {
    isViewing.value = true;
    isEditing.value = false;
    isCreating.value = false;
    currentSupplier.value = supplier;
  };
  
  // Cerrar vista de solo lectura
  const closeView = () => {
    isViewing.value = false;
    currentSupplier.value = null;
  };
  
  // Abrir modal de creación
  const openCreateModal = () => {
    isCreating.value = true;
    isEditing.value = false;
    isViewing.value = false;
    form.value = {
      id_supplier: 0,
      name_supplier: '',
      mail_supplier: '',
      phone_supplier: 0,
      id_category_supplier_Id: 0,
      products: [],
    };
  };
  
  // Iniciar edición de un proveedor
  const startEdit = async (supplier: Supplier) => {
  // Recargar categorías y productos si no están cargados
  await categorySupplierStore.fetchCategoriesSuppliers();
  await inventoryStore.fetchInventories();

  isEditing.value = true;
  isCreating.value = false;
  isViewing.value = false;

  // Buscar el ID de la categoría por su nombre
  const category = categorySupplierStore.categoriesSuppliers.find(
    (cat) => cat.name_category_supplier === supplier.name_category_supplier
  );

  // Mapear los productos para obtener sus IDs
  const products = supplier.products.map((product) => {
    const inventoryProduct = inventoryStore.inventories.find(
      (inv) => inv.name_product === product.name_product
    );
    return {
      id_inventory_product_Id: inventoryProduct ? inventoryProduct.id_inventory_product : 0, // Asignar el ID encontrado
      suggested_price: product.suggested_price,
    };
  });

  form.value = {
    id_supplier: supplier.id_supplier,
    name_supplier: supplier.name_supplier,
    mail_supplier: supplier.mail_supplier,
    phone_supplier: supplier.phone_supplier,
    id_category_supplier_Id: category ? category.id_category_supplier : 0, // Asignar el ID encontrado
    products: products, // Usar los productos mapeados
  };
};
  
  // Cancelar edición/creación
  const cancelEdit = () => {
    isEditing.value = false;
    isCreating.value = false;
    form.value = {
      id_supplier: 0,
      name_supplier: '',
      mail_supplier: '',
      phone_supplier: 0,
      id_category_supplier_Id: 0,
      products: [],
    };
  };
  
  // Añadir producto al formulario
  const addProduct = () => {
    form.value.products.push({ id_inventory_product_Id: 0, suggested_price: 0 });
  };
  
  // Eliminar producto del formulario
  const removeProduct = (index: number) => {
    form.value.products.splice(index, 1);
  };
  
  // Guardar cambios (editar o crear)
  const saveEdit = async () => {
    if (isEditing.value) {
      const id_company = authStore.user?.company?.id_company || 0;
      const payload = {
        ...form.value,
        id_company_Id: id_company,
      };
      await supplierStore.editSupplier(form.value.id_supplier, payload);
    } else {
      const id_company = authStore.user?.company?.id_company || 0;
      const payload = {
        ...form.value,
        id_company_Id: id_company,
      };
      await supplierStore.addSupplier(payload);
    }
    cancelEdit();
  };
  
  // Eliminar proveedor
  const removeSupplier = async (id: number) => {
    await supplierStore.removeSupplier(id);
  };
  
  // Restaurar proveedor
  const restoreSupplier = async (id: number) => {
    await supplierStore.restoreDeletedSupplier(id);
  };
  
  // Cargar datos al montar el componente
  onMounted(() => {
    supplierStore.fetchSuppliers();
    categorySupplierStore.fetchCategoriesSuppliers();
    inventoryStore.fetchInventories();
  });
  </script>
  
  <style scoped>
  /* Estilos adicionales si son necesarios */
  </style>