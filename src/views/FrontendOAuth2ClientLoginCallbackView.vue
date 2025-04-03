<template>
  <div>
    <h1>Processing Login...</h1>
  </div>
</template>

<script>
import {frontendOAuth2ClientLoginCallback} from "@/services/auth.js";

export default {
  mounted() {
    frontendOAuth2ClientLoginCallback();
  }
}
</script>
