import axios from 'axios';

// In development the Vite proxy forwards /api/* to the backend, avoiding CORS.
// In production set VITE_API_URL to the hosted backend origin, not an /api path.
const normalizeBaseUrl = (value) => {
  if (!value) return '';
  return value.replace(/\/?api\/?$/, '').replace(/\/$/, '');
};

const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_URL ?? ''),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
