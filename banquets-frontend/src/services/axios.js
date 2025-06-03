import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exporta tanto el cliente principal como funciones personalizadas
export const getConteoMensajesPendientes = () => api.get("/mensajes/soporte/count");

export default api;
