import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  { path: '/', component: () => import('@/views/HomeView.vue'), meta: { requiresAuth: true } },
  { path: '/compañias', component: () => import('@/views/CompanyView.vue'), meta: { requiresAuth: true } },
  { path: '/ca-products', component: () => import('@/views/CategoryProductView.vue'), meta: { requiresAuth: true } },
  { path: '/tipos-movimientos', component: () => import('@/views/MovementTypeView.vue'), meta: { requiresAuth: true } },
  { path: '/login', component: () => import('@/views/LoginView.vue') },
  { path: '/ca-purchase-orders', component: () => import('@/views/CategoryPurchaseOrderView.vue'), meta: { requiresAuth: true } },
  { path: '/positions', component: () => import('@/views/PositionView.vue'), meta: { requiresAuth: true } },
  { path: '/departments', component: () => import('@/views/DepartmentView.vue'), meta: { requiresAuth: true } },
  { path: '/ca-suppliers', component: () => import('@/views/CategorySupplierView.vue'), meta: { requiresAuth: true } },
  { path: '/states', component: () => import('@/views/StateView.vue'), meta: { requiresAuth: true } },
  { path: '/login', component: () => import('@/views/LoginView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.token) {
    next('/login')
  } else {
    await authStore.validateToken()
    next()
  }
})

export default router
