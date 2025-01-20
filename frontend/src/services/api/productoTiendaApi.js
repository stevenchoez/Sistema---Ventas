import axios from '../../config/axios';

const productoTiendaApi = {
  getByTienda: (tiendaId) => axios.get(`/productos-tienda/tienda/${tiendaId}`),
  getByProducto: (productoId) => axios.get(`/productos-tienda/producto/${productoId}`),
  asignarProducto: (data) => axios.post('/productos-tienda', data),
  actualizarStock: (tiendaId, productoId, cantidad) => 
    axios.put(`/productos-tienda/${tiendaId}/${productoId}/stock`, { cantidad }),
  eliminarProducto: (tiendaId, productoId) => 
    axios.delete(`/productos-tienda/${tiendaId}/${productoId}`),
  getStockBajo: () => axios.get('/productos-tienda/stock-bajo'),
};

export default productoTiendaApi;
