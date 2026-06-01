import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, ExternalLink, Clock, Users, BookOpen, Video } from 'lucide-react';
import type { Class, ClassStatus } from '../../types';
import { formatDateTime } from '../../utils/format';

// ─── Status colours ──────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ClassStatus, { bg: string; text: string; dot: string; label: string }> = {
  DRAFT:      { bg: 'bg-[#3a3a4a]',        text: 'text-[#9999bb]',  dot: 'bg-[#6666aa]',  label: 'Draft' },
  PUBLISHED:  { bg: 'bg-[#1a3a5c]',        text: 'text-[#60aaee]',  dot: 'bg-[#3399dd]',  label: 'Published' },
  ONGOING:    { bg: 'bg-[#1a3a2a]',        text: 'text-[#44cc88]',  dot: 'bg-[#22aa66]',  label: 'Ongoing' },
  COMPLETED:  { bg: 'bg-[#2a1a4a]',        text: 'text-[#aa88ee]',  dot: 'bg-[#8855cc]',  label: 'Completed' },
  CANCELLED:  { bg: 'bg-[#3a1a1a]',        text: 'text-[#cc6666]',  dot: 'bg-[#aa3333]',  label: 'Cancelled' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function daysInMonth(d: Date)  { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}
function formatMonthRange(d: Date): { from: string; to: string } {
  const from = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
  const to   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString();
  return { from, to };
}
function formatWeekRange(d: Date): { from: string; to: string } {
  const day  = d.getDay();
  const sun  = new Date(d); sun.setDate(d.getDate() - day);
  const sat  = new Date(sun); sat.setDate(sun.getDate() + 6);
  sun.setHours(0, 0, 0, 0);
  sat.setHours(23, 59, 59, 0);
  return { from: sun.toISOString(), to: sat.toISOString() };
}

// ─── Props ───────────────────────────────────────────────────────────────────
export interface CalendarViewProps {
  classes: Class[];
  /** Optional: called when month/week changes so parent can refetch */
  onRangeChange?: (from: string, to: string) => void;
  /** Badge number on a date cell for pending classes */
  pendingIds?: Set<string>;
  /** Extra content rendered above calendar (e.g. pending banner) */
  headerSlot?: React.ReactNode;
  /** If provided, renders a Create button on date click */
  onDateClick?: (date: Date) => void;
}

// ─── Event Chip ──────────────────────────────────────────────────────────────
const EventChip: React.FC<{ cls: Class; onClick: (e: React.MouseEvent) => void; pending?: boolean }> = ({ cls, onClick, pending }) => {
  const cfg = STATUS_CONFIG[cls.status] ?? STATUS_CONFIG.DRAFT;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-md px-1.5 py-0.5 mb-0.5 text-[10px] font-medium leading-tight truncate
        ${cfg.bg} ${cfg.text} hover:brightness-125 transition-all
        ${pending ? 'opacity-50 ring-1 ring-dashed ring-current' : ''}
      `}
      title={cls.title}
    >
      <span className="mr-1 opacity-70">{formatTime(cls.scheduled_start)}</span>
      {cls.title}
    </button>
  );
};

// ─── Detail Drawer ────────────────────────────────────────────────────────────
const DetailDrawer: React.FC<{ cls: Class | null; onClose: () => void; pendingIds?: Set<string> }> = ({ cls, onClose, pendingIds }) => {
  if (!cls) return null;
  const cfg = STATUS_CONFIG[cls.status] ?? STATUS_CONFIG.DRAFT;
  const isPending = pendingIds?.has(cls.id);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40 animate-fade-in" onClick={onClose} />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 max-w-full bg-bg-strong border-l border-border z-50 flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
            {isPending && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Needs Confirm</span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-text-primary leading-snug">{cls.title}</h2>
            <p className="text-xs text-text-muted mt-1">{cls.class_type} class</p>
          </div>

          <div className="space-y-3">
            <InfoRow icon={<Clock size={14} />} label="Scheduled">
              <div>
                <p className="text-sm text-text-primary">{formatDateTime(cls.scheduled_start)}</p>
                <p className="text-xs text-text-muted">to {formatTime(cls.scheduled_end)}</p>
              </div>
            </InfoRow>

            {cls.coach && (
              <InfoRow icon={<span className="text-sm">♔</span>} label="Coach">
                <p className="text-sm text-text-primary">{cls.coach.name}</p>
              </InfoRow>
            )}

            <InfoRow icon={<Users size={14} />} label="Capacity">
              <p className="text-sm text-text-primary">
                {cls._count?.students ?? cls.students?.length ?? 0} / {cls.max_students} students
              </p>
            </InfoRow>

            {cls.plan && (
              <InfoRow icon={<BookOpen size={14} />} label="Plan">
                <p className="text-sm text-text-primary">{cls.plan.name}</p>
              </InfoRow>
            )}

            {cls.batch && (
              <InfoRow icon={<span className="text-sm">⊞</span>} label="Batch">
                <p className="text-sm text-text-primary">{cls.batch.title}</p>
              </InfoRow>
            )}

            {cls.meeting_link && (
              <InfoRow icon={<Video size={14} />} label="Meeting">
                <a
                  href={cls.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bg-brand hover:underline flex items-center gap-1"
                >
                  Join Class <ExternalLink size={11} />
                </a>
              </InfoRow>
            )}

            {cls.recording_url && (
              <InfoRow icon={<Video size={14} />} label="Recording">
                <a
                  href={cls.recording_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-400 hover:underline flex items-center gap-1"
                >
                  Watch Recording <ExternalLink size={11} />
                </a>
              </InfoRow>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-text-muted flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0 pt-1">
      <p className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mb-0.5">{label}</p>
      {children}
    </div>
  </div>
);

// ─── Month Grid ───────────────────────────────────────────────────────────────
const MonthView: React.FC<{
  current: Date;
  classes: Class[];
  pendingIds?: Set<string>;
  today: Date;
  onSelectClass: (c: Class) => void;
  onDateClick?: (d: Date) => void;
}> = ({ current, classes, pendingIds, today, onSelectClass, onDateClick }) => {
  const firstDay = startOfMonth(current).getDay(); // 0=Sun
  const numDays  = daysInMonth(current);
  const cells    = Array.from({ length: Math.ceil((firstDay + numDays) / 7) * 7 });

  // Group classes by day
  const byDay = useMemo(() => {
    const map: Record<string, Class[]> = {};
    classes.forEach(c => {
      const key = new Date(c.scheduled_start).toDateString();
      (map[key] ??= []).push(c);
    });
    return map;
  }, [classes]);

  return (
    <div className="flex-1 overflow-auto">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS.map(d => (
          <div key={d} className="py-2 text-center text-[11px] font-semibold text-text-muted tracking-wider">{d}</div>
        ))}
      </div>
      {/* Cells */}
      <div className="grid grid-cols-7" style={{ gridAutoRows: 'minmax(100px, auto)' }}>
        {cells.map((_, idx) => {
          const dayNum = idx - firstDay + 1;
          if (dayNum < 1 || dayNum > numDays) {
            return <div key={idx} className="border-b border-r border-border bg-bg/40 last:border-r-0" />;
          }
          const date = new Date(current.getFullYear(), current.getMonth(), dayNum);
          const key  = date.toDateString();
          const dayClasses = byDay[key] ?? [];
          const isToday = isSameDay(date, today);

          return (
            <div
              key={idx}
              className={`border-b border-r border-border p-1.5 last:border-r-0 min-h-[100px] flex flex-col
                ${isToday ? 'bg-bg-brand/5' : 'hover:bg-bg-muted/30'}
                ${onDateClick ? 'cursor-pointer' : ''}
              `}
              onClick={() => onDateClick?.(date)}
            >
              <div className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full
                ${isToday ? 'bg-bg-brand text-black' : 'text-text-secondary'}
              `}>
                {dayNum}
              </div>
              <div className="flex-1 overflow-hidden space-y-0.5">
                {dayClasses.slice(0, 3).map(c => (
                  <EventChip key={c.id} cls={c} pending={pendingIds?.has(c.id)}
                    onClick={e => { e.stopPropagation(); onSelectClass(c); }} />
                ))}
                {dayClasses.length > 3 && (
                  <p className="text-[9px] text-text-muted pl-1">+{dayClasses.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Week View ────────────────────────────────────────────────────────────────
const WeekView: React.FC<{
  current: Date;
  classes: Class[];
  pendingIds?: Set<string>;
  today: Date;
  onSelectClass: (c: Class) => void;
}> = ({ current, classes, pendingIds, today, onSelectClass }) => {
  const dayOffset = current.getDay();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(current);
    d.setDate(current.getDate() - dayOffset + i);
    return d;
  });

  const byDay = useMemo(() => {
    const map: Record<string, Class[]> = {};
    classes.forEach(c => {
      const key = new Date(c.scheduled_start).toDateString();
      (map[key] ??= []).push(c);
    });
    return map;
  }, [classes]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((d, i) => {
          const isToday = isSameDay(d, today);
          return (
            <div key={i} className={`py-3 text-center border-r border-border last:border-r-0 ${isToday ? 'bg-bg-brand/5' : ''}`}>
              <p className="text-[10px] text-text-muted font-semibold">{DAYS[i]}</p>
              <p className={`text-xl font-bold mt-0.5 ${isToday ? 'text-bg-brand' : 'text-text-primary'}`}>{d.getDate()}</p>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7">
        {weekDays.map((d, i) => {
          const dayClasses = byDay[d.toDateString()] ?? [];
          return (
            <div key={i} className="border-r border-border last:border-r-0 p-2 min-h-[300px] space-y-1">
              {dayClasses.map(c => (
                <EventChip key={c.id} cls={c} pending={pendingIds?.has(c.id)} onClick={(e) => { e.stopPropagation(); onSelectClass(c); }} />
              ))}
              {dayClasses.length === 0 && (
                <p className="text-[10px] text-text-muted/40 text-center pt-4">—</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main CalendarView ────────────────────────────────────────────────────────
export const CalendarView: React.FC<CalendarViewProps> = ({
  classes,
  onRangeChange,
  pendingIds,
  headerSlot,
  onDateClick,
}) => {
  const today = useMemo(() => new Date(), []);
  const [current, setCurrent]     = useState<Date>(new Date());
  const [viewMode, setViewMode]   = useState<'month' | 'week'>('month');
  const [selected, setSelected]   = useState<Class | null>(null);

  // Notify parent when we navigate
  const navigate = (dir: -1 | 1) => {
    setCurrent(prev => {
      const next = new Date(prev);
      if (viewMode === 'month') {
        next.setMonth(prev.getMonth() + dir);
        const r = formatMonthRange(next);
        onRangeChange?.(r.from, r.to);
      } else {
        next.setDate(prev.getDate() + dir * 7);
        const r = formatWeekRange(next);
        onRangeChange?.(r.from, r.to);
      }
      return next;
    });
  };

  // Header label
  const headerLabel = viewMode === 'month'
    ? `${MONTHS[current.getMonth()]} ${current.getFullYear()}`
    : (() => {
        const day = current.getDay();
        const sun = new Date(current); sun.setDate(current.getDate() - day);
        const sat = new Date(sun); sat.setDate(sun.getDate() + 6);
        return `${MONTHS[sun.getMonth()]} ${sun.getDate()} – ${sat.getDate()}, ${sat.getFullYear()}`;
      })();

  const pendingSet = pendingIds ?? new Set<string>();

  return (
    <div className="flex flex-col h-full bg-bg rounded-xl border border-border overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-bg-strong shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors">
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-base font-bold text-text-primary min-w-[200px] text-center">{headerLabel}</h2>
          <button onClick={() => navigate(1)}
            className="p-1.5 rounded-lg hover:bg-bg-muted text-text-muted hover:text-text-primary transition-colors">
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => { setCurrent(new Date()); }}
            className="text-xs px-2.5 py-1 rounded-lg border border-border text-text-muted hover:text-text-primary hover:border-bg-brand transition-colors ml-1"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 mr-3">
            {(Object.entries(STATUS_CONFIG) as [ClassStatus, typeof STATUS_CONFIG[ClassStatus]][]).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1 text-[10px] text-text-muted">
                <span className={`w-2 h-2 rounded-full ${v.dot}`} />{v.label}
              </span>
            ))}
          </div>
          {/* View toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(['month', 'week'] as const).map(m => (
              <button key={m} onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize
                  ${viewMode === m ? 'bg-bg-brand text-black' : 'text-text-muted hover:bg-bg-muted'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Optional header slot (e.g. pending banner) */}
      {headerSlot && <div className="px-5 py-3 border-b border-border shrink-0 bg-bg-elevated">{headerSlot}</div>}

      {/* Calendar body */}
      {viewMode === 'month'
        ? <MonthView current={current} classes={classes} pendingIds={pendingSet} today={today}
            onSelectClass={setSelected} onDateClick={onDateClick} />
        : <WeekView  current={current} classes={classes} pendingIds={pendingSet} today={today}
            onSelectClass={setSelected} />
      }

      {/* Detail drawer */}
      <DetailDrawer cls={selected} onClose={() => setSelected(null)} pendingIds={pendingSet} />
    </div>
  );
};
