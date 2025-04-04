<template>
  <nav v-if="user" class="navbar bg-body-tertiary">
    <div class="container-fluid d-flex justify-content-end">
      <span class="navbar-text me-3">
        User: {{ user?.email || 'not logged' }}
      </span>
      <button class="btn btn-primary my-1 p-2" @click="handleLogout">Logout</button>
    </div>
  </nav>
</template>

<script>
import {useAuthStore} from '@/services/auth';
import {computed} from "vue";

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
    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout()
    },
  }
};
</script>
