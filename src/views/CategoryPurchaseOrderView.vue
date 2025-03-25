<template>
  <div class="container mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Gestión de Categorías de Órdenes de Compra</h1>

    <!-- Filtros -->
    <div class="flex mb-6 space-x-2">
      <button
        @click="showActiveCategories"
        :class="showActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-6 py-2 rounded-l-lg transition-colors duration-300"
      >
        Activas
      </button>
      <button
        @click="showDeletedCategories"
        :class="!showActive ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-6 py-2 rounded-r-lg transition-colors duration-300"
      >
        Eliminadas
      </button>
    </div>

    <!-- Tabla reutilizable -->
    <TableComponent
      :loader="loading"
      :columns="columns"
      :data="filteredCategories"
      id="id_category_purchase_order"
      :flagRestore="showActive"
      :currentUserCompany="''"
      @actionSee="handleSee"
      @actionUpdate="handleUpdate"
      @actionDanger="removeCategoryPurchaseOrder"
      @actionRestore="restoreDeletedCategoryPurchaseOrder"
      @actionCreate="showCreateModal"
    />

    <!-- Modal Crear/Editar -->
    <Dialog v-model:visible="visibleForm" modal :header="isEdit ? 'Editar Categoría' : 'Crear Categoría'" :style="{ width: '30rem' }">
      <div class="flex flex-col gap-4">
        <label class="font-semibold">Nombre de la categoría:*</label>
        <InputText v-model="formCategoryName" :class="{ 'p-invalid': nameError }" />
        <small v-if="nameError" class="p-error">{{ nameError }}</small>

        <label class="font-semibold">Seleccionar compañía:*</label>
        <Dropdown
          v-model="formCompanyName"
          :options="companyOptions"
          optionLabel="name"
          optionValue="name"
          placeholder="Selecciona una compañía"
          :class="{ 'p-invalid': companyError }"
        />
        <small v-if="companyError" class="p-error">{{ companyError }}</small>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancelar" severity="danger" @click="visibleForm = false" />
        <Button label="Guardar" severity="info" :disabled="!isFormValid" @click="submitForm" />
      </div>
    </Dialog>

    <!-- Modal Ver -->
    <Dialog v-model:visible="visibleView" modal header="Detalles de Categoría" :style="{ width: '30rem' }">
      <div class="flex flex-col gap-4">
        <div>
          <span class="font-semibold text-gray-500">Nombre:</span>
          <div class="font-bold text-gray-800">{{ viewCategory?.name_category_purchase_order }}</div>
        </div>
        <div>
          <span class="font-semibold text-gray-500">Compañía:</span>
          <div class="font-bold text-gray-800">{{ viewCategory?.name_company }}</div>
        </div>
      </div>
    </Dialog>

    <!-- Confirmación -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCategoryPurchaseOrderStore } from '@/stores/categoryPurchaseOrderStore';
import { useCompanyStore } from '@/stores/companyStore';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import TableComponent from '@/components/TableComponent.vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';

const categoryPurchaseOrderStore = useCategoryPurchaseOrderStore();
const companyStore = useCompanyStore();
const confirm = useConfirm();
const toast = useToast();

const showActive = ref(true);
const visibleForm = ref(false);
const visibleView = ref(false);
const isEdit = ref(false);
const loading = ref(false);

const editingId = ref<number | null>(null);
const formCategoryName = ref('');
const formCompanyName = ref('');
const viewCategory = ref<any>(null);

const columns = [
  { field: 'id_category_purchase_order', header: 'ID' },
  { field: 'name_category_purchase_order', header: 'Nombre' },
  { field: 'name_company', header: 'Compañía' },
];

const companyOptions = computed(() =>
  companyStore.companies.map(company => ({ name: company.name_company }))
);

const filteredCategories = computed(() =>
  categoryPurchaseOrderStore.categoriesPurchaseOrders.filter(category =>
    showActive.value
      ? !category.delete_log_category_purchase_order
      : category.delete_log_category_purchase_order
  )
);

const nameError = computed(() => {
  if (!formCategoryName.value.trim()) return 'El nombre es requerido';
  if (formCategoryName.value.length < 3) return 'Mínimo 3 caracteres';
  if (formCategoryName.value.length > 100) return 'Máximo 100 caracteres';
  return null;
});

const companyError = computed(() => {
  if (!formCompanyName.value) return 'La compañía es requerida';
  return null;
});

const isFormValid = computed(() => !nameError.value && !companyError.value);

const showActiveCategories = () => (showActive.value = true);
const showDeletedCategories = () => (showActive.value = false);

const showCreateModal = () => {
  isEdit.value = false;
  formCategoryName.value = '';
  formCompanyName.value = '';
  visibleForm.value = true;
};

const handleUpdate = (id: number) => {
  const category = categoryPurchaseOrderStore.categoriesPurchaseOrders.find(
    c => c.id_category_purchase_order === id
  );
  if (category) {
    isEdit.value = true;
    editingId.value = id;
    formCategoryName.value = category.name_category_purchase_order;
    formCompanyName.value = category.name_company;
    visibleForm.value = true;
  }
};

const handleSee = (id: number) => {
  const category = categoryPurchaseOrderStore.categoriesPurchaseOrders.find(
    c => c.id_category_purchase_order === id
  );
  if (category) {
    viewCategory.value = category;
    visibleView.value = true;
  }
};

const submitForm = async () => {
  if (!isFormValid.value) return;
  loading.value = true;
  try {
    if (isEdit.value && editingId.value !== null) {
      await categoryPurchaseOrderStore.editCategoryPurchaseOrder(editingId.value, formCategoryName.value, formCompanyName.value);
      toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Categoría actualizada', life: 3000 });
    } else {
      await categoryPurchaseOrderStore.addCategoryPurchaseOrder(formCategoryName.value, formCompanyName.value);
      toast.add({ severity: 'success', summary: 'Creado', detail: 'Categoría creada', life: 3000 });
    }
    await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders();
    visibleForm.value = false;
    editingId.value = null;
    formCategoryName.value = '';
    formCompanyName.value = '';
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Operación fallida', life: 3000 });
  } finally {
    loading.value = false;
  }
};

const removeCategoryPurchaseOrder = (id: number) => {
  confirm.require({
    message: '¿Deseas eliminar esta categoría?',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    accept: async () => {
      loading.value = true;
      await categoryPurchaseOrderStore.removeCategoryPurchaseOrder(id);
      await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders();
      toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Categoría eliminada', life: 3000 });
      loading.value = false;
    },
  });
};

const restoreDeletedCategoryPurchaseOrder = async (id: number) => {
  loading.value = true;
  await categoryPurchaseOrderStore.restoreDeletedCategoryPurchaseOrder(id);
  await categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders();
  toast.add({ severity: 'success', summary: 'Restaurado', detail: 'Categoría restaurada', life: 3000 });
  loading.value = false;
};

onMounted(() => {
  categoryPurchaseOrderStore.fetchCategoriesPurchaseOrders();
  companyStore.fetchCompanies();
});
</script>

<style scoped>
.p-invalid {
  border-color: var(--red-500) !important;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
