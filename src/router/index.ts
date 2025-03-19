import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes = [
  { path: '/', component: () => import('@/views/HomeView.vue'), meta: { requiresAuth: true } },
  { path: '/dashboard', component: () => import('@/views/Dashboard.vue'), meta: { requiresAuth: true } },
  { path: '/categories', component: () => import('@/views/ProductsView.vue'), meta: { requiresAuth: true } },
  { path: '/MovementsTypes', component: () => import('@/views/MovementsTypesView.vue'), meta: { requiresAuth: true } },
  { path: '/login', component: () => import('@/views/LoginView.vue') },
  { path: '/categoriesOrder', component: () => import('../views/CategoriesPucharseOrderView.vue'), meta: { requiresAuth: true } },
  { path: '/positions', component: () => import('@/views/PositionsView.vue'), meta: { requiresAuth: true } },
  { path: '/Departments', component: () => import('@/views/Departments.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login');
  } else {
    await authStore.validateToken();
    next();
  }
});

export default router;
