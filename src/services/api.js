// API service for communicating with the FastAPI backend
const API_BASE_URL = 'http://localhost:8000'; // Update this to match your FastAPI server URL

export const apiService = {
  // Get project state
  async getProjectState(projectId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/state`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching project state:', error);
      throw error;
    }
  },

  // Update project state
  async updateProjectState(projectId, state) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}/state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating project state:', error);
      throw error;
    }
  },

  // Check if backend is running
  async checkBackendStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking backend status:', error);
      throw error;
    }
  }
}; 