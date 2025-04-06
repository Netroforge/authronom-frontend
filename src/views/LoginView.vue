<template>
  <div class="login-container">
    <form @submit.prevent="handleLoginWithEmailPassword">
      <div>
        <div class="my-1">
          <label class="form-label" for="userEmail">Email address</label>
          <input id="userEmail" v-model="email" aria-label="example@gmail.com" autocomplete="email" class="form-control"
                 required
                 type="email">
        </div>
      </div>
      <div>
        <div class="my-1">
          <label class="form-label" for="userPassword">Password</label>
          <input id="userPassword" v-model="password" aria-describedby="userPasswordHelp"
                 autocomplete="current-password" class="form-control"
                 required
                 type="password">
          <div id="userPasswordHelp" class="form-text">Must be at least 5 characters with special symbol</div>
        </div>
      </div>
      <button class="btn btn-primary w-100 my-1 p-2" type="submit">Login</button>
    </form>
    <div class="w-100" style="max-width: 400px;">
      <button class="google-btn w-100 my-1 p-2" @click="handleLoginWithGoogle">
        <img alt="Google logo" height="20" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
             width="20">
        <span>Login with Google</span>
      </button>

      <button class="btn email-register-btn w-100 my-1 p-2" @click="handleRegisterWithEmail">
        Register
      </button>
    </div>
    <p v-if="errorMessage" class="error my-1 p-2">{{ errorMessage }}</p>
  </div>
</template>

<script>
import {useAuthStore} from "@/services/auth.js";
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
        const authStore = useAuthStore();
        await authStore.loginWithEmailPassword(this.email, this.password);
        await authStore.frontendOAuth2ClientLogin();
      } catch (error) {
        this.errorMessage = error.response?.data?.error;
      }
    },
    handleLoginWithGoogle() {
      try {
        const authStore = useAuthStore();
        authStore.loginWithGoogle()
      } catch (error) {
        this.errorMessage = error.response?.data?.error;
      }
    },
    handleRegisterWithEmail() {
      try {
        router.push("/register")
      } catch (error) {
        this.errorMessage = error.response?.data?.error;
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

.google-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #ffffff;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  color: #333333;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.google-btn img {
  width: 30px;
  margin-right: 10px;
}

.google-btn:hover {
  background-color: #f1f1f1;
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
