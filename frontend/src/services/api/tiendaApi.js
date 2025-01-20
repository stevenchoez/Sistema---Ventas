import axios from '../../config/axios';

const tiendaApi = {
  getAll: () => axios.get('/tiendas'),
  getById: (id) => axios.get(`/tiendas/${id}`),
  create: (data) => axios.post('/tiendas', data),
  update: (id, data) => axios.put(`/tiendas/${id}`, data),
  delete: (id) => axios.delete(`/tiendas/${id}`),
  getCount: () => axios.get('/tiendas/count'),
};

export default tiendaApi;
