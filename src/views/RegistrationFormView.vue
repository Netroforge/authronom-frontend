<template>
  <div class="registration-container">
    <div v-if="step === 1">
      <h2 class="text-start my-1">Enter registration email</h2>
      <form @submit.prevent="startRegistration">
        <div class="my-1">
          <label class="form-label" for="userEmail">Email address</label>
          <input id="userEmail"
                 v-model="email"
                 aria-label="example@gmail.com"
                 autocomplete="email"
                 class="form-control"
                 required
                 type="email">
        </div>
        <button class="btn btn-primary w-100 my-1 p-2" type="submit">Next</button>
      </form>
    </div>

    <div v-if="step === 2">
      <h2>Finalize registration</h2>
      <form @submit.prevent="finalizeRegistration">
        <div class="my-1">
          <label class="form-label" for="userEmail">Email address</label>
          <input id="userEmail"
                 v-model="email"
                 aria-label="example@gmail.com"
                 autocomplete="email"
                 class="form-control"
                 readonly
                 required
                 type="email">
        </div>
        <div class="my-1">
          <label class="form-label" for="confirmationCode">Confirmation Code</label>
          <input id="confirmationCode" v-model="confirmationCode" class="form-control" required type="text"/>
        </div>
        <div class="my-1">
          <label class="form-label" for="userPassword">Password</label>
          <input id="userPassword" v-model="password" autocomplete="new-password" class="form-control" required
                 type="password">
        </div>
        <button class="btn btn-primary w-100 my-1 p-2" type="submit">Register</button>
      </form>
      <div>
        <button class="btn btn-secondary w-100 my-1 p-2" @click="resendConfirmationCode">
          Resend confirmation code
        </button>
      </div>
    </div>

    <p v-if="errorMessage" class="error my-1 p-2">{{ errorMessage }}</p>
  </div>
</template>

<script>
import {useAuthStore} from '@/services/auth.js';

export default {
  data() {
    return {
      step: 1,
      email: '',
      password: '',
      confirmationCode: '',
      errorMessage: ''
    };
  },
  methods: {
    async startRegistration() {
      try {
        const authStore = useAuthStore();
        await authStore.startRegistrationWithEmail(this.email);
        // Handle response if needed
        this.step = 2;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async finalizeRegistration() {
      try {
        const authStore = useAuthStore();
        await authStore.finalizeRegistrationWithEmail(
            this.email,
            this.confirmationCode,
            this.password
        );
        await authStore.loginWithEmailPassword(this.email, this.password);
        await authStore.frontendOAuth2ClientLogin();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async resendConfirmationCode() {
      try {
        const authStore = useAuthStore();
        await authStore.startRegistrationWithEmail(this.email);
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
};
</script>

<style scoped>
.registration-container {
  max-width: 400px;
  margin: auto;
}
</style>
