import Keycloak from 'keycloak-js';

/**
 * Single Keycloak instance shared across the app.
 * All configuration is centralised here – change realm / clientId
 * in one place without touching AuthContext.
 */
const keycloak = new Keycloak({
  url: 'https://keycloak.virtuagrid.com/',
  realm: 'chess',
  clientId: 'chess-frontend',
});

export default keycloak;
