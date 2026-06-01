import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CalendarDays, List, Info, RefreshCw, Video } from 'lucide-react';
import { CalendarView } from '../../components/ui/CalendarView';
import { ToastContext } from '../../components/layout/AppLayout';
import { classesApi } from '../../api/classes.api';
import { ClassStatusBadge } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/format';
import type { Class } from '../../types';

type ViewMode = 'calendar' | 'list';

export const StudentCalendar: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState<{ from: string; to: string }>(() => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      to:   new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
    };
  });

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await classesApi.listForStudent({
        date_from: dateRange.from,
        date_to: dateRange.to,
        limit: 200,
      });
      setClasses(res.data);
    } catch {
      addToast('Failed to load your schedule', 'error');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const handleRangeChange = useCallback((from: string, to: string) => {
    setDateRange({ from, to });
  }, []);

  // Classes with enrollment_status = PENDING get greyed out in the calendar
  const pendingIdSet = useMemo(() => {
    return new Set(
      classes
        .filter(c => c.students?.some(sc => sc.enrollment_status === 'PENDING'))
        .map(c => c.id)
    );
  }, [classes]);

  const confirmedCount = classes.filter(c => !pendingIdSet.has(c.id)).length;
  const pendingCount   = pendingIdSet.size;

  // Info banner
  const infoBanner = pendingCount > 0 ? (
    <div className="flex items-start gap-2 text-sm text-text-muted">
      <Info size={14} className="text-bg-brand mt-0.5 flex-shrink-0" />
      <span>
        <span className="text-text-primary font-medium">{pendingCount} class{pendingCount !== 1 ? 'es' : ''}</span>
        {' '}shown as faded — your enrollment is pending confirmation.
      </span>
    </div>
  ) : null;

  // Upcoming confirmed list (next 5)
  const upcomingConfirmed = classes
    .filter(c => !pendingIdSet.has(c.id) && new Date(c.scheduled_start) > new Date())
    .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime())
    .slice(0, 5);

  return (
    <div className="h-full flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <CalendarDays size={22} className="text-bg-brand" /> My Schedule
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            <span className="text-text-primary font-medium">{confirmedCount}</span> confirmed
            {pendingCount > 0 && (
              <span className="ml-2 text-text-muted">
                · <span className="text-amber-400">{pendingCount} pending</span>
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchClasses}
            className="p-2 rounded-lg border border-border text-text-muted hover:text-text-primary hover:border-bg-brand transition-colors"
            title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <div className="flex rounded-lg border border-border overflow-hidden">
            <button onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors
                ${viewMode === 'calendar' ? 'bg-bg-brand text-black' : 'text-text-muted hover:bg-bg-muted'}`}>
              <CalendarDays size={14} /> Calendar
            </button>
            <button onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors
                ${viewMode === 'list' ? 'bg-bg-brand text-black' : 'text-text-muted hover:bg-bg-muted'}`}>
              <List size={14} /> Upcoming
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'calendar' ? (
        <div className="flex-1 min-h-0">
          <CalendarView
            classes={classes}
            onRangeChange={handleRangeChange}
            pendingIds={pendingIdSet}
            headerSlot={infoBanner ?? undefined}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {infoBanner && (
            <div className="bg-bg-elevated border border-border rounded-xl px-4 py-3">
              {infoBanner}
            </div>
          )}

          {upcomingConfirmed.length === 0 ? (
            <div className="text-center py-16 text-text-muted">
              <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No upcoming confirmed classes</p>
              <p className="text-sm mt-1">Check back after your coach confirms your sessions.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">Upcoming classes</p>
              {upcomingConfirmed.map(cls => (
                <div key={cls.id}
                  className="flex items-center justify-between gap-4 bg-bg-strong border border-border rounded-xl px-4 py-3 hover:border-bg-brand/40 transition-colors">
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary truncate">{cls.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{formatDateTime(cls.scheduled_start)}</p>
                    {cls.coach && <p className="text-xs text-text-muted">Coach: {cls.coach.name}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <ClassStatusBadge status={cls.status} />
                    {cls.meeting_link && (
                      <a href={cls.meeting_link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-bg-brand text-black font-semibold hover:opacity-80 transition-opacity">
                        <Video size={12} /> Join
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All classes including past/pending */}
          {classes.length > upcomingConfirmed.length && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">All this month</p>
              {classes
                .sort((a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime())
                .map(cls => {
                  const isPending = pendingIdSet.has(cls.id);
                  return (
                    <div key={cls.id}
                      className={`flex items-center justify-between gap-4 border rounded-xl px-4 py-3 transition-colors
                        ${isPending
                          ? 'bg-bg border-border/50 opacity-60'
                          : 'bg-bg-strong border-border hover:border-bg-brand/40'
                        }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-text-primary truncate text-sm">{cls.title}</p>
                          {isPending && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">Pending</span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{formatDateTime(cls.scheduled_start)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <ClassStatusBadge status={cls.status} />
                        {cls.meeting_link && !isPending && (
                          <a href={cls.meeting_link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-bg-brand hover:underline">
                            <Video size={12} /> Join
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
