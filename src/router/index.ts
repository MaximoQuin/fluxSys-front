// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'; // Importar RouteRecordRaw como tipo
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/composables/useAuth';

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/views/HomeView.vue'), meta: { requiresAuth: true } },
  { path: '/companies-a', component: () => import('@/views/CompanyView.vue'), meta: { requiresAuth: true } },
  { path: '/ca-products-u', component: () => import('@/views/CategoryProductView.vue'), meta: { requiresAuth: true } },
  { path: '/movements-types-u', component: () => import('@/views/MovementTypeView.vue'), meta: { requiresAuth: true } },
  { path: '/ca-purchase-orders-u', component: () => import('@/views/CategoryPurchaseOrderView.vue'), meta: { requiresAuth: true } },
  { path: '/positions-u', component: () => import('@/views/PositionView.vue'), meta: { requiresAuth: true } },
  { path: '/departments-u', component: () => import('@/views/DepartmentView.vue'), meta: { requiresAuth: true } },
  { path: '/ca-suppliers-u', component: () => import('@/views/CategorySupplierView.vue'), meta: { requiresAuth: true } },
  { path: '/states-u', component: () => import('@/views/StateView.vue'), meta: { requiresAuth: true } },
  { path: '/inventories-u', component: () => import('@/views/user/InventoryView.vue'), meta: { requiresAuth: true } },
  { path: '/suppliers-u', component: () => import('@/views/user/SupplierView.vue'), meta: { requiresAuth: true } },
  { path: '/invoices-u', component: () => import('@/views/user/InvoiceView.vue'), meta: { requiresAuth: true } },
  { path: '/purchase-orders-u', component: () => import('@/views/user/PurchaseOrderView.vue'), meta: { requiresAuth: true } },
  { path: '/users-ua', component: () => import('@/views/admin/UserView.vue'), meta: { requiresAuth: true } },
  { path: '/audits-a', component: () => import('@/views/admin/AuditView.vue'), meta: { requiresAuth: true } },
  { path: '/errors-a', component: () => import('@/views/admin/ErrorLogView.vue'), meta: { requiresAuth: true } },
  { path: '/inv-movements-ua', component: () => import('@/views/InventoryMovementView.vue'), meta: { requiresAuth: true } },
  { path: '/login', component: () => import('@/views/LoginView.vue') },
  { path: '/unauthorized', component: () => import('@/views/UnauthorizedView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { canAccessRoute } = useAuth();

  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login');
    return;
  }

  // Validar token
  if (to.meta.requiresAuth) {
    await authStore.validateToken();
  }

  // Verificar acceso a la ruta
  if (to.meta.requiresAuth && !canAccessRoute(to.path)) {
    next('/unauthorized');
    return;
  }

  next();
});

export default router;