/**
 * API Base URL configuration
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * API service for making HTTP requests to the backend
 */
class ApiService {
  /**
   * Generic fetch wrapper with error handling
   */
  async fetch(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText} (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Fetch all projects
   */
  async getProjects() {
    return this.fetch('/projects');
  }

  /**
   * Fetch a specific run by ID
   */
  async getRun(runId) {
    return this.fetch(`/runs/${runId}`);
  }

  /**
   * Fetch multiple runs by IDs
   */
  async getRunsByIds(runIds) {
    const requests = runIds.map(id => this.getRun(id));
    return Promise.all(requests);
  }
}

// Export singleton instance
export const api = new ApiService();
