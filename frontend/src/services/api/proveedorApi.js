import axios from '../../config/axios';

const proveedorApi = {
  getAll: () => axios.get('/proveedores'),
  getById: (id) => axios.get(`/proveedores/${id}`),
  create: (data) => axios.post('/proveedores', data),
  update: (id, data) => axios.put(`/proveedores/${id}`, data),
  delete: (id) => axios.delete(`/proveedores/${id}`),
  getByTipoProducto: (tipo) => axios.get(`/proveedores/tipo/${tipo}`),
};

export default proveedorApi;
