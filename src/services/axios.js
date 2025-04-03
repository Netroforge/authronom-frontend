import axios from 'axios';

axios.defaults.withCredentials = true;

const authronomBackendAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_AUTHRONOM_BACKEND_BASE_URL
});

export default authronomBackendAxiosInstance;
