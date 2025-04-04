<template>
  <div class="container">
    <h1 class="text-start my-1">Dashboard</h1>
    <p v-if="user" class="text-start my-1">Welcome back, email: {{ user.email }}</p>
    <button class="btn btn-primary my-1" @click="test">Test</button>
    <p v-if="testData" class="text-start my-1">Test data: {{ testData }}</p>
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
