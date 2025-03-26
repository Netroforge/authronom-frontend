import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import CallbackView from "@/views/CallbackView.vue";
import DashboardView from "@/views/DashboardView.vue";

const routes = [
  { path: "/", component: LoginView },
  { path: "/callback", component: CallbackView },
  { path: "/dashboard", component: DashboardView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
