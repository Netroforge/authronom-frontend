<template>
  <div>
    <h1>Processing login...</h1>
  </div>
</template>

<script>
import {frontendOAuth2ClientLogin} from "@/services/auth.js";

export default {
  mounted() {
    frontendOAuth2ClientLogin();
  }
}
</script>
