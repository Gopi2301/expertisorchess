import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ClientBottomNav } from './ClientBottomNav';
import { ToastContainer } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';

export const ToastContext = React.createContext<ReturnType<typeof useToast>>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const AppLayout: React.FC = () => {
  const toast = useToast();
  const { hasRole } = useAuth();
  const isClient = hasRole('CLIENT');

  return (
    <ToastContext.Provider value={toast}>
      <div className="flex h-screen overflow-hidden bg-bg">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className={`min-h-full p-4 md:p-6 ${isClient ? 'pb-24 md:pb-6' : ''}`}>
            <Outlet />
          </div>
        </main>
        {isClient && <ClientBottomNav />}
      </div>
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => React.useContext(ToastContext);

