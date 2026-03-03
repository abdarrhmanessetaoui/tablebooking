import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sanctum_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('sanctum_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/register', data),
  login: (data) => apiClient.post('/login', data),
  logout: () => apiClient.post('/logout'),
  getUser: () => apiClient.get('/user'),
};

// Restaurants APIs
export const restaurantsAPI = {
  getAll: () => apiClient.get('/restaurants'),
  getById: (id) => apiClient.get(`/restaurants/${id}`),
  create: (data) => apiClient.post('/restaurants', data),
  update: (id, data) => apiClient.put(`/restaurants/${id}`, data),
  delete: (id) => apiClient.delete(`/restaurants/${id}`),
};

export default apiClient;