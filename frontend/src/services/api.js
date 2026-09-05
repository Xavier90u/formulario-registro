import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ticketService = {
  crear: async (data) => {
    const response = await api.post('/tickets', data);
    return response.data;
  },

  consumir: async (dni) => {
    const response = await api.post('/tickets/consume', { dni });
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  obtenerPorDni: async (dni) => {
    const response = await api.get(`/tickets/dni/${dni}`);
    return response.data;
  },

  listar: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },

  estadisticas: async () => {
    const response = await api.get('/tickets/stats');
    return response.data;
  },
};

export const authService = {
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export default api;
