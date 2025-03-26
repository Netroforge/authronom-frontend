<template>
  <div class="container">
    <h1>Login</h1>
    <button @click="login">Login with PKCE</button>
  </div>
</template>

<script setup>
import { login } from "@/services/auth.js";
</script>

<style>
.container {
  text-align: center;
  margin-top: 50px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
