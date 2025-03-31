import axios from "axios";
import router from "@/router/index.js";

const config = {
    clientId: "test-client", // Your client ID
    authServer: "http://localhost:8080", // Spring Authorization Server
    redirectUri: "http://localhost:8081/callback",
    scope: "openid email profile",
    responseType: "code",
    grantType: "authorization_code",
    tokenEndpoint: "http://localhost:8080/oauth2/token",
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

export async function startRegistrationWithEmail(email) {
    try {
        const response = await axios.post(`${config.authServer}/public/user/start-registration`, {
            email
        });
        if (response.status === 200) {
            console.log('Start registration success');
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error starting registration:', error);
        throw {message: 'Something goes wrong'};
    }
}

export async function finalizeRegistrationWithEmail(email, confirmationCode, password) {
    try {
        const response = await axios.post(`${config.authServer}/public/user/finalize-registration`, {
            email,
            confirmationCode,
            password
        });
        if (response.status === 200) {
            console.log('Finalize registration success');
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error finalizing registration:', error);
        throw {message: 'Something goes wrong'};
    }
}

// Login using email and password
export async function loginWithEmailPassword(email, password) {
    try {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await axios.post(`${config.authServer}/login`, formData, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true // Ensures cookies (like JSESSIONID) are sent and received
        });

        if (response.status === 200) {
            // Handle successful authentication
            console.log('Login successful');
            // Redirect or update UI as needed
            await frontendOAuth2ClientLogin()
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Login error:', error);
        throw {message: 'Invalid email or password'};
    }
}

// Login using google
export async function loginWithGoogle() {
    window.location.href = `${config.authServer}/oauth2/authorization/google`;
}

// Frontend client login using OAuth2 with PKCE
export async function frontendOAuth2ClientLogin() {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem("code_verifier", codeVerifier);

    const authUrl = `${config.authServer}/oauth2/authorize?` +
        `response_type=${config.responseType}&client_id=${config.clientId}` +
        `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
        `&scope=${encodeURIComponent(config.scope)}&code_challenge=${codeChallenge}` +
        `&code_challenge_method=S256`;

    window.location.href = authUrl;
}

export async function frontendOAuth2ClientLoginCallback() {
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

    const response = await axios.post(config.tokenEndpoint, data, {
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
    });

    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("id_token", response.data.id_token);

    await router.push("/dashboard")
}

export function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    window.location.href = "/";
}

export function getAccessToken() {
    return localStorage.getItem("access_token");
}

export function getIdToken() {
    return localStorage.getItem("id_token");
}
