import axios from '../../config/axios';

const clienteApi = {
  getAll: () => axios.get('/clientes'),
  getById: (id) => axios.get(`/clientes/${id}`),
  create: (data) => axios.post('/clientes', data),
  update: (id, data) => axios.put(`/clientes/${id}`, data),
  delete: (id) => axios.delete(`/clientes/${id}`),
  getCount: () => axios.get('/clientes/count'),
};

export default clienteApi;
