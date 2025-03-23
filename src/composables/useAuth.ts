// src/composables/useAuth.ts
import { computed } from 'vue';
import { roles, restrictedRoutes } from '@/types/Roles'; // Importar roles y restrictedRoutes
import type { Permission } from '@/types/Roles'; // Importar Permission como tipo
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const authStore = useAuthStore();

  // Obtener el rol del usuario desde el store
  const userRole = computed(() => authStore.userRole || null);

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission: Permission) => {
    if (!userRole.value) return false; // Si no hay rol, no tiene permisos
    return roles[userRole.value][permission];
  };

  // Verificar si el usuario puede acceder a una ruta específica
  const canAccessRoute = (routePath: string) => {
    if (!userRole.value) return false; // Si no hay rol, no puede acceder
    const restricted = restrictedRoutes[userRole.value] || [];
    return !restricted.includes(routePath);
  };

  return {
    userRole,
    hasPermission,
    canAccessRoute,
  };
}