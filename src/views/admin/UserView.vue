<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

    <!-- Filtros para mostrar activos/eliminados -->
    <div class="mb-4">
      <button
        @click="showActive = true"
        :class="{ 'bg-blue-500 text-white': showActive, 'bg-gray-200': !showActive }"
        class="px-4 py-2 rounded-l transition-colors duration-200"
      >
        Activos
      </button>
      <button
        @click="showActive = false"
        :class="{ 'bg-red-500 text-white': !showActive, 'bg-gray-200': showActive }"
        class="px-4 py-2 rounded-r transition-colors duration-200"
      >
        Eliminados
      </button>
    </div>

    <!-- Tabla de usuarios usando el componente Table -->
    <TableComponent
      :loader="userStore.loading"
      :columns="mappedColumns"
      :data="filteredUsers"
      id="id_user"
      :flagRestore="showActive"
      :currentUserId="authStore.user?.id_user"
      @actionSee="handleSee"
      @actionCreate="openCreateModal"
      @actionUpdate="startEdit"
      @actionDanger="removeUser"
      @actionRestore="restoreDeletedUser"
    />

    <!-- Modal de detalles del usuario -->
    <Dialog v-model:visible="visibleDetails" modal header="Detalles del Usuario" :style="{ width: '50rem' }">
      <div v-if="currentUser" class="grid grid-cols-1 gap-6">
        <Card>
          <template #title>
            <div class="flex items-center gap-3">
              <i class="pi pi-user text-primary" style="font-size: 1.5rem"></i>
              <span>Información del Usuario</span>
            </div>
          </template>
          <template #content>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Nombre</span>
                <span class="font-semibold text-lg">{{ currentUser.name_user }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Estado</span>
                <Tag 
                  :value="currentUser.delete_log_user ? 'Eliminado' : 'Activo'" 
                  :severity="currentUser.delete_log_user ? 'danger' : 'success'" 
                  class="text-sm"
                />
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Email</span>
                <span class="font-semibold">{{ currentUser.mail_user }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Teléfono</span>
                <span class="font-semibold">{{ currentUser.phone_user || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Rol</span>
                <span class="font-semibold">{{ currentUser.name_role }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Posición</span>
                <span class="font-semibold">{{ currentUser.name_position }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Departamento</span>
                <span class="font-semibold">{{ currentUser.name_department }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-500">Compañía</span>
                <span class="font-semibold">{{ currentUser.name_company }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </Dialog>

    <!-- Modal de editar/crear con validaciones -->
    <Dialog 
      v-model:visible="visibleForm" 
      modal 
      :header="isEditing ? 'Editar Usuario' : 'Crear Usuario'" 
      :style="{ width: '50rem' }"
    >
      <div class="grid grid-cols-2 gap-4">
        <!-- Nombre -->
        <div class="flex flex-col gap-2">
          <label for="name" class="font-semibold">Nombre:*</label>
          <InputText 
            v-model="userForm.name_user" 
            id="name" 
            autocomplete="off"
            :class="{ 'p-invalid': nameError }"
          />
          <small v-if="nameError" class="p-error">
            {{ nameError }}
          </small>
        </div>

        <!-- Email -->
        <div class="flex flex-col gap-2">
          <label for="email" class="font-semibold">Email:*</label>
          <InputText 
            v-model="userForm.mail_user" 
            id="email" 
            autocomplete="off"
            :class="{ 'p-invalid': emailError }"
          />
          <small v-if="emailError" class="p-error">
            {{ emailError }}
          </small>
        </div>

        <!-- Teléfono -->
        <div class="flex flex-col gap-2">
          <label for="phone" class="font-semibold">Teléfono:*</label>
          <InputMask
            v-model="userForm.phone_user"
            id="phone"
            mask="9999999999"
            placeholder="1234567890"
            :class="{ 'p-invalid': phoneError }"
          />
          <small v-if="phoneError" class="p-error">
            {{ phoneError }}
          </small>
        </div>

        <!-- Contraseña (visible en creación y edición) -->
        <div class="flex flex-col gap-2">
          <label for="password" class="font-semibold">
            {{ isEditing ? 'Nueva Contraseña' : 'Contraseña*' }}
          </label>
          <Password
            v-model="userForm.password_user"
            id="password"
            :feedback="false"
            toggleMask
            :class="{ 'p-invalid': passwordError && !isEditing }"
          />
          <small v-if="passwordError && !isEditing" class="p-error">
            {{ passwordError }}
          </small>
          <small v-if="isEditing" class="text-gray-500 text-xs">
            Dejar vacío para mantener la contraseña actual
          </small>
        </div>

        <!-- Rol -->
        <div class="flex flex-col gap-2">
          <label for="role" class="font-semibold">Rol:*</label>
          <Dropdown 
            v-model="userForm.id_rol_Id" 
            :options="filteredRoles" 
            optionLabel="name_role" 
            optionValue="id_role"
            placeholder="Seleccione un rol"
            :class="{ 'p-invalid': roleError }"
          />
          <small v-if="roleError" class="p-error">
            {{ roleError }}
          </small>
        </div>

        <!-- Posición -->
        <div class="flex flex-col gap-2">
          <label for="position" class="font-semibold">Posición:*</label>
          <Dropdown 
            v-model="userForm.id_position_Id" 
            :options="positionStore.positions" 
            optionLabel="name_position" 
            optionValue="id_position"
            placeholder="Seleccione una posición"
            :class="{ 'p-invalid': positionError }"
          />
          <small v-if="positionError" class="p-error">
            {{ positionError }}
          </small>
        </div>

        <!-- Departamento -->
        <div class="flex flex-col gap-2">
          <label for="department" class="font-semibold">Departamento:*</label>
          <Dropdown 
            v-model="userForm.id_department_Id" 
            :options="departmentStore.departments" 
            optionLabel="name_deparment" 
            optionValue="id_department"
            placeholder="Seleccione un departamento"
            :class="{ 'p-invalid': departmentError }"
          />
          <small v-if="departmentError" class="p-error">
            {{ departmentError }}
          </small>
        </div>

        <!-- Compañía -->
        <div class="flex flex-col gap-2">
          <label for="company" class="font-semibold">Compañía:*</label>
          <Dropdown 
            v-model="userForm.id_company_Id" 
            :options="companyStore.companies" 
            optionLabel="name_company" 
            optionValue="id_company"
            placeholder="Seleccione una compañía"
            :class="{ 'p-invalid': companyError }"
            :disabled="!isAdmin"
          />
          <small v-if="companyError" class="p-error">
            {{ companyError }}
          </small>
          <small v-if="!isAdmin" class="text-sm text-gray-500">
            * Solo los administradores pueden cambiar la compañía
          </small>
        </div>
      </div>
      
      <div class="flex justify-end gap-2 mt-4">
        <Button 
          type="button" 
          label="Cancelar" 
          severity="secondary" 
          outlined
          @click="cancelEdit"
        />
        <Button 
          type="button" 
          label="Guardar" 
          severity="primary"
          :disabled="!isFormValid"
          @click="saveEdit"
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
import { useUserStore } from '@/stores/userStore';
import { useDepartmentStore } from '@/stores/departmentStore';
import { useCompanyStore } from '@/stores/companyStore';
import { usePositionStore } from '@/stores/positionStore';
import { useAuthStore } from '@/stores/authStore';
import { getRoles } from '@/services/roleService';
import type { Role } from '@/interfaces/User';
import TableComponent from '@/components/TableComponent.vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Card from 'primevue/card';
import Tag from 'primevue/tag';

const confirm = useConfirm();
const toast = useToast();

// Stores
const userStore = useUserStore();
const departmentStore = useDepartmentStore();
const companyStore = useCompanyStore();
const positionStore = usePositionStore();
const authStore = useAuthStore();

// Estados
const showActive = ref(true);
const visibleDetails = ref(false);
const visibleForm = ref(false);
const isEditing = ref(false);
const loadingSubmit = ref(false);
const currentUser = ref<any>(null);
const roles = ref<Role[]>([]);

// Columnas para la tabla
const mappedColumns = [
  { field: 'name_user', header: 'Nombre', sortable: true },
  { field: 'mail_user', header: 'Email', sortable: true },
  { field: 'phone_user', header: 'Teléfono', sortable: true },
  { field: 'name_role', header: 'Rol', sortable: true },
  { field: 'name_position', header: 'Posición', sortable: true },
  { field: 'name_department', header: 'Departamento', sortable: true },
  { field: 'name_company', header: 'Compañía', sortable: true }
];

// Formulario para crear/editar
const userForm = ref({
  id_user: null as number | null,
  name_user: '',
  mail_user: '',
  phone_user: null as number | null,
  password_user: '',
  id_rol_Id: null as number | null,
  id_position_Id: null as number | null,
  id_department_Id: null as number | null,
  id_company_Id: null as number | null,
});

// Validaciones reactivas basadas en UserViewModel
const nameError = computed(() => {
  const name = userForm.value.name_user || '';
  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  
  if (!name.trim()) return 'El nombre es requerido';
  if (name.length < 3) return 'Mínimo 3 caracteres';
  if (name.length > 50) return 'Máximo 50 caracteres';
  if (specialCharsRegex.test(name)) return 'No se permiten caracteres especiales';
  
  return null;
});

const emailError = computed(() => {
  const email = userForm.value.mail_user || '';
  
  if (!email.trim()) return 'El email es requerido';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Formato de email inválido';
  
  return null;
});

const phoneError = computed(() => {
  const phone = userForm.value.phone_user?.toString() || '';
  
  if (!phone) return 'El teléfono es requerido';
  if (!/^\d{10}$/.test(phone)) return 'Debe tener 10 dígitos';
  
  return null;
});

const passwordError = computed(() => {
  if (isEditing.value) return null; // No requerido para edición
  
  const password = userForm.value.password_user || '';
  if (!password) return 'La contraseña es requerida';
  if (password.length < 8) return 'Mínimo 8 caracteres';
  if (password.length > 50) return 'Máximo 50 caracteres';
  return null;
});

const roleError = computed(() => {
  if (userForm.value.id_rol_Id === null) return 'El rol es requerido';
  return null;
});

const positionError = computed(() => {
  if (userForm.value.id_position_Id === null) return 'La posición es requerida';
  return null;
});

const departmentError = computed(() => {
  if (userForm.value.id_department_Id === null) return 'El departamento es requerido';
  return null;
});

const companyError = computed(() => {
  if (userForm.value.id_company_Id === null) return 'La compañía es requerida';
  return null;
});

const isFormValid = computed(() => {
  return !nameError.value && !emailError.value && !phoneError.value && 
         (!isEditing.value ? !passwordError.value : true) && 
         !roleError.value && !positionError.value && 
         !departmentError.value && !companyError.value;
});

// Computed properties
const isAdmin = computed(() => {
  return authStore.user?.role?.name_role === 'Administrador';
});

const currentUserCompany = computed(() => {
  return authStore.user?.company?.id_company;
});

const filteredRoles = computed(() => {
  if (isAdmin.value) {
    return roles.value;
  }
  return roles.value.filter(role => role.name_role !== 'Administrador');
});

const filteredUsers = computed(() => {
  return userStore.users.filter((user) =>
    showActive.value ? !user.delete_log_user : user.delete_log_user
  );
});

// Métodos
const handleSee = async (id: number) => {
  currentUser.value = filteredUsers.value.find(u => u.id_user === id);
  if (currentUser.value) {
    visibleDetails.value = true;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  visibleForm.value = true;
  userForm.value = {
    id_user: null,
    name_user: '',
    mail_user: '',
    phone_user: null,
    password_user: '',
    id_rol_Id: null,
    id_position_Id: null,
    id_department_Id: null,
    id_company_Id: isAdmin.value ? null : currentUserCompany.value,
  };
};

const startEdit = (id: number) => {
  const user = userStore.users.find(u => u.id_user === id);
  if (user) {
    isEditing.value = true;
    visibleForm.value = true;
    
    const role = roles.value.find(r => r.name_role === user.name_role);
    const position = positionStore.positions.find(p => p.name_position === user.name_position);
    const department = departmentStore.departments.find(d => d.name_deparment === user.name_department);
    const company = companyStore.companies.find(c => c.name_company === user.name_company);

    userForm.value = {
      id_user: user.id_user,
      name_user: user.name_user,
      mail_user: user.mail_user,
      phone_user: user.phone_user,
      password_user: '',
      id_rol_Id: role?.id_role || null,
      id_position_Id: position?.id_position || null,
      id_department_Id: department?.id_department || null,
      id_company_Id: company?.id_company || null,
    };
  }
};

const saveEdit = async () => {
  if (!isFormValid.value) return;
  
  loadingSubmit.value = true;
  try {
    const payload = {
      ...userForm.value,
      password_user: isEditing.value && !userForm.value.password_user 
        ? null 
        : userForm.value.password_user,
    };

    if (isEditing.value && userForm.value.id_user) {
      await userStore.editUser(userForm.value.id_user, payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Usuario actualizado correctamente', 
        life: 3000 
      });
    } else {
      await userStore.addUser(payload);
      toast.add({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: 'Usuario creado correctamente', 
        life: 3000 
      });
    }
    
    cancelEdit();
    await userStore.fetchUsers();
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al guardar el usuario', 
      life: 3000 
    });
  } finally {
    loadingSubmit.value = false;
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  visibleForm.value = false;
  userForm.value = {
    id_user: null,
    name_user: '',
    mail_user: '',
    phone_user: null,
    password_user: '',
    id_rol_Id: null,
    id_position_Id: null,
    id_department_Id: null,
    id_company_Id: null,
  };
};

const removeUser = async (id: number) => {
  confirm.require({
    message: '¿Estás seguro de eliminar este usuario?',
    header: 'Confirmación',
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
    accept: async () => {
      try {
        await userStore.removeUser(id);
        await userStore.fetchUsers();
        toast.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Usuario eliminado correctamente', 
          life: 3000 
        });
      } catch (error) {
        toast.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al eliminar el usuario', 
          life: 3000 
        });
      }
    },
    reject: () => {}
  });
};

const restoreDeletedUser = async (id: number) => {
  try {
    await userStore.restoreDeletedUser(id);
    await userStore.fetchUsers();
    toast.add({ 
      severity: 'success', 
      summary: 'Éxito', 
      detail: 'Usuario restaurado correctamente', 
      life: 3000 
    });
  } catch (error) {
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Error al restaurar el usuario', 
      life: 3000 
    });
  }
};

// Cargar datos iniciales
onMounted(async () => {
  await userStore.fetchUsers();
  await departmentStore.fetchDepartments();
  await companyStore.fetchCompanies();
  await positionStore.fetchPositions();
  roles.value = await getRoles();
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

/* Estilos para campos inválidos */
.p-invalid {
  border-color: var(--red-500) !important;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>