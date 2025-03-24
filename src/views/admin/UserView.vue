<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

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

    <!-- Botón para crear usuario -->
    <button
      @click="openCreateModal"
      class="bg-green-500 text-white px-4 py-2 rounded mb-4"
    >
      Crear Usuario
    </button>

    <!-- Tabla de usuarios -->
    <table class="min-w-full bg-black">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">ID</th>
          <th class="py-2 px-4 border-b">Nombre</th>
          <th class="py-2 px-4 border-b">Email</th>
          <th class="py-2 px-4 border-b">Teléfono</th>
          <th class="py-2 px-4 border-b">Rol</th>
          <th class="py-2 px-4 border-b">Posición</th>
          <th class="py-2 px-4 border-b">Departamento</th>
          <th class="py-2 px-4 border-b">Compañía</th>
          <th class="py-2 px-4 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in filteredUsers"
          :key="user.id_user"
          class="hover:bg-gray-50"
        >
          <td class="py-2 px-4 border-b">{{ user.id_user }}</td>
          <td class="py-2 px-4 border-b">{{ user.name_user }}</td>
          <td class="py-2 px-4 border-b">{{ user.mail_user }}</td>
          <td class="py-2 px-4 border-b">{{ user.phone_user }}</td>
          <td class="py-2 px-4 border-b">{{ user.name_role }}</td>
          <td class="py-2 px-4 border-b">{{ user.name_position }}</td>
          <td class="py-2 px-4 border-b">{{ user.name_department }}</td>
          <td class="py-2 px-4 border-b">{{ user.name_company }}</td>
          <td class="py-2 px-4 border-b">
            <button
              v-if="showActive && user.id_user !== authStore.user?.id_user"
              @click="startEdit(user)"
              class="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Editar
            </button>
            <button
              v-if="showActive && user.id_user !== authStore.user?.id_user"
              @click="removeUser(user.id_user)"
              class="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Eliminar
            </button>
            <button
              v-else-if="!showActive"
              @click="restoreDeletedUser(user.id_user)"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              Restaurar
            </button>
            <span
              v-if="user.id_user === authStore.user?.id_user"
              class="text-gray-500"
            >
              (Tú)
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Cargando -->
    <div v-if="userStore.loading" class="mt-4">Cargando...</div>

    <!-- Formulario para crear/editar usuario -->
    <div v-if="isEditing || isCreating" class="mt-4">
      <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}</h2>
      <form @submit.prevent="saveEdit">
        <input
          v-model="userForm.name_user"
          placeholder="Nombre"
          class="border rounded px-4 py-2 mb-2 w-full"
          required
        />
        <input
          v-model="userForm.mail_user"
          placeholder="Email"
          class="border rounded px-4 py-2 mb-2 w-full"
          type="email"
          required
        />
        <input
          v-model="userForm.phone_user"
          placeholder="Teléfono"
          class="border rounded px-4 py-2 mb-2 w-full"
          type="number"
          required
        />
        <input
          v-model="userForm.password_user"
          placeholder="Contraseña"
          class="border rounded px-4 py-2 mb-2 w-full"
          type="password"
          :required="!isEditing"
        />
        <select
          v-model="userForm.id_rol_Id"
          class="border rounded px-4 py-2 mb-2 w-full"
          required
        >
          <option value="" disabled>Seleccione un rol</option>
          <option
            v-for="role in filteredRoles"
            :key="role.id_role"
            :value="role.id_role"
          >
            {{ role.name_role }}
          </option>
        </select>
        <select
          v-model="userForm.id_position_Id"
          class="border rounded px-4 py-2 mb-2 w-full"
          required
        >
          <option value="" disabled>Seleccione una posición</option>
          <option
            v-for="position in positionStore.positions"
            :key="position.id_position"
            :value="position.id_position"
          >
            {{ position.name_position }}
          </option>
        </select>
        <select
          v-model="userForm.id_department_Id"
          class="border rounded px-4 py-2 mb-2 w-full"
          required
        >
          <option value="" disabled>Seleccione un departamento</option>
          <option
            v-for="department in departmentStore.departments"
            :key="department.id_department"
            :value="department.id_department"
          >
            {{ department.name_deparment }}
          </option>
        </select>
        <select
          v-model="userForm.id_company_Id"
          :disabled="!isAdmin"
          class="border rounded px-4 py-2 mb-2 w-full"
          :class="{ 'bg-gray-100': !isAdmin }"
          required
        >
          <option value="" disabled>Seleccione una compañía</option>
          <option
            v-for="company in companyStore.companies"
            :key="company.id_company"
            :value="company.id_company"
          >
            {{ company.name_company }}
          </option>
        </select>
        <span v-if="!isAdmin" class="text-sm text-gray-500">
          * Solo los administradores pueden cambiar la compañía
        </span>

        <!-- Botones del formulario -->
        <div class="flex justify-end gap-2">
          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">
            {{ isEditing ? 'Guardar Cambios' : 'Crear Usuario' }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useDepartmentStore } from '@/stores/departmentStore';
import { useCompanyStore } from '@/stores/companyStore';
import { usePositionStore } from '@/stores/positionStore';
import { useAuthStore } from '@/stores/authStore';
import { getRoles } from '@/services/roleService';
import type { Role, User } from '@/interfaces/User';

// Stores
const userStore = useUserStore();
const departmentStore = useDepartmentStore();
const companyStore = useCompanyStore();
const positionStore = usePositionStore();
const authStore = useAuthStore();

// Variables reactivas
const showActive = ref(true);
const isEditing = ref(false);
const isCreating = ref(false);
const roles = ref<Role[]>([]);
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
const openCreateModal = () => {
  isCreating.value = true;
  isEditing.value = false;
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

const startEdit = (user: User) => {
  isEditing.value = true;
  isCreating.value = false;
  userForm.value = {
    id_user: user.id_user,
    name_user: user.name_user,
    mail_user: user.mail_user,
    phone_user: user.phone_user,
    password_user: '',
    id_rol_Id: roles.value.find((role) => role.name_role === user.name_role)?.id_role || null,
    id_position_Id: positionStore.positions.find(
      (pos) => pos.name_position === user.name_position
    )?.id_position || null,
    id_department_Id: departmentStore.departments.find(
      (dep) => dep.name_deparment === user.name_department
    )?.id_department || null,
    id_company_Id: isAdmin.value 
      ? companyStore.companies.find((comp) => comp.name_company === user.name_company)?.id_company || null
      : currentUserCompany.value,
  };
};

const cancelEdit = () => {
  isEditing.value = false;
  isCreating.value = false;
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

const saveEdit = async () => {
  try {
    const payload = {
      ...userForm.value,
      password_user: userForm.value.password_user || null,
    };

    if (isEditing.value) {
      await userStore.editUser(userForm.value.id_user, payload);
    } else {
      await userStore.addUser(payload);
    }
    cancelEdit();
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
  }
};

const removeUser = async (id: number) => {
  try {
    await userStore.removeUser(id);
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
  }
};

const restoreDeletedUser = async (id: number) => {
  try {
    await userStore.restoreDeletedUser(id);
  } catch (error) {
    console.error('Error al restaurar el usuario:', error);
  }
};

// Lifecycle hooks
onMounted(async () => {
  await userStore.fetchUsers();
  await departmentStore.fetchDepartments();
  await companyStore.fetchCompanies();
  await positionStore.fetchPositions();
  roles.value = await getRoles();
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>