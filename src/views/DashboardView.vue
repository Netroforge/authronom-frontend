<template>
  <div class="container">
    <h1>Dashboard</h1>
    <p v-if="user">Welcome back, email: {{ user.email }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getIdToken, logout} from "@/services/auth.js";
import {jwtDecode} from "jwt-decode";

const user = ref(null);

onMounted(() => {
  const idToken = getIdToken();
  if (idToken) {
    user.value = jwtDecode(idToken);
  }
});
</script>
