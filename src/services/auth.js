import router from "@/router/index.js";
import authronomBackendPublicAxiosInstance from "@/services/axios.js";
import {defineStore} from "pinia";
import {jwtDecode} from "jwt-decode";

const config = {
    authServer: import.meta.env.VITE_AUTHRONOM_BACKEND_BASE_URL, // Spring Authorization Server
    clientId: import.meta.env.VITE_AUTHRONOM_FRONTEND_OAUTH_CLIENT_ID, // Your client ID
    redirectUri: import.meta.env.VITE_AUTHRONOM_FRONTEND_OAUTH_REDIRECT_URI,
    scope: "openid email profile",
    responseType: "code",
    grantType: "authorization_code",
    tokenEndpoint: "/oauth2/token",
};

function generateCodeVerifier() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, array))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        idToken: null,
        error: null,
    }),
    actions: {
        async startRegistrationWithEmail(email) {
            try {
                await authronomBackendPublicAxiosInstance.post(`/registration/start`, {
                    email
                });
            } catch (e) {
                const error = e.response?.data?.error || "Internal Server Error, please try again later.";
                throw {message: error};
            }
        },
        async finalizeRegistrationWithEmail(email, confirmationCode, password) {
            try {
                await authronomBackendPublicAxiosInstance.post(`/registration/finalize`, {
                    email,
                    confirmationCode,
                    password
                });
            } catch (e) {
                const error = e.response?.data?.error || "Internal Server Error, please try again later.";
                throw {message: error};
            }
        },
        async loginWithEmailPassword(email, password) {
            try {
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);

                await authronomBackendPublicAxiosInstance.post(`/login`, formData, {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    withCredentials: true // Ensures cookies (like JSESSIONID) are sent and received
                });
            } catch (e) {
                const error = e.response?.data?.error || "Internal Server Error, please try again later.";
                throw {message: error};
            }
        },
        loginWithGoogle() {
            window.location.href = `${config.authServer}/oauth2/authorization/google`;
        },
        async frontendOAuth2ClientLogin() {
            const codeVerifier = generateCodeVerifier();
            const codeChallenge = await generateCodeChallenge(codeVerifier);

            localStorage.setItem("code_verifier", codeVerifier);

            window.location.href = `${config.authServer}/oauth2/authorize?` +
                `response_type=${config.responseType}&client_id=${config.clientId}` +
                `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
                `&scope=${encodeURIComponent(config.scope)}&code_challenge=${codeChallenge}` +
                `&code_challenge_method=S256`;
        },
        async frontendOAuth2ClientLoginCallback() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");

            if (!code) return;

            const codeVerifier = localStorage.getItem("code_verifier");
            localStorage.removeItem("code_verifier");

            const data = new URLSearchParams({
                client_id: config.clientId,
                grant_type: config.grantType,
                code,
                redirect_uri: config.redirectUri,
                code_verifier: codeVerifier,
            });

            const response = await authronomBackendPublicAxiosInstance.post(config.tokenEndpoint, data, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
            });

            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("id_token", response.data.id_token);

            this.user = jwtDecode(response.data.id_token);
            this.idToken = response.data.id_token;

            await router.push("/")
        },
        async logout() {
            localStorage.removeItem("access_token");
            localStorage.removeItem("id_token");
            this.user = null;
            this.idToken = null;
            await router.push("/login");
        }
    },
    getters: {
        getIdToken(state) {
            return state.idToken;
        },
        getUser(state) {
            return state.user;
        },
        isLoggedIn(state) {
            return !!state.user;
        }
    }
});
