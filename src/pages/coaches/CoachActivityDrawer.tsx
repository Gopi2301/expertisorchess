import React, { useEffect, useState } from 'react';
import { X, Trophy, Users, Clock, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { coachesApi } from '../../api/coaches.api';
import type { CoachActivity } from '../../api/coaches.api';
import { StatusBadge } from '../../components/ui/Badge';
import type { Coach } from '../../types';

interface CoachActivityDrawerProps {
  coach: Coach | null;
  onClose: () => void;
}

const timelineColors: Record<string, string> = {
  amber: 'bg-amber-400 text-black',
  green: 'bg-green-500 text-white',
  red:   'bg-red-500 text-white',
};

const timelineIcons: Record<string, React.ReactNode> = {
  amber: <AlertCircle size={14} />,
  green: <CheckCircle2 size={14} />,
  red:   <XCircle size={14} />,
};

export const CoachActivityDrawer: React.FC<CoachActivityDrawerProps> = ({ coach, onClose }) => {
  const [activity, setActivity] = useState<CoachActivity | null>(null);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!coach) { setActivity(null); return; }
    setLoading(true);
    coachesApi.getActivity(coach.id)
      .then(res => setActivity((res as any).data ?? res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [coach?.id]);

  const open = !!coach;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-bg-strong border-l border-border z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bg-brand/10 border border-bg-brand/20 flex items-center justify-center text-bg-brand font-bold">
              {coach?.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm">{coach?.name}</p>
              <p className="text-xs text-text-muted">{coach?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {coach && <StatusBadge status={coach.status} />}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-2 border-bg-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activity ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-elevated border border-border rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-bg-brand/10 flex items-center justify-center mx-auto mb-2">
                    <Trophy size={16} className="text-bg-brand" />
                  </div>
                  <p className="text-2xl font-bold text-text-primary">{activity.stats.totalClasses}</p>
                  <p className="text-xs text-text-muted mt-0.5">Classes Taught</p>
                </div>
                <div className="bg-bg-elevated border border-border rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                    <Users size={16} className="text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-text-primary">{activity.stats.totalAttendance}</p>
                  <p className="text-xs text-text-muted mt-0.5">Attendance Marked</p>
                </div>
              </div>

              {/* Profile details */}
              <div className="bg-bg-elevated border border-border rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Profile</p>
                {[
                  { label: 'Phone', value: activity.coach.phone },
                  { label: 'FIDE', value: activity.coach.fide_rating ? `${activity.coach.fide_rating}` : null },
                  { label: 'Rapid', value: activity.coach.rapid_rating ? `${activity.coach.rapid_rating}` : null },
                  { label: 'Blitz', value: activity.coach.blitz_rating ? `${activity.coach.blitz_rating}` : null },
                  { label: 'Experience', value: activity.coach.experience_years ? `${activity.coach.experience_years} years` : null },
                  { label: 'Rate', value: activity.coach.hourly_rate ? `₹${activity.coach.hourly_rate.toLocaleString()}/hr` : null },
                  { label: 'Syllabus', value: activity.coach.current_syllabus },
                ].filter(r => r.value).map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">{label}</span>
                    <span className="text-text-primary font-medium">{value}</span>
                  </div>
                ))}
                {activity.coach.bio && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-text-muted mb-1">Bio</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{activity.coach.bio}</p>
                  </div>
                )}
              </div>

              {/* Status timeline */}
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Application Timeline</p>
                <div className="space-y-3">
                  {activity.timeline.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${timelineColors[item.color]}`}>
                        {timelineIcons[item.color]}
                      </div>
                      <div>
                        <p className="text-sm text-text-primary font-medium">{item.event}</p>
                        <p className="text-xs text-text-muted">
                          {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent classes */}
              {activity.recentClasses.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Calendar size={12} /> Recent Classes
                  </p>
                  <div className="space-y-2">
                    {activity.recentClasses.map(cls => (
                      <div key={cls.id} className="flex items-center justify-between bg-bg-elevated border border-border rounded-lg px-3 py-2.5">
                        <div>
                          <p className="text-sm text-text-primary font-medium">{cls.title}</p>
                          <p className="text-xs text-text-muted">
                            {new Date(cls.scheduled_start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-muted capitalize">{cls.class_type.toLowerCase()}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            cls.status === 'COMPLETED' ? 'bg-bg-success text-text-success' :
                            cls.status === 'ONGOING'   ? 'bg-amber-400/10 text-amber-400' :
                            'bg-bg-muted text-text-muted'}`}>
                            {cls.status.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-text-muted text-sm gap-2">
              <Clock size={20} />
              <p>No activity data</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
