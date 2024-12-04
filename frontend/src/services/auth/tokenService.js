import axios from '../api/config';

class TokenService {
  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  getUserType() {
    return localStorage.getItem('userType');
  }

  saveTokens(accessToken, refreshToken, userType = null) {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (userType !== null) localStorage.setItem('userType', userType);
  }

  removeTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userType');
  }

  async refreshAccessToken() {
    try {
      const response = await axios.post('/api/token/refresh/', {
        refresh: this.getRefreshToken(),
      });
      this.saveTokens(
        response.data.access, 
        response.data.refresh, 
        response.data.user_type // Assuming the backend returns user type
      );
      return response.data.access;
    } catch (error) {
      this.removeTokens();
      throw error;
    }
  }

  isAdmin() {
    const userType = this.getUserType();
    console.log('Checking admin status:', {
      userType,
      isAdmin: userType === 'admin' || userType === 'arrendador'
    });
    return userType === 'admin' || userType === 'arrendador';
  }
}

export default new TokenService();