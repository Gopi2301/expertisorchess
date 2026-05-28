import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { CoachesList } from './pages/coaches/CoachesList';
import { ClientsList } from './pages/clients/ClientsList';
import { StudentsList } from './pages/students/StudentsList';
import { ClassesList } from './pages/classes/ClassesList';
import { ClassDetails } from './pages/classes/ClassDetails';
import { PlansList } from './pages/plans/PlansList';
import { BatchesList } from './pages/batches/BatchesList';
import { SyllabusList } from './pages/syllabus/SyllabusList';
import { SyllabusDetails } from './pages/syllabus/SyllabusDetails';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { AdminPanel } from './pages/admin/AdminPanel';
import { CoachOnboarding } from './pages/public/CoachOnboarding';
import { CoachProfile } from './pages/coaches/CoachProfile';
import { ShieldX, RefreshCw, LogOut } from 'lucide-react';

// ─── Auth Gate ────────────────────────────────────────────────────────────────
const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading, authError, user, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-bg-brand border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted text-sm">Loading application…</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-bg-strong border border-error-strong/30 rounded-2xl p-8 text-center space-y-5">
          <div className="w-14 h-14 bg-bg-error rounded-full flex items-center justify-center mx-auto">
            <ShieldX size={28} className="text-error-strong" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Access Denied</h1>
            <p className="text-sm text-text-muted mt-1">You don't have permission to access this application.</p>
          </div>
          <div className="bg-bg-error/30 border border-error-strong/20 rounded-xl p-4 text-left">
            <p className="text-xs font-mono text-error-strong break-words">{authError}</p>
          </div>
          <p className="text-xs text-text-muted">
            Check the browser console (<kbd className="bg-bg-elevated px-1 rounded">F12</kbd>) for full debug details.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-elevated border border-border text-text-secondary text-sm hover:bg-bg-strong transition-colors"
            >
              <RefreshCw size={14} /> Retry
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-error border border-error-strong/30 text-error-strong text-sm hover:opacity-80 transition-opacity"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted text-sm">Authenticating…</p>
      </div>
    );
  }

  return <>{children}</>;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { hasRole, loading } = useAuth();
  if (loading) return null;
  if (roles && !roles.some(role => hasRole(role))) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

// ─── Protected App (requires auth) ────────────────────────────────────────────
const ProtectedApp: React.FC = () => (
  <AuthProvider>
    <AuthGate>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/"           element={<Navigate to="/admin" replace />} />
          <Route path="/admin"      element={<Dashboard />} />
          <Route path="/admin/system" element={<ProtectedRoute roles={['SUPER_ADMIN']}><AdminPanel /></ProtectedRoute>} />
          <Route path="/coaches"    element={<ProtectedRoute roles={['SUPER_ADMIN']}><CoachesList /></ProtectedRoute>} />
          <Route path="/clients"    element={<ProtectedRoute roles={['SUPER_ADMIN']}><ClientsList /></ProtectedRoute>} />
          <Route path="/students"   element={<ProtectedRoute roles={['COACH', 'SUPER_ADMIN']}><StudentsList /></ProtectedRoute>} />
          <Route path="/classes"    element={<ProtectedRoute roles={['COACH', 'SUPER_ADMIN']}><ClassesList /></ProtectedRoute>} />
          <Route path="/classes/:id" element={<ProtectedRoute roles={['COACH', 'SUPER_ADMIN']}><ClassDetails /></ProtectedRoute>} />
          <Route path="/plans"      element={<ProtectedRoute roles={['SUPER_ADMIN']}><PlansList /></ProtectedRoute>} />
          <Route path="/batches"    element={<ProtectedRoute roles={['COACH', 'SUPER_ADMIN']}><BatchesList /></ProtectedRoute>} />
          <Route path="/syllabus"   element={<ProtectedRoute roles={['COACH', 'SUPER_ADMIN']}><SyllabusList /></ProtectedRoute>} />
          <Route path="/syllabus/:id" element={<ProtectedRoute roles={['COACH', 'SUPER_ADMIN']}><SyllabusDetails /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute roles={['COACH', 'SUPER_ADMIN']}><AttendancePage /></ProtectedRoute>} />
          <Route path="/profile"    element={<CoachProfile />} />
        </Route>
      </Routes>
    </AuthGate>
  </AuthProvider>
);

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes (no Keycloak login required) ── */}
        <Route path="/coach-apply" element={<CoachOnboarding />} />

        {/* ── All other routes require authentication ── */}
        <Route path="/*" element={<ProtectedApp />} />
      </Routes>
    </BrowserRouter>
  );
}
