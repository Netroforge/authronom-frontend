<template>
  <div class="registration-container">
    <div v-if="step === 1">
      <h2>Enter registration email</h2>
      <form @submit.prevent="startRegistration">
        <div>
          <label for="email">Email: </label>
          <input type="email" v-model="email" required/>
        </div>
        <button type="submit">Next</button>
      </form>
    </div>

    <div v-if="step === 2">
      <h2>Finalize registration</h2>
      <form @submit.prevent="finalizeRegistration">
        <div>
          <label for="email">Email: </label>
          <input type="email" v-model="email" required readonly/>
        </div>
        <div>
          <label for="confirmationCode">Confirmation Code: </label>
          <input type="text" v-model="confirmationCode" required/>
        </div>
        <div>
          <label for="password">Password: </label>
          <input type="password" v-model="password" required/>
        </div>
        <button type="submit">Register</button>
      </form>
      <div>
        <button @click="resendConfirmationCode">
          Resend confirmation code
        </button>
      </div>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
