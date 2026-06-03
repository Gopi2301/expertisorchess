import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, GraduationCap, User } from 'lucide-react';

export const ClientBottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-strong border-t border-border flex items-center justify-around z-50 px-4 pb-safe">
      <NavLink
        to="/client"
        end
        className={({ isActive }) => `
          flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors
          ${isActive ? 'text-bg-brand' : 'text-text-muted hover:text-text-primary'}
        `}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-semibold">Dashboard</span>
      </NavLink>

      <NavLink
        to="/client/calendar"
        className={({ isActive }) => `
          flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors
          ${isActive ? 'text-bg-brand' : 'text-text-muted hover:text-text-primary'}
        `}
      >
        <CalendarCheck size={20} />
        <span className="text-[10px] font-semibold">Calendar</span>
      </NavLink>

      <NavLink
        to="/client/students"
        className={({ isActive }) => `
          flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors
          ${isActive ? 'text-bg-brand' : 'text-text-muted hover:text-text-primary'}
        `}
      >
        <GraduationCap size={20} />
        <span className="text-[10px] font-semibold">Students</span>
      </NavLink>

      <NavLink
        to="/client/profile"
        className={({ isActive }) => `
          flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors
          ${isActive ? 'text-bg-brand' : 'text-text-muted hover:text-text-primary'}
        `}
      >
        <User size={20} />
        <span className="text-[10px] font-semibold">Profile</span>
      </NavLink>
    </nav>
  );
};
