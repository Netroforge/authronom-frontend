<template>
  <div class="login-container">
    <form @submit.prevent="handleLoginWithEmailPassword">
      <div>
        <label for="email">Email: </label>
        <input type="email" v-model="email" required/>
      </div>
      <div>
        <label for="password">Password: </label>
        <input type="password" v-model="password" required/>
      </div>
      <button type="submit">Login</button>
    </form>
    <button @click="handleLoginWithGoogle" class="google-login-btn">
      Login via Google
    </button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import {loginWithEmailPassword, loginWithGoogle} from "@/services/auth.js";

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLoginWithEmailPassword() {
      try {
        await loginWithEmailPassword(this.email, this.password);
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    handleLoginWithGoogle() {
      try {
        loginWithGoogle()
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: auto;
}

.error {
  color: red;
}

.google-login-btn {
  background-color: #db4437;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
