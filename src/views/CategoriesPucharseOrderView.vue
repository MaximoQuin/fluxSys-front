<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useCategoriesStore } from "../stores/categoriesPurchaseOrderStore";
import { Trash2, RefreshCw, PlusCircle, Edit2, Save, XCircle } from "lucide-vue-next";

const categoriesStore = useCategoriesStore();

const newCategory = ref({
  name_category_purchase_order: "",
  id_company_Id: 1, // Valor por defecto; ajusta según convenga
});

const editingCategory = ref<any>(null);

onMounted(async () => {
  await categoriesStore.fetchCategories();
  console.log("Vista: Categorías cargadas", categoriesStore.categories);
});

watch(
  () => categoriesStore.categories,
  (newCategories) => {
    console.log("Vista: Datos actualizados desde la API:", newCategories);
  }
);

// Función para agregar una nueva categoría
const addCategory = async () => {
  if (newCategory.value.name_category_purchase_order.trim() === "") {
    console.error("El nombre de la categoría no puede estar vacío.");
    return;
  }
  console.log("Vista: Agregando categoría", newCategory.value);
  try {
    await categoriesStore.addCategory(newCategory.value);
    newCategory.value.name_category_purchase_order = ""; // Limpiar el campo después de agregar
    console.log("Vista: Categoría agregada exitosamente.");
  } catch (error) {
    console.error("Error al agregar categoría:", error);
  }
};

// Función para iniciar el modo de edición de una categoría
const startEditing = (category: any) => {
  console.log("Vista: Iniciando edición para", category);
  editingCategory.value = { ...category }; // Se crea una copia para no modificar directamente el array
};

// Función para cancelar la edición
const cancelEditing = () => {
  console.log("Vista: Cancelar edición");
  editingCategory.value = null;
};

// Función para guardar la edición
const saveEdit = async () => {
  if (!editingCategory.value) return;
  const { id_category_purchase_order, name_category_purchase_order } = editingCategory.value;
  const id_company_Id = editingCategory.value.id_company_Id || 1;
  console.log(
    "Vista: Guardando edición para ID",
    id_category_purchase_order,
    "con datos",
    { name_category_purchase_order, id_company_Id }
  );
  try {
    await categoriesStore.updateCategory(id_category_purchase_order, { name_category_purchase_order, id_company_Id });
    editingCategory.value = null; // Limpiar modo edición al finalizar
    console.log("Vista: Edición guardada exitosamente.");
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
};

// Función para eliminar (soft delete) una categoría
const deleteCategory = async (id: number) => {
  console.log("Vista: Eliminando categoría con ID", id);
  try {
    await categoriesStore.deleteCategory(id);
    console.log("Vista: Categoría eliminada exitosamente.");
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
  }
};

// Función para restaurar una categoría eliminada
const restoreCategory = async (id: number) => {
  console.log("Vista: Restaurando categoría con ID", id);
  try {
    await categoriesStore.restoreCategory(id);
    console.log("Vista: Categoría restaurada exitosamente.");
  } catch (error) {
    console.error("Error al restaurar la categoría:", error);
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Categorías de Órdenes de Compra
    </h1>

    <!-- Indicador de carga -->
    <div v-if="categoriesStore.loading" class="text-center mb-4">
      Cargando...
    </div>

    <!-- Mensaje de error -->
    <div v-if="categoriesStore.error" class="text-center text-red-500 mb-4">
      {{ categoriesStore.error }}
    </div>

    <!-- Formulario para agregar nueva categoría -->
    <div class="flex gap-4 mb-6">
      <input
        v-model="newCategory.name_category_purchase_order"
        class="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Nueva categoría"
      />
      <button
        @click="addCategory"
        class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        <PlusCircle class="w-5 h-5" /> Agregar
      </button>
    </div>

    <!-- Lista de categorías -->
    <div v-if="categoriesStore.categories.length">
      <div
        v-for="category in categoriesStore.categories"
        :key="category.id_category_purchase_order"
        class="p-5 bg-white shadow-lg rounded-xl mb-4"
      >
        <!-- Modo de edición inline -->
        <div
          v-if="editingCategory && editingCategory.id_category_purchase_order === category.id_category_purchase_order"
        >
          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700">Nombre de Categoría:</label>
            <input
              v-model="editingCategory.name_category_purchase_order"
              class="border p-2 rounded w-full"
              placeholder="Editar nombre"
            />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700">ID de Compañía:</label>
            <input
              v-model="editingCategory.id_company_Id"
              type="number"
              class="border p-2 rounded w-full"
              placeholder="Editar ID de compañía"
            />
          </div>
          <div class="flex gap-2 mt-2">
            <button
              @click="saveEdit"
              class="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1"
            >
              <Save class="w-4 h-4" /> Guardar
            </button>
            <button
              @click="cancelEditing"
              class="bg-gray-500 text-white px-3 py-1 rounded flex items-center gap-1"
            >
              <XCircle class="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
        <!-- Visualización normal de la categoría -->
        <div v-else>
          <h3 class="text-xl font-semibold">{{ category.name_category_purchase_order }}</h3>
          <p class="text-gray-500">Compañía: {{ category.name_company }}</p>
          <div class="flex justify-end gap-4 mt-4">
            <button
              v-if="!category.delete_log_category_purchase_order"
              @click="startEditing(category)"
              class="text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <Edit2 class="w-5 h-5" /> Editar
            </button>
            <button
              v-if="!category.delete_log_category_purchase_order"
              @click="deleteCategory(category.id_category_purchase_order)"
              class="text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 class="w-5 h-5" /> Eliminar
            </button>
            <button
              v-else
              @click="restoreCategory(category.id_category_purchase_order)"
              class="text-green-500 hover:text-green-700 flex items-center gap-1"
            >
              <RefreshCw class="w-5 h-5" /> Restaurar
            </button>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-gray-600 text-center">No hay categorías disponibles</p>
  </div>
</template>

<style scoped>
/* Estilos para los botones */
button {
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
}

/* Estilos para la lista de categorías */
ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
