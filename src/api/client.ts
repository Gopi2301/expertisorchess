import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Keycloak interceptors removed. 
// If a new auth system is added, attach tokens here.

// Unwrap the standard { success, data } envelope
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/403 or other global errors here if needed
    return Promise.reject(error);
  },
);

export default apiClient;
