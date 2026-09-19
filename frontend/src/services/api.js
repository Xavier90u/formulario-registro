import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (data) => (await api.post('/auth/login', data)).data,
  register: async (data) => (await api.post('/auth/register', data)).data,
  getProfile: async () => (await api.get('/auth/profile')).data,
  updateProfile: async (data) => (await api.put('/auth/profile', data)).data,
};

export const companyService = {
  crear: async (data) => (await api.post('/companies', data)).data,
  listar: async () => (await api.get('/companies')).data,
  obtenerPorId: async (id) => (await api.get(`/companies/${id}`)).data,
  actualizar: async (id, data) => (await api.put(`/companies/${id}`, data)).data,
  cambiarEstado: async (id, status) => (await api.put(`/companies/${id}/status`, { status })).data,
};

export const eventService = {
  crear: async (data) => (await api.post('/events', data)).data,
  listarPorCompany: async (status) => (await api.get('/events', { params: { status } })).data,
  obtenerPorId: async (id) => (await api.get(`/events/${id}`)).data,
  actualizar: async (id, data) => (await api.put(`/events/${id}`, data)).data,
  cambiarEstado: async (id, status) => (await api.put(`/events/${id}/status`, { status })).data,
  dashboard: async () => (await api.get('/events/dashboard')).data,
  listarPublicados: async (params) => (await api.get('/events/public', { params })).data,
  obtenerPorSlug: async (slug) => (await api.get(`/events/public/${slug}`)).data,
  crearTicketType: async (eventId, data) => (await api.post(`/events/${eventId}/ticket-types`, data)).data,
  listarTicketTypes: async (eventId) => (await api.get(`/events/${eventId}/ticket-types`)).data,
};

export const orderService = {
  crear: async (data) => (await api.post('/orders', data)).data,
  listarPorUser: async () => (await api.get('/orders/my')).data,
  obtenerPorId: async (id) => (await api.get(`/orders/${id}`)).data,
  listarPorEvent: async (eventId) => (await api.get(`/orders/event/${eventId}`)).data,
  contarPorEvent: async (eventId) => (await api.get(`/orders/event/${eventId}/stats`)).data,
  cancelar: async (id) => (await api.post(`/orders/${id}/cancel`)).data,
};

export const ticketService = {
  listarPorUser: async () => (await api.get('/tickets/my')).data,
  obtenerPorCode: async (code) => (await api.get(`/tickets/${code}`)).data,
  checkIn: async (code) => (await api.post('/tickets/checkin', { code })).data,
  descargarPdf: async (code) => {
    const response = await api.get(`/tickets/${code}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `entrada-${code.slice(0, 8)}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default api;
