<template>
  <div class="container d-flex flex-column align-items-center">
    <h1 class="text-start my-1">User settings</h1>

    <div v-if="user" class="settings-section">
      <h2 class="text-start my-1">Email</h2>
      <div class="current-email-container">
        <div v-if="emailStep === 1" class="email-display">
          <div class="my-1">
            <label class="form-label">Current Email</label>
            <div class="form-control bg-light">{{ user.email }}</div>
          </div>
          <button class="btn btn-primary w-100 my-1 p-2"
                  type="submit"
                  @click="initEmailChange">
            Change email
          </button>
        </div>

        <div v-else-if="emailStep === 2">
          <form @submit.prevent="startEmailChange" class="email-edit-form">
            <div class="my-1">
              <label class="form-label">Current Email</label>
              <div class="form-control bg-light">{{ user.email }}</div>
            </div>
            <div class="my-1">
              <label class="form-label" for="newEmail">New Email</label>
              <input
                  ref="emailInput"
                  id="newEmail"
                  v-model="newEmail"
                  class="form-control"
                  type="email"
                  required
              >
            </div>
            <div class="button-group">
              <button class="btn btn-primary w-100 my-1 p-2" type="submit">
                Continue
              </button>
              <button class="btn btn-outline-secondary w-100 my-1 p-2" type="button" @click="cancelEmailChange">
                Cancel
              </button>
            </div>
          </form>
          <p v-if="emailChangeErrorMessage" class="error my-1 p-2">{{ emailChangeErrorMessage }}</p>
        </div>

        <div v-else-if="emailStep === 3">
          <form @submit.prevent="finalizeEmailChange" class="email-confirm-form">
            <div class="my-1">
              <label class="form-label">Current Email</label>
              <div class="form-control bg-light">{{ user.email }}</div>
            </div>
            <div class="my-1">
              <label class="form-label" for="oldEmailConfirmationCode">Confirmation Code (Current Email)</label>
              <input
                  id="oldEmailConfirmationCode"
                  v-model="oldEmailConfirmationCode"
                  class="form-control"
                  required
                  type="text"
                  autocomplete="one-time-code"
              />
            </div>
            <div class="my-1">
              <label class="form-label">New Email</label>
              <div class="form-control bg-light">{{ newEmail }}</div>
            </div>
            <div class="my-1">
              <label class="form-label" for="newEmailConfirmationCode">Confirmation Code (New Email)</label>
              <input
                  id="newEmailConfirmationCode"
                  v-model="newEmailConfirmationCode"
                  class="form-control"
                  required
                  type="text"
                  autocomplete="one-time-code"
              />
            </div>
            <div class="button-group">
              <button class="btn btn-primary w-100 my-1 p-2" type="submit">
                Confirm change
              </button>
              <button class="btn btn-outline-primary w-100 my-1 p-2" type="button"
                      @click="resendEmailChangeConfirmationCodes">
                Resend confirmation codes
              </button>
              <button class="btn btn-outline-secondary w-100 my-1 p-2" type="button" @click="cancelEmailChange">
                Cancel
              </button>
            </div>
          </form>
          <p v-if="emailChangeErrorMessage" class="error my-1 p-2">{{ emailChangeErrorMessage }}</p>
        </div>
      </div>
    </div>

    <div v-if="user" class="settings-section">
      <h2 class="text-start my-1">Password</h2>
      <div v-if="passwordStep === 1">
        <button class="btn btn-primary w-100 my-1 p-2"
                type="submit"
                @click="startChangePassword">
          Change password
        </button>
        <p v-if="passwordChangeErrorMessage" class="error my-1 p-2">{{ passwordChangeErrorMessage }}</p>
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
        <p v-if="passwordChangeErrorMessage" class="error my-1 p-2">{{ passwordChangeErrorMessage }}</p>
      </div>
    </div>
    <p v-if="errorMessage" class="error my-1 p-2">{{ errorMessage }}</p>
  </div>
</template>

<script>
import {authronomBackendAuthAxiosInstance} from "@/services/axios.js";

export default {
  data() {
    return {
      user: null,
      newEmail: '',
      emailStep: 1,
      oldEmailConfirmationCode: '',
      newEmailConfirmationCode: '',
      passwordStep: 1,
      confirmationCode: '',
      newPassword: '',
      errorMessage: '',
      emailChangeErrorMessage: '',
      passwordChangeErrorMessage: ''
    };
  },

  async mounted() {
    try {
      const response = await authronomBackendAuthAxiosInstance.get('/user', {});
      this.user = response.data;
    } catch (error) {
      this.errorMessage = error.response?.data?.error || 'Internal Server Error';
    }
  },

  methods: {
    initEmailChange() {
      this.emailStep = 2;
      this.newEmail = '';
      this.$nextTick(() => {
        this.$refs.emailInput.focus();
      });
    },

    cancelEmailChange() {
      this.emailStep = 1;
      this.newEmail = '';
      this.oldEmailConfirmationCode = '';
      this.newEmailConfirmationCode = '';
      this.emailChangeErrorMessage = '';
    },

    async startEmailChange() {
      try {
        await authronomBackendAuthAxiosInstance.put('/user/change-email/start', {
          newEmail: this.newEmail
        });
        this.emailStep = 3;
        this.emailChangeErrorMessage = '';
      } catch (error) {
        this.emailChangeErrorMessage = error.response?.data?.error;
      }
    },

    async finalizeEmailChange() {
      try {
        await authronomBackendAuthAxiosInstance.put('/user/change-email/finalize', {
          newEmail: this.newEmail,
          oldEmailConfirmationCode: this.oldEmailConfirmationCode,
          newEmailConfirmationCode: this.newEmailConfirmationCode
        });
        this.user.email = this.newEmail;
        this.emailStep = 1;
        this.newEmail = '';
        this.oldEmailConfirmationCode = '';
        this.newEmailConfirmationCode = '';
        this.emailChangeErrorMessage = '';
      } catch (error) {
        this.emailChangeErrorMessage = error.response?.data?.error;
      }
    },

    async resendEmailChangeConfirmationCodes() {
      try {
        await authronomBackendAuthAxiosInstance.put('/user/change-email/start', {
          newEmail: this.newEmail
        });
        this.emailChangeErrorMessage = '';
      } catch (error) {
        this.emailChangeErrorMessage = error.response?.data?.error;
      }
    },

    async startChangePassword() {
      try {
        await authronomBackendAuthAxiosInstance.put('/user/change-password/start');
        this.passwordStep = 2;
        this.passwordChangeErrorMessage = '';
      } catch (error) {
        this.passwordChangeErrorMessage = error.response?.data?.error;
      }
    },

    async finalizeChangePassword() {
      try {
        await authronomBackendAuthAxiosInstance.put('/user/change-password/finalize', {
          confirmationCode: this.confirmationCode,
          newPassword: this.newPassword,
        });
        this.passwordStep = 1;
        this.confirmationCode = '';
        this.newPassword = '';
        this.passwordChangeErrorMessage = '';
      } catch (error) {
        this.passwordChangeErrorMessage = error.response?.data?.error;
      }
    },

    async resendConfirmationCode() {
      try {
        await authronomBackendAuthAxiosInstance.put('/user/change-password/start');
        this.passwordChangeErrorMessage = '';
      } catch (error) {
        this.passwordChangeErrorMessage = error.response?.data?.error;
      }
    },

    cancelPasswordChange() {
      this.passwordStep = 1;
      this.confirmationCode = '';
      this.newPassword = '';
      this.passwordChangeErrorMessage = '';
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

.current-email {
  font-size: 1.1rem;
  padding: 0.5rem 0;
}

.email-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.resend-buttons {
  margin-top: 1rem;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}
</style>
