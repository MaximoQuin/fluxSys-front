<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Categorías de Proveedores</h1>

    <!-- Filtros -->
    <div class="flex mb-6">
      <button
        @click="setActive(true)"
        :class="showActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-l shadow-md hover:bg-blue-700 hover:text-white active:bg-blue-800 transiton-colors"
      >
        Activas
      </button>
      <button
        @click="setActive(false)"
        :class="!showActive ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-r shadow-md hover:bg-red-600 hover:text-white active:bg-red-800 transition-colors"
      >
        Eliminadas
      </button>
    </div>

    <!-- Tabla -->
    <TableComponent class="h-118"
      :loader="categorySupplierStore.loading"
      :columns="columns"
      :data="filteredCategories"
      id="id_category_supplier"
      :flagRestore="showActive"
      :currentUserId="0"
      @actionSee="handleSee"
      @actionCreate="handleCreate"
      @actionUpdate="handleUpdate"
      @actionDanger="handleRemove"
      @actionRestore="handleRestore"
    ></TableComponent>

    <!-- Modal Detalles -->
    <Dialog v-model:visible="visibleDetails" modal header="Detalles de Categoría" :style="{ width: '30rem' }">
      <div class="flex flex-col gap-4">
        <div><strong>Nombre:</strong> {{ currentCategory?.name_category_supplier }}</div>
        <div><strong>Compañía:</strong> {{ currentCategory?.name_company }}</div>
      </div>
    </Dialog>

    <!-- Modal Crear/Editar -->
    <Dialog v-model:visible="visibleForm" modal :header="isEdit ? 'Editar Categoría' : 'Crear Categoría'"
      :style="{ width: '30rem' }">
      <div class="flex flex-col gap-3">
        <label class="font-semibold">Nombre de la categoría *</label>
        <InputText v-model="formCategoryName" :class="{ 'p-invalid': nameError }"
          placeholder="Ingrese el nombre de la categoría"></InputText>
        <small v-if="nameError" class="p-error">{{ nameError }}</small>

        <!-- Selector de compañía solo para administradores -->
        <template v-if="authStore.isAdmin">
          <label class="font-semibold">Compañía *</label>
          <Dropdown v-model="formCompanyId" :options="companyOptions" optionLabel="name_company"
            optionValue="id_company" placeholder="Seleccione una compañía" :class="{ 'p-invalid': companyError }">
          </Dropdown>
          <small v-if="companyError" class="p-error">{{ companyError }}</small>
        </template>

        <div class="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" severity="danger" @click="visibleForm = false"></Button>
          <Button label="Guardar" severity="info" :disabled="!isFormValid" @click="submitForm"></Button>
        </div>
      </div>
    </Dialog>

    <!-- Confirmación -->
    <ConfirmDialog></ConfirmDialog>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import TableComponent from '@/components/TableComponent.vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import { useCategorySupplierStore } from '@/stores/categorySupplierStore';
import { useAuthStore } from '@/stores/authStore';
import { useCompanyStore } from '@/stores/companyStore';

const toast = useToast();
const confirm = useConfirm();

const categorySupplierStore = useCategorySupplierStore();
const authStore = useAuthStore();
const companyStore = useCompanyStore();

const showActive = ref(true);
const visibleDetails = ref(false);
const visibleForm = ref(false);
const isEdit = ref(false);
const editingId = ref<number | null>(null);
const currentCategory = ref<any>(null);

const formCategoryName = ref('');
const formCompanyId = ref<number | null>(null);

// Validación
const nameError = computed(() => {
  const name = formCategoryName.value.trim();

  if (!name) return 'El nombre es obligatorio';

  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(name)) {
    return 'No se permiten caracteres especiales';
  }

  if (name.length < 3) return 'Mínimo 3 caracteres';
  if (name.length > 50) return 'Máximo 50 caracteres';

  return null;
});

const companyError = computed(() => {
  return authStore.isAdmin && formCompanyId.value === null ? 'La compañía es obligatoria' : null;
});

const isFormValid = computed(() => {
  return !nameError.value && (!authStore.isAdmin || !companyError.value);
});

const columns = [
  { field: 'name_category_supplier', header: 'Nombre' },
  { field: 'name_company', header: 'Compañía' }
];

const filteredCategories = computed(() =>
  categorySupplierStore.categoriesSuppliers.filter(c =>
    showActive.value ? !c.delete_log_category_supplier : c.delete_log_category_supplier
  )
);

const companyOptions = computed(() => companyStore.companies);

onMounted(() => {
  categorySupplierStore.fetchCategoriesSuppliers();
  companyStore.fetchCompanies();
});

const setActive = (val: boolean) => (showActive.value = val);

const handleSee = (id: number) => {
  currentCategory.value = categorySupplierStore.categoriesSuppliers.find(c => c.id_category_supplier === id);
  visibleDetails.value = true;
};

const handleCreate = () => {
  isEdit.value = false;
  editingId.value = null;
  formCategoryName.value = '';

  // Si no es admin, asignar automáticamente la compañía del usuario
  if (!authStore.isAdmin) {
    formCompanyId.value = authStore.user?.company?.id_company || null;
  } else {
    formCompanyId.value = null;
  }

  visibleForm.value = true;
};

const handleUpdate = (id: number) => {
  const cat = categorySupplierStore.categoriesSuppliers.find(c => c.id_category_supplier === id);
  if (cat) {
    isEdit.value = true;
    editingId.value = id;
    formCategoryName.value = cat.name_category_supplier;
    formCompanyId.value = cat.id_company || null;
    visibleForm.value = true;
  }
};

const submitForm = async () => {
  if (!isFormValid.value) return;

  try {
    // Para usuarios no admin, asegurar que siempre use su compañía
    const companyIdToUse = authStore.isAdmin ? formCompanyId.value : authStore.user?.company?.id_company;

    if (isEdit.value && editingId.value !== null) {
      await categorySupplierStore.editCategorySupplier(
        editingId.value,
        formCategoryName.value.trim(),
        companyIdToUse
      );
      toast.add({
        severity: 'success',
        summary: 'Actualizado',
        detail: 'Categoría actualizada correctamente',
        life: 3000
      });
    } else {
      await categorySupplierStore.addCategorySupplier(
        formCategoryName.value.trim(),
        companyIdToUse
      );
      toast.add({
        severity: 'success',
        summary: 'Creado',
        detail: 'Categoría creada correctamente',
        life: 3000
      });
    }

    await categorySupplierStore.fetchCategoriesSuppliers();
    visibleForm.value = false;
    editingId.value = null;
    formCategoryName.value = '';
    formCompanyId.value = null;
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Operación fallida',
      life: 3000
    });
  }
};

const handleRemove = (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar esta categoría?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    rejectProps: {
      label: 'Cancelar',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Eliminar',
      severity: 'danger'
    },
    accept: () => {
      categorySupplierStore.removeCategorySupplier(id)
        .then(() => {
          categorySupplierStore.fetchCategoriesSuppliers();
          toast.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Categoría eliminada correctamente',
            life: 3000
          });
        })
        .catch(() => {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar la categoría',
            life: 3000
          });
        });
    }
  });
};

const handleRestore = (id: number) => {
  categorySupplierStore.restoreDeletedCategorySupplier(id)
    .then(() => {
      categorySupplierStore.fetchCategoriesSuppliers();
      toast.add({
        severity: 'success',
        summary: 'Restaurado',
        detail: 'Categoría restaurada correctamente',
        life: 3000
      });
    })
    .catch(() => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo restaurar la categoría',
        life: 3000
      });
    });
};
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
