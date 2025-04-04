<!-- src/components/NavbarComponent.vue -->
<template>
  <header class="navbar-header">
    <!-- Top Bar: User Icon & Cart -->
    <div class="navbar-top">
      <p v-if="user">Logged in user ({{ user.email }})</p>
      <p v-else>Anonymous user</p>
    </div>
  </header>
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
};
</script>

<style scoped>
/* Overall Navbar container */
.navbar-header {
  width: 100%;
}

/* Top bar styling */
.navbar-top {
  background-color: #8c8c8c;
  padding: 8px 0;
}
</style>
