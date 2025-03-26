<template>
  <div class="container">
    <h1>Dashboard</h1>
    <p v-if="user">Welcome, {{ user.name }} ({{ user.email }})</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {logout, getIdToken} from "@/services/auth.js";
import { jwtDecode } from "jwt-decode";

const user = ref(null);

onMounted(() => {
  const idToken = getIdToken();
  if (idToken) {
    user.value = jwtDecode(idToken);
  }
});
</script>
