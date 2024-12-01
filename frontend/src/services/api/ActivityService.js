import axios from '../api/config';
import TokenService from '../auth/tokenService';

class ActivityService {
  // Get all activities
  async getActivities(params = {}) {
    try {
      const response = await axios.get('api/actividades/', { 
        params,
        headers: {
          'Authorization': `Bearer ${TokenService.getAccessToken()}`
        }
      });
      return {
        results: response.data.map(activity => ({
          id: activity.id,
          name: activity.nombre,
          description: activity.descripcion,
          cost: activity.costo,
          arrendador: activity.arrendador,
          // Add extra fields if needed
          duration: null, // Add from your actual data model if available
          location: null  // Add from your actual data model if available
        })),
        total: response.data.length
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get a single activity by ID
  async getActivityById(id) {
    try {
      const response = await axios.get(`api/actividades/${id}/`, {
        headers: {
          'Authorization': `Bearer ${TokenService.getAccessToken()}`
        }
      });
      return {
        id: response.data.id,
        name: response.data.nombre,
        description: response.data.descripcion,
        cost: response.data.costo,
        arrendador: response.data.arrendador
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  // Create a new activity
  async createActivity(activityData) {
    try {
      const payload = {
        nombre: activityData.name,
        descripcion: activityData.description,
        costo: activityData.cost
      };

      const response = await axios.post('api/actividades/', payload, {
        headers: {
          'Authorization': `Bearer ${TokenService.getAccessToken()}`
        }
      });
      return {
        id: response.data.id,
        name: response.data.nombre,
        description: response.data.descripcion,
        cost: response.data.costo
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update an existing activity
  async updateActivity(id, activityData) {
    try {
      const payload = {
        nombre: activityData.name,
        descripcion: activityData.description,
        costo: activityData.cost
      };

      const response = await axios.put(`api/actividades/${id}/`, payload, {
        headers: {
          'Authorization': `Bearer ${TokenService.getAccessToken()}`
        }
      });
      return {
        id: response.data.id,
        name: response.data.nombre,
        description: response.data.descripcion,
        cost: response.data.costo
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  // Delete an activity
  async deleteActivity(id) {
    try {
      await axios.delete(`api/actividades/${id}/`, {
        headers: {
          'Authorization': `Bearer ${TokenService.getAccessToken()}`
        }
      });
      return true;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Error handling method
  handleError(error) {
    // If token is invalid or expired, attempt to refresh token
    if (error.response && (error.response.status === 401)) {
      try {
        TokenService.refreshAccessToken();
        throw error; // Rethrow to be handled by the caller
      } catch (refreshError) {
        // If refresh fails, remove tokens and redirect to login
        TokenService.removeTokens();
        window.location.href = '/login';
      }
    }

    // Log the error
    console.error('Activity Service Error:', error.response ? error.response.data : error.message);

    // Throw error to be handled by the caller
    throw error;
  }
}

export default new ActivityService();