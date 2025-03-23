// src/stores/auditStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Audit } from "@/interfaces/Audit";
import { getAudits } from "@/services/auditService";

export const useAuditStore = defineStore("audit", () => {
  const audits = ref<Audit[]>([]);
  const loading = ref<boolean>(false);

  // Obtener todas las auditorías
  const fetchAudits = async () => {
    loading.value = true;
    try {
      audits.value = await getAudits();
    } catch (error) {
      console.error("Error fetching audits:", error);
    } finally {
      loading.value = false;
    }
  };

  return { audits, loading, fetchAudits };
});