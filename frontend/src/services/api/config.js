import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
});

// Interceptor para requests
instance.interceptors.request.use(
  (config) => {
    // Asegurarse de que las URLs terminan con '/'
    if (!config.url.endsWith('/')) {
      config.url = `${config.url}/`;
    }
    
    console.log('Request:', {
      method: config.method,
      url: config.url, 
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
instance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    // Mejorar el manejo de errores específicos
    if (error.response?.status === 405) {
      console.error('Método HTTP no permitido');
    }
    
    console.error('Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });
    return Promise.reject(error);
  }
);

export default instance;