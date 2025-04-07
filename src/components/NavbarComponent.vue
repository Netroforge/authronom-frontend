<template>
  <header v-if="user" class="p-3 mb-3 border-bottom">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="#" class="nav-link px-2 link-secondary" @click="handleDashboard">Dashboard</a></li>
        </ul>
        <div class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3"></div>
        <div class="dropdown text-end">
          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ user.sub }}
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" @click="handleChangePassword">User settings</a></li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="#" @click="handleLogout">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import {useAuthStore} from '@/services/auth';
import {computed} from "vue";
import router from "@/router/index.js";

export default {
  name: 'NavbarComponent',
  data() {
    return {
      user: null
    };
  },

  mounted() {
    const authStore = useAuthStore();
    this.user = computed(() => authStore.getUser);
  },

  methods: {
    handleDashboard() {
      router.push('/');
    },
    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout()
    },
    handleChangePassword() {
      router.push('/user-settings');
    },
  }
};
</script>
