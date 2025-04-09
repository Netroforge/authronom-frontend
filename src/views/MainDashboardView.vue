<template>
  <div class="container">
    <h1 class="text-start my-1">Dashboard</h1>
    <p v-if="userEmail" class="text-start my-1">Welcome back, email: {{ userEmail }}</p>
    <div class="container">
      <button class="btn btn-primary my-1" @click="test">Test</button>
      <p v-if="testData" class="text-start my-1">Test data: {{ testData }}</p>
    </div>
    <div class="container">
      <button class="btn btn-primary my-1" @click="forceFrontendOAuth2ClientLogin">Force FrontendOAuth2ClientLogin
      </button>
    </div>
  </div>
</template>

<script>
import {authronomBackendAuthAxiosInstance} from "@/services/axios.js";
import {useAuthStore} from '@/services/auth';

export default {
  data() {
    return {
      userEmail: null,
      testData: null
    };
  },

  async mounted() {
    try {
      const response = await authronomBackendAuthAxiosInstance.get('/user', {});
      this.userEmail = response.data.email;
    } catch (error) {
      console.error("Error fetching test data:", error);
    }
  },

  methods: {
    async test() {
      try {
        const response = await authronomBackendAuthAxiosInstance.get('/auth/test', {});
        this.testData = response.data;
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    },

    async forceFrontendOAuth2ClientLogin() {
      try {
        const authStore = useAuthStore();
        await authStore.frontendOAuth2ClientLogin();
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    }
  }
};
</script>
