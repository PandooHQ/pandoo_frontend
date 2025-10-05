import axios from "axios";
import { useAuthStore } from "../stores/auth";

export const baseUrl = "http://localhost:3000/api/v1/";
// export const baseUrl = "https://pandoo-api-dev-9e2f14065ca2.herokuapp.com/api/v1/"

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
