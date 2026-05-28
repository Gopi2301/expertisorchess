import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video, BookOpen, Star, Trophy } from 'lucide-react';
import { studentsApi } from '../../api/students.api';
import { formatDateTime } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/Card';
import { AttendanceBadge } from '../../components/ui/Badge';

export const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentsApi.meDashboard()
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6 p-6">
      <div className="h-8 bg-bg-strong rounded w-48" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 bg-bg-strong rounded-xl" />
        <div className="h-24 bg-bg-strong rounded-xl" />
        <div className="h-24 bg-bg-strong rounded-xl" />
      </div>
    </div>;
  }

  const upcomingClasses = data?.classes || [];
  const attendance = data?.attendance || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Hi, {data?.name}! 👋</h1>
          <p className="text-sm text-text-muted mt-1">Ready for your next chess adventure?</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-bg-brand/10 rounded-full text-bg-brand border border-bg-brand/20">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-bold">{data?.chess_level}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Current Level" value={data?.chess_level} icon={<Trophy size={18} />} accent />
        <StatCard label="Upcoming Classes" value={upcomingClasses.length} icon={<Calendar size={18} />} />
        <StatCard label="Total Attendance" value={attendance.length} icon={<BookOpen size={18} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Classes */}
        <div className="bg-bg-strong border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border bg-bg-muted/30 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Calendar size={16} className="text-bg-brand" />
              My Next Classes
            </h2>
          </div>
          <div className="divide-y divide-border">
            {upcomingClasses.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-text-muted text-sm">No classes scheduled. Take a break or check with your coach!</p>
              </div>
            ) : (
              upcomingClasses.map((sc: any) => (
                <div key={sc.id} className="p-5 flex items-center justify-between hover:bg-bg-muted/10 transition-colors">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-text-primary">{sc.class.title}</p>
                    <p className="text-xs text-text-muted flex items-center gap-1.5">
                      <Clock size={12} /> {formatDateTime(sc.class.scheduled_start)}
                    </p>
                    <p className="text-[10px] text-bg-brand font-bold uppercase tracking-wider">
                      Coach: {sc.class.coach?.name}
                    </p>
                  </div>
                  {sc.class.meeting_link && (
                    <Button onClick={() => window.open(sc.class.meeting_link, '_blank')} variant="primary" size="sm" icon={<Video size={14} />}>
                      Join
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-bg-strong border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border bg-bg-muted/30 flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <BookOpen size={16} className="text-bg-brand" />
              Recent Attendance
            </h2>
          </div>
          <div className="divide-y divide-border">
            {attendance.length === 0 ? (
              <p className="p-10 text-center text-text-muted text-sm">No attendance records yet.</p>
            ) : (
              attendance.map((att: any) => (
                <div key={att.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{att.class.title}</p>
                    <p className="text-[10px] text-text-muted">{formatDateTime(att.created_at)}</p>
                  </div>
                  <AttendanceBadge status={att.attendance_status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
