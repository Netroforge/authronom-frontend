import {createRouter, createWebHistory} from "vue-router";
import LoginView from "@/views/LoginView.vue";
import FrontendOAuth2ClientLoginCallbackView from "@/views/FrontendOAuth2ClientLoginCallbackView.vue";
import DashboardView from "@/views/DashboardView.vue";
import SocialSuccessLoginView from "@/views/SocialSuccessLoginView.vue";

const routes = [
    {path: "/", component: LoginView},
    {path: "/login", component: LoginView},
    {path: "/callback", component: FrontendOAuth2ClientLoginCallbackView},
    {path: "/dashboard", component: DashboardView},
    {path: "/socialSuccessLogin", component: SocialSuccessLoginView},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
