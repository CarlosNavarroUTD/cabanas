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
      return response.data;
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
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Create a new activity
  async createActivity(activityData) {
    try {
      const response = await axios.post('api/actividades/', activityData, {
        headers: {
          'Authorization': `Bearer ${TokenService.getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update an existing activity
  async updateActivity(id, activityData) {
    try {
      const response = await axios.put(`api/actividades/${id}/`, activityData, {
        headers: {
          'Authorization': `Bearer ${TokenService.getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Partially update an activity
  async patchActivity(id, activityData) {
    try {
      const response = await axios.patch(`api/actividades/${id}/`, activityData, {
        headers: {
          'Authorization': `Bearer ${TokenService.getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Delete an activity
  async deleteActivity(id) {
    try {
      const response = await axios.delete(`api/actividades/${id}/`, {
        headers: {
          'Authorization': `Bearer ${TokenService.getAccessToken()}`
        }
      });
      return response.data;
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