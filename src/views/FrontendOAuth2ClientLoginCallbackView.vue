<template>
  <div>
    <h1 class="text-start my-1">Processing Login...</h1>
  </div>
</template>

<script>
import {useAuthStore} from "@/services/auth.js";

export default {
  mounted() {
    const authStore = useAuthStore();
    authStore.frontendOAuth2ClientLoginCallback();
  }
}
</script>
