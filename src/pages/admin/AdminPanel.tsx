import React from 'react';
import { ShieldCheck, Trash2, AlertTriangle } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <ShieldCheck size={22} className="text-bg-brand" /> Admin Panel
        </h1>
        <p className="text-sm text-text-muted mt-0.5">Super-admin only. Proceed with caution.</p>
      </div>

      {/* Danger zone */}
      <div className="border border-error-strong/30 bg-bg-error/20 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-error-strong">
          <AlertTriangle size={16} />
          <span className="text-sm font-semibold">Danger Zone</span>
        </div>
        <p className="text-sm text-text-secondary">
          Destructive actions for data management. These operations may be irreversible.
          Hard-delete and restore endpoints will be implemented here.
        </p>
        <div className="flex gap-3">
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-error border border-error-strong/30 text-error-strong text-sm opacity-50 cursor-not-allowed"
          >
            <Trash2 size={14} /> Hard Delete Coach
          </button>
        </div>
        <p className="text-xs text-text-muted">
          ℹ️ Hard-delete and restore actions will be available here once backend admin endpoints are confirmed.
        </p>
      </div>
    </div>
  );
};
