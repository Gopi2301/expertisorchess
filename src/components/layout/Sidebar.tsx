import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen,
  Calendar, ClipboardList, FileText, ShieldCheck,
  ChevronLeft, ChevronRight, LogOut, Crown, Layers,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
  { to: '/coaches', icon: <Crown size={18} />, label: 'Coaches' },
  { to: '/clients', icon: <Users size={18} />, label: 'Clients' },
  { to: '/students', icon: <GraduationCap size={18} />, label: 'Students' },
  { to: '/classes', icon: <Calendar size={18} />, label: 'Classes' },
  { to: '/batches', icon: <Layers size={18} />, label: 'Groups' },
  { to: '/plans', icon: <FileText size={18} />, label: 'Plans' },
  { to: '/syllabus', icon: <BookOpen size={18} />, label: 'Syllabus' },
  { to: '/attendance', icon: <ClipboardList size={18} />, label: 'Attendance' },
  { to: '/admin/system', icon: <ShieldCheck size={18} />, label: 'System' },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  return (
    <aside
      className={`
        relative flex flex-col shrink-0 h-screen bg-bg-strong border-r border-border
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex-shrink-0 w-8 h-8 bg-bg-brand rounded-lg flex items-center justify-center">
          <span className="text-black font-black text-sm">♔</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-text-primary leading-none">Expertisor</p>
            <p className="text-[10px] text-text-muted mt-0.5">Chess Academy</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-150
              ${isActive
                ? 'bg-bg-brand text-text-on-brand'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-muted'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User & collapse */}
      <div className="border-t border-border p-3 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-bg-brand flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-black">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{user.name}</p>
              <p className="text-[10px] text-text-muted">
                {user.roles.includes('SUPER_ADMIN') ? 'SUPER_ADMIN' : user.roles[0] || 'USER'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
            text-text-muted hover:text-error-strong hover:bg-bg-error
            transition-colors duration-150
            ${collapsed ? 'justify-center' : ''}
          `}
          title="Logout"
        >
          <LogOut size={16} />
          {!collapsed && 'Logout'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(prev => !prev)}
        className="absolute -right-3 top-20 w-6 h-6 bg-bg-elevated border border-border rounded-full flex items-center justify-center hover:border-bg-brand transition-colors z-10"
      >
        {collapsed
          ? <ChevronRight size={12} className="text-text-muted" />
          : <ChevronLeft size={12} className="text-text-muted" />
        }
      </button>
    </aside>
  );
};
