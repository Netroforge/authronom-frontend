<template>
  <div class="container">
    <h1>Dashboard</h1>
    <p v-if="user">Welcome back, email: {{ user.email }}</p>
    <p v-if="testData">Test data: {{ testData }}</p>
    <button @click="test">Test</button>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
import {authronomBackendAuthAxiosInstance} from "@/services/axios.js";
import {useAuthStore} from '@/services/auth';

export default {
  data() {
    return {
      user: null,
      testData: null
    };
  },

  mounted() {
    const authStore = useAuthStore();
    this.user = authStore.getUser;
  },

  methods: {
    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout()
    },
    async test() {
      try {
        const authStore = useAuthStore();
        const response = await authronomBackendAuthAxiosInstance.get('/auth/test', {
          headers: {
            authorization: `Bearer ${authStore.getIdToken}`
          }
        });
        this.testData = response.data;
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    }
  }
};
</script>
