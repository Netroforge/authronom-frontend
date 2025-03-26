<template>
  <div>
    <h1>Processing Login...</h1>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { handleCallback } from "@/services/auth.js";

onMounted(() => {
  handleCallback();
});
</script>
