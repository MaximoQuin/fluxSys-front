<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Categorías de Órdenes de Compra</h1>

    <!-- Filtros -->
    <div class="mb-4">
      <button
        @click="showActiveCategories"
        :class="{'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive}"
        class="px-4 py-2 rounded-l"
      >
        Activas
      </button>
      <button
        @click="showDeletedCategories"
        :class="{'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive}"
        class="px-4 py-2 rounded-r"
      >
        Eliminadas
      </button>
    </div>

    <!-- Tabla de categorías -->
    <table class="min-w-full bg-white">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">Nombre</th>
          <th class="py-2 px-4 border-b">Compañía</th>
          <th class="py-2 px-4 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in filteredCategories" :key="category.id_category_purchase_order" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b">{{ category.id_category_purchase_order }}</td>
          <td class="py-2 px-4 border-b">
            <span v-if="!isEditing(category.id_category_purchase_order)">{{ category.name_category_purchase_order }}</span>
            <div v-else class="flex items-center">
              <input
                v-model="editingName"
                class="border rounded px-2 py-1"
              />
              <button
                @click="saveEdit(category.id_category_purchase_order)"
                class="bg-green-500 text-white px-4 py-2 rounded ml-2"
              >
                Aceptar
              </button>
            </div>
          </td>
          <td class="py-2 px-4 border-b">{{ category.name_company }}</td>
          <td class="py-2 px-4 border-b">
            <button
              v-if="showActive && !isEditing(category.id_category_purchase_order)"
              @click="startEdit(category.id_category_purchase_order, category.name_category_purchase_order)"
              class="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Editar
            </button>
            <button
              v-if="showActive && !isEditing(category.id_category_purchase_order)"
              @click="removeCategoryPurchaseOrder(category.id_category_purchase_order)"
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              Eliminar
            </button>
            <button
              v-else-if="!isEditing(category.id_category_purchase_order)"
              @click="restoreDeletedCategoryPurchaseOrder(category.id_category_purchase_order)"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              Restaurar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Cargando -->
    <div v-if="loading" class="mt-4">
      Cargando...
    </div>

    <!-- Crear Nueva Categoría -->
    <div class="mt-4">
      <h2 class="text-xl font-bold">Crear Categoría</h2>
      <div class="flex items-center mt-2">
        <input
          v-model="newCategoryName"
          type="text"
          placeholder="Nombre de la categoría"
          class="border rounded px-4 py-2 mr-2"
        />
        <button
          @click="createCategoryPurchaseOrder"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCategoryPurchaseOrderStore } from '@/stores/categoryPurchaseOrderStore';

const categoryPurchaseOrderStore = useCategoryPurchaseOrderStore();
const showActive = ref(true);
const editingId = ref<number | null>(null);
const editingName = ref('');
const newCategoryName = ref('');

const filteredCategories = computed(() => {
  return categoryPurchaseOrderStore.categoriesPurchaseOrders.filter(category =>
    showActive.value ? !category.delete_log_category_purchase_order : category.delete_log_category_purchase_order
  );
});

const isEditing = (id: number) => {
  return editingId.value === id;
};

const startEdit = (id: number, name: string) => {
  editingId.value = id;
  editingName.value = name;
};

const saveEdit = async (id: number) => {
  if (editingName.value.trim()) {
    await categoryPurchaseOrderStore.editCategoryPurchaseOrder(id, editingName.value);
    editingId.value = null;
    editingName.value = '';
    await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders(); // Refrescar la lista
  }
};

const showActiveCategories = () => {
  showActive.value = true;
};

const showDeletedCategories = () => {
  showActive.value = false;
};

const removeCategoryPurchaseOrder = async (id: number) => {
  await categoryPurchaseOrderStore.removeCategoryPurchaseOrder(id);
  await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders(); // Refrescar la lista
};

const restoreDeletedCategoryPurchaseOrder = async (id: number) => {
  await categoryPurchaseOrderStore.restoreDeletedCategoryPurchaseOrder(id);
  await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders(); // Refrescar la lista
};

const createCategoryPurchaseOrder = async () => {
  if (newCategoryName.value.trim()) {
    await categoryPurchaseOrderStore.addCategoryPurchaseOrder(newCategoryName.value);
    newCategoryName.value = ''; // Limpiar el campo después de crear la categoría
    await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders(); // Refrescar la lista
  }
};

onMounted(() => {
  categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>