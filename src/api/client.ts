import axios from 'axios';
import keycloak from '../auth/keycloak';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the Keycloak Bearer token to every request.
// If the token will expire within 30 s, refresh it first.
apiClient.interceptors.request.use(async (config) => {
  if (keycloak.authenticated) {
    try {
      // Refresh token if it expires within 30 seconds
      await keycloak.updateToken(30);
    } catch {
      // If refresh fails the current (possibly expired) token is still sent;
      // the 401 response guard below will handle it.
      console.warn('[apiClient] Token refresh failed');
    }
    if (keycloak.token) {
      config.headers['Authorization'] = `Bearer ${keycloak.token}`;
    }
  }
  return config;
});

// Global response error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && keycloak.authenticated) {
      console.warn('[apiClient] 401 Unauthorized – token may be expired. Logging out.');
      keycloak.logout();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
