import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return {
        ...response,
        data: response.data
      };
    }
    return {
      ...response,
      data: {
        data: response.data,
        success: true,
        message: 'Operación exitosa'
      }
    };
  },
  (error) => {
    if (error.response) {
      console.error('Error de respuesta:', error.response.data);
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: error.response.data || {
            data: null,
            success: false,
            message: 'Error interno del servidor'
          }
        }
      });
    } else if (error.request) {
      console.error('Error de conexión:', error.request);
      return Promise.reject({
        ...error,
        response: {
          data: {
            data: null,
            success: false,
            message: 'Error de conexión con el servidor'
          }
        }
      });
    } else {
      console.error('Error:', error.message);
      return Promise.reject({
        ...error,
        response: {
          data: {
            data: null,
            success: false,
            message: `Error: ${error.message}`
          }
        }
      });
    }
  }
);

export default axiosInstance;
