import axios from '../api/config';
import TokenService from '../auth/tokenService';

class CabinService {
  constructor() {
    this.getAuthHeader = () => ({
      'Authorization': `Bearer ${TokenService.getAccessToken()}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  async authenticatedRequest(requestFn) {
    try {
      return await requestFn();
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const newToken = await TokenService.refreshAccessToken();
          const newHeaders = { 
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          };
          return await requestFn(newHeaders);
        } catch (refreshError) {
          TokenService.removeTokens();
          throw refreshError;
        }
      }
      throw error;
    }
  }

  formatCabinData(cabinData) {
    // Asegurarse de que los datos estén en el formato correcto
    const formattedData = {
      nombre: String(cabinData.nombre).trim(),
      descripcion: String(cabinData.descripcion).trim(),
      capacidad: parseInt(cabinData.capacidad) || 1,
      costo_por_noche: parseFloat(cabinData.costo_por_noche) || 0,
      ubicacion: cabinData.ubicacion,
      servicios: Array.isArray(cabinData.servicios) ? cabinData.servicios : [],
      es_destacada: Boolean(cabinData.es_destacada)
    };

    // Validación básica
    if (!formattedData.nombre) {
      throw new Error('El nombre es requerido');
    }
    if (!formattedData.ubicacion) {
      throw new Error('La ubicación es requerida');
    }

    return formattedData;
  }

  async createCabin(cabinData) {
    try {
      const formattedData = this.formatCabinData(cabinData);
      console.log('Sending request to create cabin:', {
        url: '/api/cabanas/cabanas',
        method: 'POST',
        data: formattedData
      });
      
      const accessToken = TokenService.getAccessToken();
      const response = await axios({
        method: 'POST',
        url: '/api/cabanas/cabanas',
        data: formattedData,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Create cabin error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // If it's an authentication error, try refreshing the token
      if (error.response?.status === 401) {
        try {
          // Move formattedData outside the try block to ensure it's defined
          const formattedData = this.formatCabinData(cabinData);
          
          const newAccessToken = await TokenService.refreshAccessToken();
          const response = await axios({
            method: 'POST',
            url: '/api/cabanas/cabanas',
            data: formattedData,
            headers: {
              'Authorization': `Bearer ${newAccessToken}`,
              'Content-Type': 'application/json',
            }
          });
          return response.data;
        } catch (refreshError) {
          TokenService.removeTokens();
          throw refreshError;
        }
      }
      
      // If it's a 405 error, provide a more specific message
      if (error.response?.status === 405) {
        throw new Error('El método de creación no está disponible en este momento. Por favor, contacte al administrador.');
      }
      
      throw error;
    }
  }  
  async createUbicacion(ubicacionData) {
    return this.authenticatedRequest(async (headers = this.getAuthHeader()) => {
      try {
        const response = await axios.post('/api/cabanas/ubicaciones/', ubicacionData, { 
          headers,
          validateStatus: (status) => status >= 200 && status < 300
        });
        return response.data;
      } catch (error) {
        console.error('Create ubicacion error:', error.response?.data || error.message);
        throw error;
      }
    });
  }
  
  async getUbicaciones() {
    const response = await axios.get('/api/cabanas/ubicaciones/');
    return response.data;
  }


  async getServicios() {
    return this.authenticatedRequest(async (headers = this.getAuthHeader()) => {
      try {
        const response = await axios.get('/api/cabanas/servicios/', { headers });
        console.log('Servicios recibidos:', response.data);  // Para debug
        return response.data;
      } catch (error) {
        console.error('Get servicios error:', error.response?.data || error.message);
        throw error;
      }
    });
  }



  async getCabins() {
    return this.authenticatedRequest(async (headers = this.getAuthHeader()) => {
      try {
        const response = await axios.get('/api/cabanas/cabanas/', { headers });
        return response.data; // Esto devolverá el objeto completo con count, next, previous y results
      } catch (error) {
        console.error('Get cabins error:', error.response?.data || error.message);
        return { results: [] }; // Proporcionamos un valor por defecto en caso de error
      }
    });
  }
  
  async getCabinById(id) {
    return this.authenticatedRequest(async (headers = this.getAuthHeader()) => {
      const response = await axios.get(`/api/cabanas/${id}/`, { headers });
      return response.data;
    });
  }

  async updateCabin(id, cabinData) {
    return this.authenticatedRequest(async (headers = this.getAuthHeader()) => {
      const response = await axios.put(`/api/cabanas/${id}/`, cabinData, { headers });
      return response.data;
    });
  }

  async deleteCabin(id) {
    return this.authenticatedRequest(async (headers = this.getAuthHeader()) => {
      await axios.delete(`/api/cabanas/${id}/`, { headers });
      return true;
    });
  }
}

export default new CabinService();