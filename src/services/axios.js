import axios from 'axios';
import {useAuthStore} from '@/services/auth';

axios.defaults.withCredentials = true;

const authronomBackendPublicAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_AUTHRONOM_BACKEND_BASE_URL
});

const authronomBackendAuthAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_AUTHRONOM_BACKEND_BASE_URL
});

// Request interceptor to add Firebase ID token
authronomBackendAuthAxiosInstance.interceptors.request.use(
    async config => {
        const authStore = useAuthStore();
        if (authStore.isLoggedIn) {
            config.headers['Authorization'] = `Bearer ${authStore.getIdToken}`;
        } else {
            console.warn("No current user found in axios interceptor; token not attached.");
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default authronomBackendPublicAxiosInstance;
export {authronomBackendAuthAxiosInstance};
