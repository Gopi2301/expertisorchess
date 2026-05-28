import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from './admin/AdminDashboard';
import { CoachDashboard } from './coaches/CoachDashboard';
import { ClientDashboard } from './clients/ClientDashboard';
import { StudentDashboard } from './students/StudentDashboard';

export const Dashboard: React.FC = () => {
  const { hasRole } = useAuth();

  if (hasRole('SUPER_ADMIN')) {
    return <AdminDashboard />;
  }

  if (hasRole('COACH')) {
    return <CoachDashboard />;
  }

  if (hasRole('CLIENT')) {
    return <ClientDashboard />;
  }

  if (hasRole('STUDENT')) {
    return <StudentDashboard />;
  }

  return (
    <div className="p-12 text-center bg-bg-strong border border-border rounded-2xl animate-fade-in">
      <div className="w-16 h-16 bg-bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-text-muted">?</span>
      </div>
      <h2 className="text-xl font-bold text-text-primary">Unknown Role</h2>
      <p className="text-text-muted mt-2 max-w-sm mx-auto">
        We couldn't determine your account type. Please contact the academy administration to verify your access roles.
      </p>
    </div>
  );
};
