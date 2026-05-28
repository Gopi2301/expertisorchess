import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRoutePrefix } from '../../hooks/useRoutePrefix';

export const RoleRedirect: React.FC = () => {
  const prefix = useRoutePrefix();

  if (!prefix) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading navigation...</p>
      </div>
    );
  }

  return <Navigate to={prefix} replace />;
};
