// src/stores/errorLogStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { ErrorLog } from "@/interfaces/ErrorLog";
import { getErrorLogs } from "@/services/errorLogService";

export const useErrorLogStore = defineStore("errorLog", () => {
  const errorLogs = ref<ErrorLog[]>([]);
  const loading = ref<boolean>(false);

  // Obtener todos los errores
  const fetchErrorLogs = async () => {
    loading.value = true;
    try {
      errorLogs.value = await getErrorLogs();
    } catch (error) {
      console.error("Error fetching error logs:", error);
    } finally {
      loading.value = false;
    }
  };

  return { errorLogs, loading, fetchErrorLogs };
});