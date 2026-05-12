import React, { createContext, useContext, useEffect, useState } from 'react';

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

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  authError: null,
  logout: () => {},
  hasRole: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Mock authentication - auto-login as admin
    console.log('[Auth] Mock authentication active (Keycloak removed)');
    
    setUser({
      id: 'mock-admin-id',
      name: 'Admin User',
      email: 'admin@chessacademy.com',
      roles: ['SUPER_ADMIN'],
      token: 'mock-token',
    });
    
    setLoading(false);
  }, []);

  const logout = () => {
    console.log('[Auth] Mock logout...');
    setUser(null);
    // In a real scenario without Keycloak, you'd redirect to a local login page
  };

  const hasRole = (role: string) => user?.roles.includes(role) ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, authError, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
