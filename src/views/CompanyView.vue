<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Empresas</h1>

    <!-- Filtros mejorados -->
    <div class="mb-4">
      <button
        @click="showActiveCompanies"
        :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200 text-gray-800': !showActive }"
        class="px-4 py-2 rounded-l shadow-md transition-colors hover:bg-blue-700 hover:text-white active:bg-blue-800"
      >
        Activas
      </button>
      <button
        @click="showDeletedCompanies"
        :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200 text-gray-800': showActive }"
        class="px-4 py-2 rounded-r shadow-md transition-colors hover:bg-red-600 hover:text-white active:bg-red-800"
      >
        Eliminadas
      </button>
    </div>

    <!-- Tabla de empresas -->
    <TableComponent 
      :loader="companyStore.loading" 
      :columns="mappedColumns" 
      :data="filteredCompanies" 
      id="id_company"
      :flagRestore="showActive" 
      @actionSee="handleSee" 
      @actionCreate="handleCreate" 
      @actionUpdate="handleUpdate"
      @actionDanger="handleRemove" 
      @actionRestore="restoreDeletedCompany" 
      :currentUserCompany="currentUserCompany"
    />

    <!-- Modal de detalles mejorado -->
    <Dialog v-model:visible="visibleDetails" modal header="Detalles de la Compañía" :style="{ width: '50rem' }">
      <div v-if="currentCompany" class="grid grid-cols-1 gap-6">
        <Card>
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-building text-primary" style="font-size: 1.5rem"></i>
              <span>Información de la Compañía</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Nombre</span>
                <span class="font-semibold text-lg">{{ currentCompany.name_company }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Estado</span>
                <Tag 
                  :value="currentCompany.delete_log_company ? 'Eliminada' : 'Activa'" 
                  :severity="currentCompany.delete_log_company ? 'danger' : 'success'" 
                  class="text-sm"
                />
              </div>
            </div>
          </template>
        </Card>

        
      </div>
    </Dialog>

    <!-- Modal de formulario con validaciones -->
    <Dialog v-model:visible="visibleForm" modal :header="isEdit ? 'Editar Compañía' : 'Crear Compañía'" :style="{ width: '40rem' }">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label for="companyName" class="font-semibold">Nombre de la compañía*</label>
          <InputText
            v-model="formCompany.name_company"
            id="companyName"
            autocomplete="off"
            :class="{ 'p-invalid': nameError }"
            @keypress="preventInvalidChars"
            placeholder="Ingrese el nombre (solo letras y espacios)"
          />
          <small v-if="nameError" class="p-error">
            {{ nameError }}
          </small>
          <small v-else class="text-gray-500 text-xs">
            Requerido (3-50 caracteres, solo letras y espacios)
          </small>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button 
          type="button" 
          label="Cancelar" 
          severity="secondary" 
          outlined
          @click="closeForm"
        />
        <Button 
          type="button" 
          label="Guardar" 
          severity="primary"
          :disabled="!isFormValid"
          @click="submitForm"
          :loading="loadingSubmit"
        />
      </div>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCompanyStore } from '@/stores/companyStore';
import { useAuthStore } from '@/stores/authStore';
import TableComponent from '@/components/TableComponent.vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();

// Stores
const companyStore = useCompanyStore();
const authStore = useAuthStore();

// Estados
const showActive = ref(true);
const visibleDetails = ref(false);
const visibleForm = ref(false);
const isEdit = ref(false);
const currentCompany = ref<any>(null);
const editingId = ref<number | null>(null);
const loadingSubmit = ref(false);

// Formulario
const formCompany = ref({
  name_company: '',
});

// Columnas para la tabla
const mappedColumns = [
  { field: 'name_company', header: 'Nombre', sortable: true }
];

// Validaciones según CompanyViewModel
const nameError = computed(() => {
  const name = formCompany.value.name_company || '';
  
  if (!name.trim()) return 'El nombre es requerido';
  if (name.length < 3) return 'Mínimo 3 caracteres';
  if (name.length > 50) return 'Máximo 50 caracteres';
  
  // Validación de patrón: solo letras y espacios
  const validPattern = /^[a-zA-Z\s]+$/;
  if (!validPattern.test(name)) {
    return 'Solo se permiten letras y espacios';
  }
  
  return null;
});

const isFormValid = computed(() => {
  return !nameError.value && formCompany.value.name_company.trim().length > 0;
});

// Prevenir caracteres no válidos al escribir
const preventInvalidChars = (e: KeyboardEvent) => {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];
  if (allowedKeys.includes(e.key)) return;
  
  const validChar = /^[a-zA-Z]$/;
  if (!validChar.test(e.key)) {
    e.preventDefault();
  }
};

// Formatear fecha
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Métodos de la vista
const filteredCompanies = computed(() => {
  return companyStore.companies.filter(company =>
    showActive.value ? !company.delete_log_company : company.delete_log_company
  );
});

const showActiveCompanies = () => showActive.value = true;
const showDeletedCompanies = () => showActive.value = false;

const handleSee = async (id: number) => {
  currentCompany.value = filteredCompanies.value.find(c => c.id_company === id);
  if (currentCompany.value) {
    visibleDetails.value = true;
  }
};

const handleCreate = () => {
  isEdit.value = false;
  formCompany.value = { name_company: '' };
  visibleForm.value = true;
};

const handleUpdate = (id: number) => {
  const company = filteredCompanies.value.find(c => c.id_company === id);
  if (company) {
    isEdit.value = true;
    editingId.value = id;
    formCompany.value = { name_company: company.name_company };
    visibleForm.value = true;
  }
};

const closeForm = () => {
  visibleForm.value = false;
  formCompany.value = { name_company: '' };
};

const submitForm = async () => {
  if (!isFormValid.value) return;
  
  loadingSubmit.value = true;
  try {
    if (isEdit.value && editingId.value) {
      await companyStore.editCompany(editingId.value, formCompany.value.name_company);
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Compañía actualizada correctamente',
        life: 3000
      });
    } else {
      await companyStore.addCompany(formCompany.value.name_company);
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Compañía creada correctamente',
        life: 3000
      });
    }
    await companyStore.fetchCompanies();
    visibleForm.value = false;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error al guardar',
      life: 3000
    });
  } finally {
    loadingSubmit.value = false;
  }
};

const handleRemove = (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar esta compañía?',
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    accept: async () => {
      try {
        await companyStore.removeCompany(id);
        await companyStore.fetchCompanies();
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Compañía eliminada correctamente',
          life: 3000
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la compañía',
          life: 3000
        });
      }
    }
  });
};

const restoreDeletedCompany = async (id: number) => {
  try {
    await companyStore.restoreDeletedCompany(id);
    await companyStore.fetchCompanies();
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Compañía restaurada correctamente',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al restaurar la compañía',
      life: 3000
    });
  }
};

onMounted(() => {
  companyStore.fetchCompanies();
});
</script>

<style scoped>
.p-card {
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.p-card-title {
  font-size: 1.1rem;
  color: var(--primary-color);
}

.p-accordion-content {
  padding: 1rem !important;
}
</style>