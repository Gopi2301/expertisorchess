import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Users, GraduationCap, Calendar, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { StatCard } from '../components/ui/Card';
import { ClassStatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { adminApi } from '../api/admin.api';
import { classesApi } from '../api/classes.api';
import { formatDateTime, formatCurrency } from '../utils/format';
import type { DashboardSummary, Class } from '../types';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentClasses, setRecentClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.summary().catch(() => null),
      classesApi.list({ limit: 6, sortOrder: 'desc', sortBy: 'created_at' }).catch(() => null),
    ]).then(([sum, classes]) => {
      if (sum?.data) setSummary(sum.data);
      if (classes?.data) setRecentClasses(classes.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">Welcome back, here's what's happening today.</p>
        </div>
        <Link to="/classes">
          <Button icon={<Calendar size={16} />}>New Class</Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Coaches"
          value={loading ? '—' : (summary?.totalCoaches ?? 0)}
          icon={<Crown size={18} />}
          accent
        />
        <StatCard
          label="Total Clients"
          value={loading ? '—' : (summary?.totalClients ?? 0)}
          icon={<Users size={18} />}
        />
        <StatCard
          label="Total Students"
          value={loading ? '—' : (summary?.totalStudents ?? 0)}
          icon={<GraduationCap size={18} />}
        />
        <StatCard
          label="Active Classes"
          value={loading ? '—' : (summary?.activeClasses ?? 0)}
          icon={<Calendar size={18} />}
        />
      </div>

      {/* Secondary stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-bg-strong border border-border rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 bg-bg-brand/10 rounded-xl text-bg-brand">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-xs text-text-muted">Revenue Estimate</p>
              <p className="text-2xl font-bold text-text-primary mt-0.5">
                {summary.revenueEstimate ? formatCurrency(summary.revenueEstimate) : '—'}
              </p>
            </div>
          </div>
          <div className="bg-bg-strong border border-border rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 bg-bg-success rounded-xl text-text-success">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs text-text-muted">Attendance Rate</p>
              <p className="text-2xl font-bold text-text-primary mt-0.5">
                {summary.attendancePercentage != null ? `${summary.attendancePercentage.toFixed(1)}%` : '—'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Classes */}
      <div className="bg-bg-strong border border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Recent Classes</h2>
          <Link to="/classes" className="text-xs text-bg-brand hover:text-bg-brand-hover flex items-center gap-1">
            View all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                <div className="h-4 bg-bg-elevated rounded w-48" />
                <div className="h-4 bg-bg-elevated rounded w-24 ml-auto" />
              </div>
            ))
          ) : recentClasses.length === 0 ? (
            <p className="px-5 py-8 text-center text-text-muted text-sm">No classes yet</p>
          ) : (
            recentClasses.map(cls => (
              <Link
                key={cls.id}
                to={`/classes/${cls.id}`}
                className="px-5 py-4 flex items-center gap-4 hover:bg-bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{cls.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{formatDateTime(cls.scheduled_start)}</p>
                </div>
                <ClassStatusBadge status={cls.status} />
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/coaches', label: 'Add Coach', icon: <Crown size={16} /> },
          { to: '/clients', label: 'Add Client', icon: <Users size={16} /> },
          { to: '/students', label: 'Add Student', icon: <GraduationCap size={16} /> },
          { to: '/attendance', label: 'Mark Attendance', icon: <Clock size={16} /> },
        ].map(a => (
          <Link key={a.to} to={a.to}>
            <button className="w-full flex items-center gap-2.5 px-4 py-3 bg-bg-strong border border-border rounded-xl text-sm text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors">
              <span className="text-text-muted">{a.icon}</span>
              {a.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};
