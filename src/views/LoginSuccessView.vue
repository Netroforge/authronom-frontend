<template>
  <div>
    <h1>Processing login...</h1>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {frontendOAuth2ClientLogin} from "@/services/auth.js";

onMounted(() => {
  frontendOAuth2ClientLogin();
});
</script>
