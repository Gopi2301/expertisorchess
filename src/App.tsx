import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { CoachesList } from './pages/coaches/CoachesList';
import { ClientsList } from './pages/clients/ClientsList';
import { StudentsList } from './pages/students/StudentsList';
import { ClassesList } from './pages/classes/ClassesList';
import { ClassDetails } from './pages/classes/ClassDetails';
import { AdminCalendar } from './pages/classes/AdminCalendar';
import { CoachCalendar } from './pages/classes/CoachCalendar';
import { StudentCalendar } from './pages/classes/StudentCalendar';
import { PlansList } from './pages/plans/PlansList';
import { BatchesList } from './pages/batches/BatchesList';
import { SyllabusList } from './pages/syllabus/SyllabusList';
import { SyllabusDetails } from './pages/syllabus/SyllabusDetails';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { AdminPanel } from './pages/admin/AdminPanel';
import { CoachOnboarding } from './pages/public/CoachOnboarding';
import { ClientOnboarding } from './pages/public/ClientOnboarding';
import { StudentOnboarding } from './pages/public/StudentOnboarding';
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

import { RoleRedirect } from './components/layout/RoleRedirect';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CoachDashboard } from './pages/coaches/CoachDashboard';
import { ClientDashboard } from './pages/clients/ClientDashboard';
import { StudentDashboard } from './pages/students/StudentDashboard';

import { ClientCalendar } from './pages/clients/ClientCalendar';
import { ClientStudentDetails } from './pages/clients/ClientStudentDetails';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { hasRole, loading } = useAuth();
  if (loading) return null;
  if (roles && !roles.some(role => hasRole(role))) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// ─── Protected App (requires auth) ────────────────────────────────────────────
const ProtectedApp: React.FC = () => (
  <AuthProvider>
    <AuthGate>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Root Redirector */}
          <Route path="/" element={<RoleRedirect />} />

          {/* SUPER_ADMIN Routes */}
          <Route path="/admin" element={<ProtectedRoute roles={['SUPER_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/system" element={<ProtectedRoute roles={['SUPER_ADMIN']}><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin/coaches" element={<ProtectedRoute roles={['SUPER_ADMIN']}><CoachesList /></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute roles={['SUPER_ADMIN']}><ClientsList /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute roles={['SUPER_ADMIN']}><StudentsList /></ProtectedRoute>} />
          <Route path="/admin/classes" element={<ProtectedRoute roles={['SUPER_ADMIN']}><ClassesList /></ProtectedRoute>} />
          <Route path="/admin/classes/:id" element={<ProtectedRoute roles={['SUPER_ADMIN']}><ClassDetails /></ProtectedRoute>} />
          <Route path="/admin/calendar" element={<ProtectedRoute roles={['SUPER_ADMIN']}><AdminCalendar /></ProtectedRoute>} />
          <Route path="/admin/plans" element={<ProtectedRoute roles={['SUPER_ADMIN']}><PlansList /></ProtectedRoute>} />
          <Route path="/admin/batches" element={<ProtectedRoute roles={['SUPER_ADMIN']}><BatchesList /></ProtectedRoute>} />
          <Route path="/admin/syllabus" element={<ProtectedRoute roles={['SUPER_ADMIN']}><SyllabusList /></ProtectedRoute>} />
          <Route path="/admin/syllabus/:id" element={<ProtectedRoute roles={['SUPER_ADMIN']}><SyllabusDetails /></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute roles={['SUPER_ADMIN']}><AttendancePage /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute roles={['SUPER_ADMIN']}><CoachProfile /></ProtectedRoute>} />

          {/* COACH Routes */}
          <Route path="/coach" element={<ProtectedRoute roles={['COACH']}><CoachDashboard /></ProtectedRoute>} />
          <Route path="/coach/students" element={<ProtectedRoute roles={['COACH']}><StudentsList /></ProtectedRoute>} />
          <Route path="/coach/classes" element={<ProtectedRoute roles={['COACH']}><ClassesList /></ProtectedRoute>} />
          <Route path="/coach/classes/:id" element={<ProtectedRoute roles={['COACH']}><ClassDetails /></ProtectedRoute>} />
          <Route path="/coach/calendar" element={<ProtectedRoute roles={['COACH']}><CoachCalendar /></ProtectedRoute>} />
          <Route path="/coach/batches" element={<ProtectedRoute roles={['COACH']}><BatchesList /></ProtectedRoute>} />
          <Route path="/coach/syllabus" element={<ProtectedRoute roles={['COACH']}><SyllabusList /></ProtectedRoute>} />
          <Route path="/coach/syllabus/:id" element={<ProtectedRoute roles={['COACH']}><SyllabusDetails /></ProtectedRoute>} />
          <Route path="/coach/attendance" element={<ProtectedRoute roles={['COACH']}><AttendancePage /></ProtectedRoute>} />
          <Route path="/coach/profile" element={<ProtectedRoute roles={['COACH']}><CoachProfile /></ProtectedRoute>} />

          {/* CLIENT Routes */}
          <Route path="/client" element={<ProtectedRoute roles={['CLIENT']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client/students" element={<ProtectedRoute roles={['CLIENT']}><StudentsList /></ProtectedRoute>} />
          <Route path="/client/students/:id" element={<ProtectedRoute roles={['CLIENT']}><ClientStudentDetails /></ProtectedRoute>} />
          <Route path="/client/calendar" element={<ProtectedRoute roles={['CLIENT']}><ClientCalendar /></ProtectedRoute>} />
          <Route path="/client/profile" element={<ProtectedRoute roles={['CLIENT']}><CoachProfile /></ProtectedRoute>} />

          {/* STUDENT Routes */}
          <Route path="/student" element={<ProtectedRoute roles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/classes" element={<ProtectedRoute roles={['STUDENT']}><ClassesList /></ProtectedRoute>} />
          <Route path="/student/calendar" element={<ProtectedRoute roles={['STUDENT']}><StudentCalendar /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute roles={['STUDENT']}><CoachProfile /></ProtectedRoute>} />
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
        <Route path="/client-apply" element={<ClientOnboarding />} />
        <Route path="/student-apply" element={<StudentOnboarding />} />

        {/* ── All other routes require authentication ── */}
        <Route path="/*" element={<ProtectedApp />} />
      </Routes>
    </BrowserRouter>
  );
}
