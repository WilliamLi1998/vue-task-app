import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import LeaveApplyView from '../views/LeaveApplyView.vue'
import LeaveConfirmView from '../views/LeaveConfirmView.vue'
import LeaveCompleteView from '../views/LeaveCompleteView.vue'
import ApplicationListView from '../views/ApplicationListView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    redirect: { name: 'home' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/index',
    name: 'home',
    component: HomeView
  },
  {
    path: '/applications',
    name: 'application-list',
    component: ApplicationListView,
  },
  {
    path: '/applications/new',
    name: 'leave-apply',
    component: LeaveApplyView,
  },
  {
    path: '/applications/confirm',
    name: 'leave-confirm',
    component: LeaveConfirmView,
  },
  {
    path: '/applications/:id/complete',
    name: 'leave-complete',
    component: LeaveCompleteView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
