import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('../views/UploadView.vue'),
  },
  {
    path: '/receipts',
    name: 'receipts',
    component: () => import('../views/ReceiptsView.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/ChatbotView.vue'),
  },
  {
    path: '/add-manual',
    name: 'add-manual',
    component: () => import('../views/ManualEntryView.vue'),
  },
  {
    path: '/add-income',
    name: 'add-income',
    component: () => import('../views/IncomeEntryView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
