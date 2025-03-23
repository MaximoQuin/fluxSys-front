// src/services/auditService.ts
import type { Audit } from "@/interfaces/Audit";
import { genericRequest } from "@/utils/httpUtils"; // Importa la función genérica

const API_URL = "https://localhost:7002/api/Audits";

// Obtener todas las auditorías
export async function getAudits(): Promise<Audit[]> {
  return genericRequest<Audit[]>("get", `${API_URL}/get-audits`);
}