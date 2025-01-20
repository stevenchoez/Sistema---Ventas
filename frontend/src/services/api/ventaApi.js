import axios from '../../config/axios';

const ventaApi = {
  getAll: () => axios.get('/ventas'),
  getById: (id) => axios.get(`/ventas/${id}`),
  create: (data) => axios.post('/ventas', data),
  getByTienda: (tiendaId) => axios.get(`/ventas/tienda/${tiendaId}`),
  getByCliente: (clienteId) => axios.get(`/ventas/cliente/${clienteId}`),
  getStats: () => axios.get('/ventas/stats'),
  getVentasPorCategoria: () => axios.get('/ventas/por-categoria'),
  getVentasPorTienda: () => axios.get('/ventas/por-tienda'),
  getVentasPorMes: () => axios.get('/ventas/por-mes'),
};

export default ventaApi;
