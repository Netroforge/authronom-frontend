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
import {getIdToken, logout} from "@/services/auth.js";
import {jwtDecode} from "jwt-decode";
import authronomBackendAxiosInstance from "@/services/axios.js";

export default {
  data() {
    return {
      user: null,
      testData: null
    };
  },

  mounted() {
    const idToken = getIdToken();
    if (idToken) {
      this.user = jwtDecode(idToken);
    }
  },

  methods: {
    handleLogout() {
      logout()
    },
    async test() {
      try {
        const response = await authronomBackendAxiosInstance.get('/test', {});
        this.testData = response.data;
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    }
  }
};
</script>
