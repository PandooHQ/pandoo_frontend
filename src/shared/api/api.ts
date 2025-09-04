import axios from "axios";
import { useAuthStore } from "../stores/auth";

const baseUrl = "http://localhost:3000/api";

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
