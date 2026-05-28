import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import keycloak from '../auth/keycloak';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  authError: string | null;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  authError: null,
  logout: () => {},
  hasRole: () => false,
});

// ─── Required realm-level role for this app ───────────────────────────────────
const REQUIRED_ROLES = ['SUPER_ADMIN', 'admin', 'COACH', 'CLIENT', 'STUDENT', 'default-roles-chess'];

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [loading, setLoading]   = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Guard against React StrictMode double-invocation
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    console.log('[Auth] Initialising Keycloak...');

    keycloak
      .init({
        onLoad: 'login-required',   // redirects to KC login if not authenticated
        checkLoginIframe: false,    // prevents iframe-based silent checks (avoids CORS issues)
        pkceMethod: 'S256',         // recommended security enhancement
      })
      .then((authenticated) => {
        if (!authenticated) {
          console.warn('[Auth] Keycloak init returned false – not authenticated.');
          setAuthError('Authentication failed. Please try again.');
          setLoading(false);
          return;
        }

        const { tokenParsed } = keycloak;

        if (!tokenParsed) {
          setAuthError('Token missing after authentication.');
          setLoading(false);
          return;
        }

        // ── Extract realm roles ──
        const realmRoles: string[] = tokenParsed.realm_access?.roles ?? [];
        console.log('[Auth] Realm roles:', realmRoles);

        // ── Gate: user must have at least one allowed role ──
        const hasAllowedRole = REQUIRED_ROLES.some((r) => realmRoles.includes(r));
        if (!hasAllowedRole) {
          const msg = `Access denied. Your account lacks the required roles (${REQUIRED_ROLES.join(', ')}). Found: [${realmRoles.join(', ')}]`;
          console.error('[Auth]', msg);
          setAuthError(msg);
          setLoading(false);
          return;
        }

        const authedUser: AuthUser = {
          id:     tokenParsed.sub ?? '',
          name:   tokenParsed.name ?? tokenParsed.preferred_username ?? 'Unknown',
          email:  tokenParsed.email ?? '',
          roles:  realmRoles,
          token:  keycloak.token ?? '',
        };

        setUser(authedUser);
        setLoading(false);

        // ── Auto-refresh token 60 s before expiry ──
        keycloak.onTokenExpired = () => {
          console.log('[Auth] Token expired – refreshing...');
          keycloak.updateToken(70).catch(() => {
            console.warn('[Auth] Token refresh failed – logging out.');
            keycloak.logout();
          });
        };

        // Keep the in-memory token fresh on each successful refresh
        keycloak.onAuthRefreshSuccess = () => {
          setUser((prev) =>
            prev ? { ...prev, token: keycloak.token ?? prev.token } : prev
          );
        };
      })
      .catch((err) => {
        console.error('[Auth] Keycloak init error:', err);
        setAuthError('Failed to connect to authentication server. Check network/CORS.');
        setLoading(false);
      });
  }, []);

  // ── Logout: redirect to KC logout endpoint then back to app root ──
  const logout = () => {
    keycloak.logout({ redirectUri: `${window.location.origin}/` });
  };

  const hasRole = (role: string) => user?.roles.includes(role) ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, authError, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => useContext(AuthContext);
