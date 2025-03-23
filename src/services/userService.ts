// src/services/userService.ts
import type { User } from "@/interfaces/User";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica
import { useAuthStore } from "@/stores/authStore"; // Importa el store de autenticación

const API_URL = "https://localhost:7002/api/Users";

// Obtener todos los usuarios o usuarios por compañía si no es Administrador
export async function getUsers(): Promise<User[]> {
  const authStore = useAuthStore();
  const user = authStore.user;

  if (!user) {
    throw new Error("No se pudo obtener la información del usuario.");
  }

  // Si el usuario es Administrador, usa el endpoint que trae todos los usuarios
  if (user.role.name_role === "Administrador") {
    return genericRequest<User[]>("get", `${API_URL}/get-users`);
  } else {
    // Si no es Administrador, usa el endpoint que trae los usuarios por compañía
    return genericRequest<User[]>("get", `${API_URL}/get-users-by-company/${user.company.id_company}`);
  }
}

// Crear un nuevo usuario
export async function createUser(data: any, nameUser: string, nameDepartment: string): Promise<User> {
  return genericRequest<User>("post", `${API_URL}/create-user?nameUser=${nameUser}&nameDepartment=${nameDepartment}`, data);
}

// Actualizar un usuario
export async function updateUser(id: number, data: any, nameUser: string, nameDepartment: string): Promise<User> {
  return genericRequest<User>("put", `${API_URL}/update-user/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`, data);
}

// Eliminar un usuario (eliminación lógica)
export async function deleteUser(id: number, nameUser: string, nameDepartment: string): Promise<void> {
  return genericRequest<void>("delete", `${API_URL}/delete-user/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`);
}

// Restaurar un usuario
export async function restoreUser(id: number, nameUser: string, nameDepartment: string): Promise<void> {
  return genericRequest<void>("patch", `${API_URL}/restore-user/${id}?nameUser=${nameUser}&nameDepartment=${nameDepartment}`);
}