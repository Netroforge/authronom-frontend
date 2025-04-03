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
    <div>
      <button @click="handleLoginWithGoogle" class="google-login-btn">
        Login via Google
      </button>
    </div>
    <div>
      <button @click="handleRegisterWithEmail" class="email-register-btn">
        Register
      </button>
    </div>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import {frontendOAuth2ClientLogin, loginWithEmailPassword, loginWithGoogle} from "@/services/auth.js";
import router from "@/router/index.js";

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
        await frontendOAuth2ClientLogin();
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
    },
    handleRegisterWithEmail() {
      try {
        router.push("/register")
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

.email-register-btn {
  background-color: #42db37;
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
