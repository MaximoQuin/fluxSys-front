// src/services/errorLogService.ts
import type { ErrorLog } from "@/interfaces/ErrorLog";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica

const API_URL = "https://localhost:7002/api/Errors";

// Obtener todos los errores
export async function getErrorLogs(): Promise<ErrorLog[]> {
  return genericRequest<ErrorLog[]>("get", `${API_URL}`);
}