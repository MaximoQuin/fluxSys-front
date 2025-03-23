// src/services/roleService.ts
import type { Role } from "@/interfaces/Role";
import { genericRequest } from "@/utils/httpUtils";

const API_URL = "https://localhost:7002/api/Roles";

// Obtener todos los roles
export async function getRoles(): Promise<Role[]> {
  return genericRequest<Role[]>("get", `${API_URL}/get-roles`);
}