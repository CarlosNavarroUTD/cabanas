import axios from '../api/config';
import TokenService from './tokenService';


class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post('/api/token/', { email, password });
      
      // Save tokens and user type
      TokenService.saveTokens(
        response.data.access, 
        response.data.refresh, 
        response.data.tipo_usuario  // Ensure backend sends this
      );
      
      // Get and return user info
      const userResponse = await this.getCurrentUser();
      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    TokenService.removeTokens();
  }

  async getCurrentUser() {
    try {
      const accessToken = TokenService.getAccessToken();
      if (!accessToken) {
        return null;
      }
  
      const response = await axios.get('/api/usuarios/me/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      console.log('Full Response from /api/usuarios/me/:', response.data);
      
      // Explicitly log the structure of the response
      console.log('Arrendador Info Structure:', {
        arrendadorInfo: response.data.arrendador_info,
        idArrendador: response.data.arrendador_info?.id_arrendador,
        idArrendador2: response.data.arrendador_info?.arrendador_id
      });
  
      const userData = {
        ...response.data,
        // Try multiple possible paths to get arrendador_id
        arrendador_id: 
          response.data.arrendador_info?.id_arrendador || 
          response.data.arrendador_info?.arrendador_id || 
          response.data.id_arrendador || 
          null
      };
  
      console.log('Constructed User Data:', userData);
  
      return userData;
    } catch (error) {
      console.error('Detailed error in getCurrentUser:', error.response?.data || error.message);
      throw error;
    }
  }

  async register(registrationData) {
    try {
      const response = await axios.post('/api/usuarios/register/', registrationData);
      
      // Save tokens and user type from registration response
      if (response.data.access && response.data.refresh) {
        TokenService.saveTokens(
          response.data.access, 
          response.data.refresh, 
          response.data.user.tipo_usuario  // Adjust based on your backend response
        );
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration Error:', error.response?.data);
      throw error;
    }
  } 
}

// Export an instance of the class directly
export default new AuthService();