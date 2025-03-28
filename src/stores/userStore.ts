// src/stores/userStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { User } from "@/interfaces/User";
import { getUsers, createUser, updateUser, deleteUser, restoreUser, getUsersByCompany } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";

export const useUserStore = defineStore("user", () => {
  const authStore = useAuthStore();
  const users = ref<User[]>([]);
  const companyUsers = ref<User[]>([]);
  const loading = ref<boolean>(false);

  // Obtener todos los usuarios
  const fetchUsers = async () => {
    loading.value = true;
    try {
      users.value = await getUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      loading.value = false;
    }
  };

  // En tu userStore.ts
const fetchUsersByCompany = async (companyId: number) => {
  loading.value = true;
  try {
    const response = await getUsersByCompany(companyId); // Esta es la función del servicio
    if (Array.isArray(response)) {
      companyUsers.value = response;
    } else {
      throw new Error('Formato de respuesta inesperado');
    }
  } catch (error) {
    console.error("Error fetching users by company:", error);
    throw error;
  } finally {
    loading.value = false;
  }
};


  // Crear un nuevo usuario
  const addUser = async (data: any) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    await createUser(data, nameUser, nameDepartment);
    await fetchUsers(); // Refrescar la lista
  };

  // Actualizar un usuario
  const editUser = async (id: number, data: any) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    await updateUser(id, data, nameUser, nameDepartment);
    await fetchUsers(); // Refrescar la lista
  };

  // Eliminar un usuario
  const removeUser = async (id: number) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    await deleteUser(id, nameUser, nameDepartment);
    await fetchUsers(); // Refrescar la lista
  };

  // Restaurar un usuario
  const restoreDeletedUser = async (id: number) => {
    const nameUser = authStore.user?.name_user || "";
    const nameDepartment = authStore.user?.department?.name_department || "";
    await restoreUser(id, nameUser, nameDepartment);
    await fetchUsers(); // Refrescar la lista
  };

  return {
    users,
    loading,
    fetchUsers,
    fetchUsersByCompany,
    companyUsers,
    addUser,
    editUser,
    removeUser,
    restoreDeletedUser,
  };
});