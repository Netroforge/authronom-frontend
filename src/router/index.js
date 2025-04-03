import {createRouter, createWebHistory} from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegistrationFormView from "@/views/RegistrationFormView.vue";
import FrontendOAuth2ClientLoginCallbackView from "@/views/FrontendOAuth2ClientLoginCallbackView.vue";
import DashboardView from "@/views/DashboardView.vue";
import LoginSuccessView from "@/views/LoginSuccessView.vue";

const routes = [
    {path: "/", component: LoginView},
    {path: "/login", component: LoginView},
    {path: "/register", component: RegistrationFormView},
    {path: "/callback", component: FrontendOAuth2ClientLoginCallbackView},
    {path: "/dashboard", component: DashboardView},
    {path: "/successLogin", component: LoginSuccessView}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
