import Keycloak from 'keycloak-js';

/**
 * Single Keycloak instance shared across the app.
 * All configuration is centralised here – change realm / clientId
 * in one place without touching AuthContext.
 */
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export default keycloak;