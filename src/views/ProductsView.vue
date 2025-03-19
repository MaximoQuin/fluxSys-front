<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Categorías de Productos</h1>

    <!-- Sección para crear nueva categoría -->
    <div class="mb-4 p-4 bg-white rounded shadow">
      <h2 class="text-xl font-bold mb-2">Crear Nueva Categoría</h2>
      <div class="flex flex-wrap gap-2">
        <input v-model="newCategoryProductName" placeholder="Nombre de categoría"
          class="border rounded px-3 py-2 flex-grow" />

        <select v-model="selectedCompany" class="border rounded px-3 py-2">
          <option value="" disabled selected>Seleccionar empresa</option>
          <option v-for="company in companyStore.companies" :key="company.id_company" :value="company.id_company">
            {{ company.name_company }}
          </option>
        </select>

        <button @click="createCategoryProduct" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          :disabled="!newCategoryProductName.trim() || !selectedCompany">
          Crear Categoría
        </button>
      </div>
    </div>

    <!-- Filtros de visualización -->
    <div class="mb-4 flex">
      <button @click="showActiveCategories"
        :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive }" class="px-4 py-2 rounded-l">
        Activas
      </button>
      <button @click="showDeletedCategories"
        :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive }" class="px-4 py-2 rounded-r">
        Eliminadas
      </button>
    </div>

    <!-- Tabla de categorías de productos -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-4 border-b text-left">ID</th>
            <th class="py-2 px-4 border-b text-left">Nombre</th>
            <th class="py-2 px-4 border-b text-left">Empresa</th>
            <th class="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in filteredCategoriesProducts" :key="category.id_category_product">
            <td class="py-2 px-4 border-b">{{ category.id_category_product }}</td>

            <td class="py-2 px-4 border-b">
              <span v-if="!isEditing(category.id_category_product)">{{ category.name_category_product }}</span>
              <input v-else v-model="editingName" class="border rounded px-2 py-1 w-full" />
            </td>

            <td class="py-2 px-4 border-b">
              <span v-if="!isEditing(category.id_category_product)">
                <span>{{ category.name_company }}</span>
              </span>
              <select v-else v-model="editingCompany" class="border rounded px-2 py-1 w-full">
                <option value="" disabled selected>Seleccionar empresa</option>
                <option v-for="company in companyStore.companies" :key="company.id_company" :value="company.id_company">
                  {{ company.name_company }}
                </option>
              </select>
            </td>
            <td class="py-2 px-4 border-b">
              <div v-if="!isEditing(category.id_category_product)" class="flex space-x-2">
                <button v-if="showActive"
                  @click="startEdit(category.id_category_product, category.name_category_product, category.id_category_product)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                  Editar
                </button>

                
                <button v-if="showActive && !isEditing(category.id_category_product)"
                  @click="removeCategoryProduct(category.id_category_product)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                  Eliminar
                </button>

                <button v-if="!showActive" @click="restoreDeletedCategoryProduct(category.id_category_product)"
                  class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                  Restaurar
                </button>
                </div>
                <div v-else class="flex space-x-2">
                <button @click="saveEdit(category.id_category_product)"
                  class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                  Guardar
                </button>

              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCategoryProductStore } from '@/stores/productStore';
import { useCompanyStore } from '@/stores/companyStore';

const productStore = useCategoryProductStore();
const showActive = ref(true);
const editingId = ref<number | null>(null);
const editingName = ref('');
const newCategoryProductName = ref('');

const companyStore = useCompanyStore();
const editingCompany = ref(0);
const selectedCompany = ref(0);

const filteredCategoriesProducts = computed(() => {
  return productStore.categories_products.filter(categoryProduct =>
    showActive.value ? !categoryProduct.delete_log_category_product : categoryProduct.delete_log_category_product
  );
});

const isEditing = (id: number) => {
  return editingId.value === id;
};

const startEdit = (id: number, name: string, companyId: number) => {
  editingId.value = id;
  editingName.value = name;
  editingCompany.value = companyId;
};

const saveEdit = async (id: number) => {
  if (editingName.value.trim()) {
    await productStore.editCategoryProduct(id, editingName.value, editingCompany.value);
    editingId.value = null;
    editingName.value = '';
    await productStore.fetchCategoriesProducts();
  }
};

const showActiveCategories = () => {
  showActive.value = true;
};

const showDeletedCategories = () => {
  showActive.value = false;
};

const removeCategoryProduct = async (id: number) => {
  await productStore.removeCategoryProduct(id);
  await productStore.fetchCategoriesProducts();
};

const restoreDeletedCategoryProduct = async (id: number) => {
  await productStore.restoreDeletedCategoryProduct(id);
  await productStore.fetchCategoriesProducts();
};

const createCategoryProduct = async () => {
  if (newCategoryProductName.value.trim() && selectedCompany.value) {
    await productStore.addCategoryProduct(newCategoryProductName.value, selectedCompany.value);
    newCategoryProductName.value = '';
    selectedCompany.value = 0;
    await productStore.fetchCategoriesProducts();
  }
};

onMounted(async () => {
  await productStore.fetchCategoriesProducts();
});

</script>