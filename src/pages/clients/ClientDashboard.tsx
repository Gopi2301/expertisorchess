import React, { useEffect, useState } from 'react';
import { Users, Calendar, Video, ChevronRight, GraduationCap, Plus, Clock, ShieldCheck, CheckCircle, CreditCard, Activity } from 'lucide-react';
import { clientsApi } from '../../api/clients.api';
import { formatDateTime } from '../../utils/format';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/Card';
import { StatusBadge, ChessLevelBadge, AttendanceBadge, ClassStatusBadge } from '../../components/ui/Badge';
import type { ClientDashboardData, ClientDashboardClass } from '../../types';

export const ClientDashboard: React.FC = () => {
  const [data, setData] = useState<ClientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientsApi.meDashboard()
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-16 bg-bg-strong rounded-xl w-full" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="h-24 bg-bg-strong rounded-xl" />
        <div className="h-24 bg-bg-strong rounded-xl" />
        <div className="h-24 bg-bg-strong rounded-xl" />
        <div className="h-24 bg-bg-strong rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-bg-strong rounded-xl" />
        <div className="h-64 bg-bg-strong rounded-xl" />
      </div>
    </div>;
  }

  const students = data?.students || [];
  
  // Flatten all upcoming classes from all students
  const allUpcoming = students.flatMap((s) => 
    s.classes.map((sc) => ({ ...sc, studentName: s.name }))
  ).sort((a, b) => new Date(a.class.scheduled_start).getTime() - new Date(b.class.scheduled_start).getTime());

  // Calculate classes this week
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const classesThisWeek = allUpcoming.filter(c => new Date(c.class.scheduled_start) < nextWeek);

  const pastClasses = data?.pastClasses || [];
  const activePlans = data?.activePlans || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Hero Header Strip */}
      <div className="bg-bg-strong border border-border rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">Welcome back, {data?.name}</h1>
            <StatusBadge status="ACTIVE" />
          </div>
          <p className="text-sm text-text-muted">{now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link to="/client/students" className="w-full md:w-auto">
          <Button icon={<Plus size={16} />} className="w-full">Register Student</Button>
        </Link>
      </div>

      {/* 2. Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Registered Students" value={students.length} icon={<Users size={18} />} accent />
        <StatCard label="Upcoming Classes" value={allUpcoming.length} icon={<Calendar size={18} />} />
        <StatCard label="Classes This Week" value={classesThisWeek.length} icon={<Clock size={18} />} />
        <StatCard label="Account Status" value="Active" icon={<ShieldCheck size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3. Family Schedule */}
          <div className="bg-bg-strong border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-bg-muted/30 flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Calendar size={16} className="text-bg-brand" />
                Family Schedule
              </h2>
              <Link to="/client/calendar" className="text-xs text-bg-brand hover:underline">View Calendar</Link>
            </div>
            <div className="divide-y divide-border">
              {allUpcoming.length === 0 ? (
                <p className="px-5 py-8 text-center text-text-muted text-sm">No upcoming classes scheduled.</p>
              ) : (
                allUpcoming.slice(0, 5).map((cls) => (
                  <div key={cls.id} className="px-4 py-4 sm:px-5 flex items-center justify-between hover:bg-bg-muted/30 transition-colors gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bg-brand/20 text-bg-brand flex items-center justify-center font-bold shrink-0 text-sm">
                        {cls.studentName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="text-sm font-semibold text-text-primary truncate">{cls.class.title}</p>
                          <ClassStatusBadge status={cls.class.status} />
                        </div>
                        <p className="text-[11px] sm:text-xs text-text-muted mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                          <span className="font-bold text-text-secondary">{cls.studentName}</span>
                          <span>•</span>
                          <span>{formatDateTime(cls.class.scheduled_start)}</span>
                          {cls.class.coach?.name && (
                            <>
                              <span>•</span>
                              <span>Coach {cls.class.coach.name}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    {cls.class.meeting_link && (
                      <Button size="sm" variant="ghost" onClick={() => window.open(cls.class.meeting_link, '_blank')} icon={<Video size={14} />} className="shrink-0">
                        Join
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4. My Students */}
          <div className="bg-bg-strong border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-bg-muted/30 flex items-center justify-between">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Users size={16} className="text-bg-brand" />
                My Students
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.length === 0 ? (
                <p className="col-span-2 text-center text-text-muted text-sm py-4">No students registered yet.</p>
              ) : (
                students.map((s) => {
                  const nextClass = s.classes.length > 0 ? s.classes[0] : null;
                  return (
                    <Link key={s.id} to={`/client/students/${s.id}`} className="block group">
                      <div className="p-4 bg-bg-muted/20 border border-border rounded-xl hover:border-bg-brand/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border flex items-center justify-center font-bold text-text-primary group-hover:text-bg-brand transition-colors">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-primary">{s.name}</p>
                              <div className="mt-1">
                                <ChessLevelBadge level={s.chess_level} />
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-text-muted group-hover:text-bg-brand transition-colors" />
                        </div>
                        <div className="pt-3 border-t border-border/50">
                          {nextClass ? (
                            <p className="text-xs text-text-muted">
                              <span className="font-semibold text-text-secondary">Next:</span> {formatDateTime(nextClass.class.scheduled_start)}
                            </p>
                          ) : (
                            <p className="text-xs text-text-muted">No upcoming classes</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          
          {/* 5. Quick Actions */}
          <div className="bg-bg-strong border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-bg-muted/30">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Activity size={16} className="text-bg-brand" />
                Quick Actions
              </h2>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <Link to="/client/calendar" className="flex flex-col items-center justify-center gap-2 p-4 bg-bg-elevated border border-border rounded-lg hover:border-bg-brand/50 hover:text-bg-brand transition-colors text-text-secondary">
                <Calendar size={20} />
                <span className="text-xs font-semibold text-center">Calendar</span>
              </Link>
              <Link to="/client/students" className="flex flex-col items-center justify-center gap-2 p-4 bg-bg-elevated border border-border rounded-lg hover:border-bg-brand/50 hover:text-bg-brand transition-colors text-text-secondary">
                <Plus size={20} />
                <span className="text-xs font-semibold text-center">Add Student</span>
              </Link>
              <Link to="/client/students" className="flex flex-col items-center justify-center gap-2 p-4 bg-bg-elevated border border-border rounded-lg hover:border-bg-brand/50 hover:text-bg-brand transition-colors text-text-secondary">
                <Users size={20} />
                <span className="text-xs font-semibold text-center">Students</span>
              </Link>
              <Link to="/client/profile" className="flex flex-col items-center justify-center gap-2 p-4 bg-bg-elevated border border-border rounded-lg hover:border-bg-brand/50 hover:text-bg-brand transition-colors text-text-secondary">
                <ShieldCheck size={20} />
                <span className="text-xs font-semibold text-center">Profile</span>
              </Link>
            </div>
          </div>

          {/* Billing/Active Plans */}
          {activePlans.length > 0 && (
             <div className="bg-bg-strong border border-border rounded-xl overflow-hidden">
               <div className="px-5 py-4 border-b border-border bg-bg-muted/30">
                 <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                   <CreditCard size={16} className="text-bg-brand" />
                   Active Subscriptions
                 </h2>
               </div>
               <div className="divide-y divide-border">
                 {activePlans.map(plan => (
                    <div key={plan.id} className="p-4">
                       <p className="text-sm font-bold text-text-primary">{plan.name}</p>
                       <p className="text-xs text-text-muted mt-1">{plan.classes_per_month} classes/mo • {plan.duration_minutes} min/class</p>
                       <div className="mt-2 inline-flex">
                          <StatusBadge status="ACTIVE" />
                       </div>
                    </div>
                 ))}
               </div>
             </div>
          )}

          {/* 6. Activity Feed */}
          <div className="bg-bg-strong border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-bg-muted/30">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <CheckCircle size={16} className="text-bg-brand" />
                Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-border">
              {pastClasses.length === 0 ? (
                <p className="p-5 text-center text-text-muted text-sm">No recent activity.</p>
              ) : (
                pastClasses.map((pc) => (
                  <div key={pc.id} className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-medium text-text-primary line-clamp-1">{pc.class.title}</p>
                      {pc.attendance ? (
                        <AttendanceBadge status={pc.attendance.attendance_status} />
                      ) : (
                        <span className="text-[10px] text-text-muted border border-border px-2 py-0.5 rounded-full">Pending</span>
                      )}
                    </div>
                    <p className="text-[10px] text-text-muted">
                      {pc.student.name} • {new Date(pc.class.scheduled_start).toLocaleDateString()}
                    </p>
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
