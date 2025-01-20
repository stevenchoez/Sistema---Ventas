import axios from '../../config/axios';

const productoApi = {
  getAll: () => axios.get('/productos'),
  getById: (id) => axios.get(`/productos/${id}`),
  create: (data) => axios.post('/productos', data),
  update: (id, data) => axios.put(`/productos/${id}`, data),
  delete: (id) => axios.delete(`/productos/${id}`),
  getByCategoria: (categoria) => axios.get(`/productos/categoria/${categoria}`),
};

export default productoApi;
