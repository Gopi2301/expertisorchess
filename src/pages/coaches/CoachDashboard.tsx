import React, { useEffect, useState } from 'react';
import { Calendar, Users, Clock, Video, CheckCircle, AlertCircle } from 'lucide-react';
import { StatCard } from '../../components/ui/Card';
import { ClassStatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { coachesApi, type CoachActivity } from '../../api/coaches.api';
import { formatDateTime } from '../../utils/format';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const CoachDashboard: React.FC = () => {
  const [data, setData] = useState<CoachActivity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    coachesApi.meDashboard()
      .then(res => {
        if (res.data) setData(res.data);
      })
      .catch(err => {
        console.error('[CoachDashboard] Error:', err);
        if (err.response?.status === 404) {
          setError('No coach profile found associated with your account.');
        } else {
          setError('Failed to load dashboard. Please try again later.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-bg-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-sm mt-4">Loading your dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="p-4 bg-bg-muted rounded-full">
          <AlertCircle size={48} className="text-text-muted" />
        </div>
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-text-primary">Dashboard Restricted</h2>
          <p className="text-sm text-text-muted mt-2">
            {error}
            <br />
            If you are a new applicant, your profile might still be pending approval.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => window.location.reload()}>Retry</Button>
          <Button variant="ghost" onClick={logout}>Sign out</Button>
        </div>
      </div>
    );
  }

  const upcomingClasses = data?.recentClasses.filter(c => c.status === 'PUBLISHED') ?? [];
  const pendingVerification = data?.recentClasses.filter(c => c.status === 'COMPLETED') ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Welcome, Coach {data?.coach.name}</h1>
        <p className="text-sm text-text-muted mt-1">Manage your sessions and track student progress.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Classes Conducted"
          value={data?.stats.totalClasses ?? 0}
          icon={<Calendar size={18} />}
          accent
        />
        <StatCard
          label="Active Students"
          value={data?.stats.totalAttendance ?? 0} // Using totalAttendance as a proxy for now
          icon={<Users size={18} />}
        />
        <StatCard
          label="Next Class"
          value={upcomingClasses.length > 0 ? formatDateTime(upcomingClasses[0].scheduled_start) : 'No upcoming classes'}
          icon={<Clock size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Schedule */}
        <div className="bg-bg-strong border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Upcoming Classes</h2>
            <Link to="/classes" className="text-xs text-bg-brand hover:underline">View Schedule</Link>
          </div>
          <div className="divide-y divide-border">
            {upcomingClasses.length === 0 ? (
              <p className="px-5 py-8 text-center text-text-muted text-sm">No upcoming classes assigned</p>
            ) : (
              upcomingClasses.map(cls => (
                <div key={cls.id} className="px-5 py-4 flex items-center justify-between hover:bg-bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{cls.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{formatDateTime(cls.scheduled_start)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/classes/${cls.id}`}>
                      <Button size="sm" variant="secondary">View</Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-6">
          <div className="bg-bg-strong border border-border rounded-xl">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Action Items</h2>
            </div>
            <div className="p-5 space-y-4">
              <Link to="/attendance" className="block p-4 bg-bg-brand/5 border border-bg-brand/20 rounded-xl hover:bg-bg-brand/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-bg-brand/20 rounded-lg text-bg-brand">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Mark Attendance</p>
                    <p className="text-xs text-text-muted mt-0.5">Log student presence for recent classes</p>
                  </div>
                </div>
              </Link>

              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg text-amber-600">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Update Duration</p>
                    <p className="text-xs text-text-muted mt-0.5">Ensure all completed classes have actual start/end times</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Verification */}
          <div className="bg-bg-strong border border-border rounded-xl">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">Awaiting Admin Verification</h2>
            </div>
            <div className="divide-y divide-border">
              {pendingVerification.length === 0 ? (
                <p className="px-5 py-8 text-center text-text-muted text-sm">All logs are up to date</p>
              ) : (
                pendingVerification.map(cls => (
                  <div key={cls.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate">{cls.title}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{formatDateTime(cls.scheduled_start)}</p>
                    </div>
                    <div className="px-2 py-1 bg-bg-muted rounded text-[10px] text-text-muted">
                      Pending
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
