import {createRouter, createWebHistory} from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegistrationFormView from "@/views/RegistrationFormView.vue";
import FrontendOAuth2ClientLoginCallbackView from "@/views/FrontendOAuth2ClientLoginCallbackView.vue";
import MainDashboardView from "@/views/MainDashboardView.vue";
import LoginSuccessView from "@/views/LoginSuccessView.vue";
import {useAuthStore} from "@/services/auth.js";

const routes = [
    {path: "/login", name: 'Login', component: LoginView, meta: {requiresAuth: false}},
    {path: "/register", component: RegistrationFormView, meta: {requiresAuth: false}},
    {path: "/callback", component: FrontendOAuth2ClientLoginCallbackView, meta: {requiresAuth: false}},
    {path: "/successLogin", component: LoginSuccessView, meta: {requiresAuth: false}},

    // Protected routes
    {path: "/", component: MainDashboardView, meta: {requiresAuth: true}},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) {
        if (to.matched.some(record => record.meta.requiresAuth)) {
            if (authStore.user) {
                next();
            } else {
                next({
                    name: 'Login',
                    query: {redirect: to.fullPath},
                });
            }
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
