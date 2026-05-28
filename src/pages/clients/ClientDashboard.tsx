import React, { useEffect, useState } from 'react';
import { Users, Calendar, Clock, Video, ChevronRight, GraduationCap, Plus } from 'lucide-react';
import { clientsApi } from '../../api/clients.api';
import { formatDateTime } from '../../utils/format';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/Card';

export const ClientDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientsApi.meDashboard()
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-bg-strong rounded w-48" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 bg-bg-strong rounded-xl" />
        <div className="h-24 bg-bg-strong rounded-xl" />
        <div className="h-24 bg-bg-strong rounded-xl" />
      </div>
    </div>;
  }

  const students = data?.students || [];
  // Flatten all upcoming classes from all students
  const allUpcoming = students.flatMap((s: any) => 
    s.classes.map((sc: any) => ({ ...sc.class, studentName: s.name }))
  ).sort((a: any, b: any) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome, {data?.name}</h1>
          <p className="text-sm text-text-muted mt-1">Manage your family's chess journey.</p>
        </div>
        <Link to="/students">
          <Button icon={<Plus size={16} />}>Register Student</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Registered Students" value={students.length} icon={<Users size={18} />} accent />
        <StatCard label="Total Classes" value={allUpcoming.length} icon={<Calendar size={18} />} />
        <StatCard label="Account Status" value="Active" icon={<GraduationCap size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Schedule */}
        <div className="bg-bg-strong border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-bg-muted/30 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Calendar size={16} className="text-bg-brand" />
              Family Schedule
            </h2>
          </div>
          <div className="divide-y divide-border">
            {allUpcoming.length === 0 ? (
              <p className="px-5 py-8 text-center text-text-muted text-sm">No upcoming classes scheduled.</p>
            ) : (
              allUpcoming.map((cls: any) => (
                <div key={cls.id} className="px-5 py-4 flex items-center justify-between hover:bg-bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{cls.title}</p>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
                      <span className="font-bold text-bg-brand">{cls.studentName}</span> • {formatDateTime(cls.scheduled_start)}
                    </p>
                  </div>
                  {cls.meeting_link && (
                    <Button size="sm" variant="ghost" onClick={() => window.open(cls.meeting_link, '_blank')} icon={<Video size={14} />}>
                      Join
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Students */}
        <div className="bg-bg-strong border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-bg-muted/30 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Users size={16} className="text-bg-brand" />
              My Students
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 gap-4">
            {students.map((s: any) => (
              <div key={s.id} className="p-4 bg-bg-muted/20 border border-border rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bg-brand/20 text-bg-brand flex items-center justify-center font-bold">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{s.name}</p>
                    <p className="text-xs text-text-muted">{s.chess_level} • {s.status}</p>
                  </div>
                </div>
                <Link to={`/students`}>
                  <Button size="sm" variant="ghost" icon={<ChevronRight size={14} />} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
