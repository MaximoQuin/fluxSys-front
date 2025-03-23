// src/services/userService.ts
import type { User } from "@/interfaces/User";
import { genericRequest } from "@/utils/httpUtils";
import { useAuthStore } from "@/stores/authStore";

const API_URL = "https://localhost:7002/api/Users";

// Obtener todos los usuarios
export async function getUsers(): Promise<User[]> {
  return genericRequest<User[]>("get", `${API_URL}/get-users`);
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