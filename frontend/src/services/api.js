import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleApiError = (error) => {
  if (error.response) {
    throw error;
  } else if (error.request) {
    throw new Error('No se recibió respuesta del servidor');
  } else {
    throw new Error('Error al realizar la petición');
  }
};

const cleanCircularReferences = (obj) => {
  if (!obj) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(cleanCircularReferences);
  }
  
  if (typeof obj !== 'object') {
    return obj;
  }
  
  const newObj = {};
  
  // Para productos
  if (obj.id && obj.nombre && obj.codigo) {
    return {
      id: obj.id,
      nombre: obj.nombre,
      descripcion: obj.descripcion,
      precio: obj.precio,
      codigo: obj.codigo,
      marca: obj.marca,
      categoria: obj.categoria,
      stock: obj.stock
    };
  }
  
  // Para tiendas
  if (obj.id && obj.nombre && obj.direccion) {
    return {
      id: obj.id,
      nombre: obj.nombre,
      direccion: obj.direccion,
      telefono: obj.telefono,
      email: obj.email,
      administrador: obj.administrador
    };
  }
  
  // Para productoTienda
  if (obj.id && obj.cantidad) {
    return {
      id: obj.id,
      cantidad: obj.cantidad,
      tiendaId: obj.tienda?.id,
      productoId: obj.producto?.id
    };
  }
  
  return obj;
};

export const clienteApi = {
  getAll: async () => {
    try {
      const response = await api.get('/clientes');
      return response;
    } catch (error) {
      console.error('Error en getAll clientes:', error);
      handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response;
    } catch (error) {
      console.error('Error en getById clientes:', error);
      handleApiError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/clientes', data);
      return response;
    } catch (error) {
      console.error('Error en create clientes:', error);
      handleApiError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/clientes/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error en update clientes:', error);
      handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/clientes/${id}`);
      return response;
    } catch (error) {
      console.error('Error en delete clientes:', error);
      handleApiError(error);
    }
  },
};

export const productoApi = {
  getAll: async () => {
    try {
      const response = await api.get('/productos');
      return response;
    } catch (error) {
      console.error('Error en getAll productos:', error);
      handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response;
    } catch (error) {
      console.error('Error en getById productos:', error);
      handleApiError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/productos', data);
      return response;
    } catch (error) {
      console.error('Error en create productos:', error);
      handleApiError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/productos/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error en update productos:', error);
      handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response;
    } catch (error) {
      console.error('Error en delete productos:', error);
      handleApiError(error);
    }
  },
  updateStock: async (id, stock) => {
    try {
      const response = await api.put(`/productos/${id}/stock`, { stock });
      return response;
    } catch (error) {
      console.error('Error en updateStock productos:', error);
      handleApiError(error);
    }
  }
};

export const proveedorApi = {
  getAll: async () => {
    try {
      const response = await api.get('/proveedores');
      return response;
    } catch (error) {
      console.error('Error en getAll proveedores:', error);
      handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/proveedores/${id}`);
      return response;
    } catch (error) {
      console.error('Error en getById proveedores:', error);
      handleApiError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/proveedores', data);
      return response;
    } catch (error) {
      console.error('Error en create proveedores:', error);
      handleApiError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/proveedores/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error en update proveedores:', error);
      handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/proveedores/${id}`);
      return response;
    } catch (error) {
      console.error('Error en delete proveedores:', error);
      handleApiError(error);
    }
  },
};

export const tiendaApi = {
  getAll: async () => {
    try {
      const response = await api.get('/tiendas');
      return response;
    } catch (error) {
      console.error('Error en getAll tiendas:', error);
      handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/tiendas/${id}`);
      return response;
    } catch (error) {
      console.error('Error en getById tiendas:', error);
      handleApiError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/tiendas', data);
      return response;
    } catch (error) {
      console.error('Error en create tiendas:', error);
      handleApiError(error);
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/tiendas/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error en update tiendas:', error);
      handleApiError(error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/tiendas/${id}`);
      return response;
    } catch (error) {
      console.error('Error en delete tiendas:', error);
      handleApiError(error);
    }
  },
};

export const productoTiendaApi = {
  getAll: async () => {
    try {
      const response = await api.get('/productos-tienda');
      return response;
    } catch (error) {
      console.error('Error en getAll productos-tienda:', error);
      handleApiError(error);
    }
  },
  getByTienda: async (tiendaId) => {
    try {
      const response = await api.get(`/productos-tienda/tienda/${tiendaId}`);
      return response;
    } catch (error) {
      console.error('Error en getByTienda:', error);
      handleApiError(error);
    }
  },
  asignarProducto: async (data) => {
    try {
      const response = await api.post('/productos-tienda', data);
      return response;
    } catch (error) {
      console.error('Error en asignarProducto:', error);
      handleApiError(error);
    }
  },
  actualizarStock: async (tiendaId, productoId, cantidad) => {
    try {
      const response = await api.put(`/productos-tienda/${tiendaId}/${productoId}?cantidad=${cantidad}`);
      return response;
    } catch (error) {
      console.error('Error en actualizarStock:', error);
      handleApiError(error);
    }
  },
  eliminarProducto: async (tiendaId, productoId) => {
    try {
      const response = await api.delete(`/productos-tienda/${tiendaId}/${productoId}`);
      return response;
    } catch (error) {
      console.error('Error en eliminarProducto:', error);
      handleApiError(error);
    }
  },
  getProductosBajoStock: async (tiendaId, stockMinimo = 10) => {
    try {
      const response = await api.get(`/productos-tienda/${tiendaId}/bajo-stock?stockMinimo=${stockMinimo}`);
      return response;
    } catch (error) {
      console.error('Error en getProductosBajoStock:', error);
      handleApiError(error);
    }
  }
};

export const ventaApi = {
  getAll: async () => {
    try {
      const response = await api.get('/ventas');
      return response;
    } catch (error) {
      console.error('Error en getAll ventas:', error);
      handleApiError(error);
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/ventas/${id}`);
      return response;
    } catch (error) {
      console.error('Error en getById ventas:', error);
      handleApiError(error);
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/ventas', data);
      return response;
    } catch (error) {
      console.error('Error en create ventas:', error);
      handleApiError(error);
    }
  },
  getVentasPorFecha: async (fechaInicio, fechaFin) => {
    try {
      const response = await api.get(`/ventas/por-fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
      return response;
    } catch (error) {
      console.error('Error en getVentasPorFecha:', error);
      handleApiError(error);
    }
  },
  getVentasPorTienda: async (tiendaId) => {
    try {
      const response = await api.get(`/ventas/por-tienda/${tiendaId}`);
      return response;
    } catch (error) {
      console.error('Error en getVentasPorTienda:', error);
      handleApiError(error);
    }
  },
};

export default api;
