<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Gestión de Tipos de Movimiento</h1>
  
      <!-- Filtros -->
      <div class="flex mb-6">
        <button
          @click="setActive(true)"
          :class="showActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-l shadow-md hover:bg-blue-700 hover:text-white active:bg-blue-800 transiton-colors"
        >
          Activos
        </button>
        <button
          @click="setActive(false)"
          :class="!showActive ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'"
        class="px-4 py-2 rounded-r shadow-md hover:bg-red-600 hover:text-white active:bg-red-800 transition-colors"
        >
          Eliminados
        </button>
      </div>
  
      <!-- Tabla -->
      <TableComponent
        :loader="movementTypeStore.loading"
        :columns="columns"
        :data="filteredMovements"
        id="id_movement_type"
        :flagRestore="showActive"
        :currentUserId="0"
        @actionSee="handleSee"
        @actionCreate="handleCreate"
        @actionUpdate="handleUpdate"
        @actionDanger="handleRemove"
        @actionRestore="handleRestore"
      ></TableComponent>
  
      <!-- Modal Detalles -->
      <Dialog v-model:visible="visibleDetails" modal header="Detalles del Tipo de Movimiento" :style="{ width: '30rem' }">
        <div class="flex flex-col gap-4">
          <div><strong>Nombre:</strong> {{ currentMovement?.name_movement_type }}</div>
          <div><strong>Compañía:</strong> {{ currentMovement?.name_company }}</div>
          <div><strong>Clasificación:</strong> {{ currentMovement?.name_clasification_movement }}</div>
        </div>
      </Dialog>
  
      <!-- Modal Crear/Editar -->
      <Dialog v-model:visible="visibleForm" modal :header="isEdit ? 'Editar Tipo de Movimiento' : 'Crear Tipo de Movimiento'" :style="{ width: '30rem' }">
        <div class="flex flex-col gap-3">
          <label class="font-semibold">Nombre del tipo *</label>
          <InputText 
            v-model="formMovementName" 
            :class="{ 'p-invalid': nameError }"
            placeholder="Ingrese el nombre del tipo de movimiento"
          ></InputText>
          <small v-if="nameError" class="p-error">{{ nameError }}</small>
  
          <label class="font-semibold">Clasificación *</label>
          <Dropdown
            v-model="formClasificationId"
            :options="movementTypeStore.clasificationMovements"
            optionLabel="name_clasification_movement"
            optionValue="id_clasification_movement"
            placeholder="Seleccione una clasificación"
            :class="{ 'p-invalid': clasificationError }"
          ></Dropdown>
          <small v-if="clasificationError" class="p-error">{{ clasificationError }}</small>
  
          <!-- Selector de compañía solo para administradores -->
          <template v-if="authStore.isAdmin">
            <label class="font-semibold">Compañía *</label>
            <Dropdown
              v-model="formCompanyId"
              :options="companyOptions"
              optionLabel="name_company"
              optionValue="id_company"
              placeholder="Seleccione una compañía"
              :class="{ 'p-invalid': companyError }"
            ></Dropdown>
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
  
  import { useMovementTypeStore } from '@/stores/movementTypeStore';
  import { useAuthStore } from '@/stores/authStore';
  import { useCompanyStore } from '@/stores/companyStore';
  
  const toast = useToast();
  const confirm = useConfirm();
  
  const movementTypeStore = useMovementTypeStore();
  const authStore = useAuthStore();
  const companyStore = useCompanyStore();
  
  const showActive = ref(true);
  const visibleDetails = ref(false);
  const visibleForm = ref(false);
  const isEdit = ref(false);
  const editingId = ref<number | null>(null);
  const currentMovement = ref<any>(null);
  
  const formMovementName = ref('');
  const formClasificationId = ref<number | null>(null);
  const formCompanyId = ref<number | null>(null);
  
  // Validaciones
  const nameError = computed(() => {
    const name = formMovementName.value.trim();
    
    if (!name) return 'El nombre es obligatorio';
    
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialCharsRegex.test(name)) {
      return 'No se permiten caracteres especiales';
    }
    
    const validCharsRegex = /^[a-zA-Z\s]+$/;
    if (!validCharsRegex.test(name)) {
      return 'Solo se permiten letras y espacios';
    }
    
    if (name.length < 3) return 'Mínimo 3 caracteres';
    if (name.length > 50) return 'Máximo 50 caracteres';
    
    return null;
  });
  
  const clasificationError = computed(() => {
    return formClasificationId.value === null ? 'La clasificación es obligatoria' : null;
  });
  
  const companyError = computed(() => {
    return authStore.isAdmin && formCompanyId.value === null ? 'La compañía es obligatoria' : null;
  });
  
  const isFormValid = computed(() => {
    return !nameError.value && !clasificationError.value && (!authStore.isAdmin || !companyError.value);
  });
  
  const columns = [
    { field: 'name_movement_type', header: 'Nombre' },
    { field: 'name_company', header: 'Compañía' },
    { field: 'name_clasification_movement', header: 'Clasificación' }
  ];
  
  const filteredMovements = computed(() =>
    movementTypeStore.movementsTypes.filter(m =>
      showActive.value ? !m.delete_log_movement_type : m.delete_log_movement_type
    )
  );
  
  const companyOptions = computed(() => companyStore.companies);
  
  onMounted(() => {
    movementTypeStore.fetchMovementsTypes();
    movementTypeStore.fetchClasificationMovements();
    companyStore.fetchCompanies();
  });
  
  const setActive = (val: boolean) => (showActive.value = val);
  
  const handleSee = (id: number) => {
    currentMovement.value = movementTypeStore.movementsTypes.find(m => m.id_movement_type === id);
    visibleDetails.value = true;
  };
  
  const handleCreate = () => {
    isEdit.value = false;
    editingId.value = null;
    formMovementName.value = '';
    formClasificationId.value = null;
    
    if (!authStore.isAdmin) {
      formCompanyId.value = authStore.user?.company?.id_company || null;
    } else {
      formCompanyId.value = null;
    }
    
    visibleForm.value = true;
  };
  
  const handleUpdate = (id: number) => {
    const movement = movementTypeStore.movementsTypes.find(m => m.id_movement_type === id);
    if (movement) {
      isEdit.value = true;
      editingId.value = id;
      formMovementName.value = movement.name_movement_type;
      
      // Asignar correctamente la clasificación actual
      const currentClasification = movementTypeStore.clasificationMovements.find(
        c => c.name_clasification_movement === movement.name_clasification_movement
      );
      formClasificationId.value = currentClasification?.id_clasification_movement || null;
      
      // Asignar correctamente la compañía actual
      if (!authStore.isAdmin) {
        formCompanyId.value = authStore.user?.company?.id_company || null;
      } else {
        const currentCompany = companyStore.companies.find(
          c => c.name_company === movement.name_company
        );
        formCompanyId.value = currentCompany?.id_company || null;
      }
      
      visibleForm.value = true;
    }
  };
  
  const submitForm = async () => {
    if (!isFormValid.value) return;
  
    try {
      const companyIdToUse = authStore.isAdmin ? formCompanyId.value : authStore.user?.company?.id_company;
      
      if (isEdit.value && editingId.value !== null) {
        await movementTypeStore.editMovementType(
          editingId.value, 
          formMovementName.value.trim(),
          formClasificationId.value,
          companyIdToUse
        );
        toast.add({ 
          severity: 'success', 
          summary: 'Actualizado', 
          detail: 'Tipo de movimiento actualizado correctamente', 
          life: 3000 
        });
      } else {
        await movementTypeStore.addMovementType(
          formMovementName.value.trim(),
          formClasificationId.value,
          companyIdToUse
        );
        toast.add({ 
          severity: 'success', 
          summary: 'Creado', 
          detail: 'Tipo de movimiento creado correctamente', 
          life: 3000 
        });
      }
      
      await movementTypeStore.fetchMovementsTypes();
      visibleForm.value = false;
      editingId.value = null;
      formMovementName.value = '';
      formClasificationId.value = null;
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
      message: '¿Estás seguro de eliminar este tipo de movimiento?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        movementTypeStore.removeMovementType(id)
          .then(() => {
            movementTypeStore.fetchMovementsTypes();
            toast.add({ 
              severity: 'success', 
              summary: 'Eliminado', 
              detail: 'Tipo de movimiento eliminado correctamente', 
              life: 3000 
            });
          })
          .catch(() => {
            toast.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'No se pudo eliminar el tipo de movimiento', 
              life: 3000 
            });
          });
      }
    });
  };
  
  const handleRestore = (id: number) => {
    movementTypeStore.restoreDeletedMovementType(id)
      .then(() => {
        movementTypeStore.fetchMovementsTypes();
        toast.add({ 
          severity: 'success', 
          summary: 'Restaurado', 
          detail: 'Tipo de movimiento restaurado correctamente', 
          life: 3000 
        });
      })
      .catch(() => {
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'No se pudo restaurar el tipo de movimiento', 
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