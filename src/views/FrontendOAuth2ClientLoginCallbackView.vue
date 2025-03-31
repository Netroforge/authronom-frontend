<template>
  <div>
    <h1>Processing Login...</h1>
  </div>
</template>

<script setup>
import {onMounted} from "vue";
import {frontendOAuth2ClientLoginCallback} from "@/services/auth.js";

onMounted(() => {
  frontendOAuth2ClientLoginCallback();
});
</script>
