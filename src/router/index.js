import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import LeaveApplyView from '../views/LeaveApplyView.vue'
import LeaveConfirmView from '../views/LeaveConfirmView.vue'
import LeaveCompleteView from '../views/LeaveCompleteView.vue'
import ApplicationListView from '../views/ApplicationListView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { useAuth } from '@/stores/auth.js'
import { useApplications } from '@/stores/applications.js'

const routes = [
    {
        path: '/',
        redirect: { name: 'home' }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            requireAuth: false,
        }
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: {
            requireAuth: false,
        }
    },
    {
        path: '/index',
        name: 'home',
        component: HomeView,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: '/applications',
        name: 'application-list',
        component: ApplicationListView,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: '/applications/new',
        name: 'leave-apply',
        component: LeaveApplyView,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: '/applications/confirm',
        name: 'leave-confirm',
        component: LeaveConfirmView,
        meta: {
            requireAuth: true,
        },
        beforeEnter: () => {
            const application = useApplications();
            if (!application.applicationDraft) {
                return { name: 'leave-apply' };
            }
        },
    },
    {
        path: '/applications/:id/complete',
        name: 'leave-complete',
        component: LeaveCompleteView,
        meta: {
            requireAuth: true,
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundView,
        meta: {
            requireAuth: false,
        }
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to) => {
    const auth = useAuth();
    //刷新后根据cookie请求用户信息
    if (!auth.initialized) {
       await auth.loadUserInfo();
    }

    if (!auth.userInfo && to.meta.requireAuth && to.name !== 'login') {
        return {
            name: 'login',
            query: { redirect: to.fullPath },
        }
    }
})