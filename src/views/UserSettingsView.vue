<template>
  <div v-if="user" class="container d-flex flex-column align-items-center">
    <h1 class="text-start my-1">User settings</h1>

    <div class="settings-section">
      <h2 class="text-start my-1">Email</h2>
      <div class="current-email-container">
        <div v-if="!isEditingEmail" class="email-display">
          <span>{{ user.email }}</span>
          <button class="btn btn-outline-primary" @click="startEmailEdit">
            Change
          </button>
        </div>
        <form v-else class="email-edit-form" @submit.prevent="changeEmail">
          <div class="input-group">
            <input
                ref="emailInput"
                v-model="newEmail"
                class="form-control"
                required
                type="email"
                @blur="cancelEmailEdit"
            >
            <button class="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="settings-section">
      <h2 class="text-start my-1">Password</h2>
      <div v-if="passwordStep === 1">
        <button class="btn btn-primary w-100 my-1 p-2"
                type="submit"
                @click="startChangePassword">
          Change password
        </button>
      </div>

      <div v-if="passwordStep === 2">
        <form @submit.prevent="finalizeChangePassword">
          <div class="my-1">
            <label class="form-label" for="confirmationCode">Confirmation Code</label>
            <div class="input-group">
              <input
                  id="confirmationCode"
                  v-model="confirmationCode"
                  autocomplete="one-time-code"
                  class="form-control"
                  required
                  type="text"
              />
              <button class="btn btn-outline-primary" type="button" @click="resendConfirmationCode">
                Resend code
              </button>
            </div>
          </div>
          <div class="my-1">
            <label class="form-label" for="userPassword">New Password</label>
            <input id="userPassword"
                   v-model="newPassword"
                   autocomplete="new-password"
                   class="form-control"
                   required
                   type="password">
          </div>
          <div class="button-group">
            <button class="btn btn-primary w-100 my-1 p-2" type="submit">
              Set new password
            </button>
            <button class="btn btn-outline-secondary w-100 my-1 p-2" type="button" @click="cancelPasswordChange">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <p v-if="errorMessage" class="error my-1 p-2">{{ errorMessage }}</p>
  </div>
</template>

<script>
import {useAuthStore} from '@/services/auth';
import {authronomBackendAuthAxiosInstance} from "@/services/axios.js";

export default {
  data() {
    return {
      user: null,
      newEmail: '',
      isEditingEmail: false,
      passwordStep: 1,
      confirmationCode: '',
      newPassword: '',
      errorMessage: ''
    };
  },

  mounted() {
    const authStore = useAuthStore();
    this.user = authStore.getUser;
  },

  methods: {
    startEmailEdit() {
      this.isEditingEmail = true;
      this.newEmail = this.user.email;
      this.$nextTick(() => {
        this.$refs.emailInput.focus();
      });
    },

    cancelEmailEdit() {
      this.isEditingEmail = false;
      this.newEmail = '';
    },

    async changeEmail() {
      try {
        await authronomBackendAuthAxiosInstance.put('/change-email', {
          newEmail: this.newEmail
        });
        this.user.email = this.newEmail;
        this.isEditingEmail = false;
        this.newEmail = '';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = error.response?.data?.error;
      }
    },

    async startChangePassword() {
      try {
        await authronomBackendAuthAxiosInstance.put('/change-password/start');
        this.passwordStep = 2;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = error.response?.data?.error;
      }
    },

    async finalizeChangePassword() {
      try {
        await authronomBackendAuthAxiosInstance.put('/change-password/finalize', {
          confirmationCode: this.confirmationCode,
          newPassword: this.newPassword,
        });
        this.passwordStep = 1;
        this.confirmationCode = '';
        this.newPassword = '';
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = error.response?.data?.error;
      }
    },

    async resendConfirmationCode() {
      try {
        await authronomBackendAuthAxiosInstance.put('/change-password/start');
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = error.response?.data?.error;
      }
    },

    cancelPasswordChange() {
      this.passwordStep = 1;
      this.confirmationCode = '';
      this.newPassword = '';
      this.errorMessage = '';
    }
  }
};
</script>

<style scoped>
.settings-section {
  max-width: 50vw;
  width: 30vw;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.email-form {
  margin-top: 1rem;
}

.error {
  color: red;
  background-color: #ffebee;
  border-radius: 4px;
}

.current-email-container {
  margin-bottom: 1rem;
}

.email-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.email-display span {
  font-size: 1.1rem;
}

.email-edit-form {
  width: 100%;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input-group input {
  flex: 1;
}

.input-group button {
  white-space: nowrap;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
