// src/http-common.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082/api"; 
// Fallback si variable d'environnement non définie

// Création d'une instance Axios
const http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// ✅ Intercepteur pour ajouter automatiquement le token à chaque requête
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default http;
