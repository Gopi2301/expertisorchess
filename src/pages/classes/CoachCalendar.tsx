import React, { useContext, useState, useEffect, useCallback } from 'react';
import { CalendarDays, List, AlertTriangle, CheckCircle2, RefreshCw, ChevronRight, Pencil } from 'lucide-react';
import { CalendarView } from '../../components/ui/CalendarView';
import { ClassesList } from './ClassesList';
import { Button } from '../../components/ui/Button';
import { ToastContext } from '../../components/layout/AppLayout';
import { classesApi } from '../../api/classes.api';
import { ClassStatusBadge } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/format';
import type { Class } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useForm } from 'react-hook-form';

type ViewMode = 'calendar' | 'list';

export const CoachCalendar: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [classes, setClasses] = useState<Class[]>([]);
  const [pendingClasses, setPendingClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [showPendingList, setShowPendingList] = useState(true);

  // States for Editing timing
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Class | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    title: string;
    meeting_link?: string;
    scheduled_start: string;
    scheduled_end: string;
  }>();

  const toLocalInput = (iso: string) => {
    const date = new Date(iso);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

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
      const [myRes, pendingRes] = await Promise.all([
        classesApi.listMy({ date_from: dateRange.from, date_to: dateRange.to, limit: 200 }),
        classesApi.listPendingConfirm({ limit: 50 }),
      ]);
      setClasses(myRes.data);
      setPendingClasses(pendingRes.data);
    } catch {
      addToast('Failed to load classes', 'error');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const handleRangeChange = useCallback((from: string, to: string) => {
    setDateRange({ from, to });
  }, []);

  const handleConfirm = async (cls: Class) => {
    setConfirmingId(cls.id);
    try {
      await classesApi.publish(cls.id);
      addToast(`"${cls.title}" confirmed & published!`, 'success');
      fetchClasses();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to confirm', 'error');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleEditClick = (cls: Class) => {
    setEditTarget(cls);
    reset({
      title: cls.title,
      meeting_link: cls.meeting_link ?? '',
      scheduled_start: toLocalInput(cls.scheduled_start),
      scheduled_end: toLocalInput(cls.scheduled_end),
    });
    setEditModalOpen(true);
  };

  const onEditSubmit = async (form: any) => {
    if (!editTarget) return;
    setSavingEdit(true);
    try {
      await classesApi.coachUpdate(editTarget.id, {
        scheduled_start: new Date(form.scheduled_start).toISOString(),
        scheduled_end: new Date(form.scheduled_end).toISOString(),
      });
      addToast('Class timing updated successfully', 'success');
      setEditModalOpen(false);
      fetchClasses();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to update timing', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // All pending IDs for the calendar (greyed chips + special indicator)
  const pendingIdSet = new Set(pendingClasses.map(c => c.id));

  // Pending banner
  const pendingBanner = pendingClasses.length > 0 ? (
    <div className="w-full">
      <button
        onClick={() => setShowPendingList(p => !p)}
        className="flex items-center gap-2 w-full text-left"
      >
        <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
        <span className="text-sm font-semibold text-amber-300">
          {pendingClasses.length} class{pendingClasses.length !== 1 ? 'es' : ''} awaiting your confirmation
        </span>
        <ChevronRight
          size={14}
          className={`text-amber-400 ml-auto transition-transform ${showPendingList ? 'rotate-90' : ''}`}
        />
      </button>

      {showPendingList && (
        <div className="mt-3 space-y-2">
          {pendingClasses.map(cls => (
            <div
              key={cls.id}
              className="flex items-center justify-between gap-3 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{cls.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{formatDateTime(cls.scheduled_start)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <ClassStatusBadge status={cls.status} />
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Pencil size={13} />}
                  onClick={() => handleEditClick(cls)}
                  className="hover:bg-amber-500/10 text-amber-400 border border-transparent hover:border-amber-500/30"
                >
                  Edit Timing
                </Button>
                <Button
                  size="sm"
                  loading={confirmingId === cls.id}
                  icon={<CheckCircle2 size={13} />}
                  onClick={() => handleConfirm(cls)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white border-0"
                >
                  Confirm
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="h-full flex flex-col gap-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <CalendarDays size={22} className="text-bg-brand" /> My Schedule
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            {classes.length} classes in view
            {pendingClasses.length > 0 && (
              <span className="ml-2 text-amber-400 font-semibold">
                · {pendingClasses.length} pending confirmation
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
              <List size={14} /> List
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
            headerSlot={pendingBanner ?? undefined}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pending banner above list */}
          {pendingClasses.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
              {pendingBanner}
            </div>
          )}
          <ClassesList />
        </div>
      )}
      {/* Edit Class Timing Modal */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Class Timing"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button loading={savingEdit} onClick={handleSubmit(onEditSubmit)}>Save Changes</Button>
          </>
        }
      >
        <form className="space-y-4 font-sans text-text-primary" onSubmit={handleSubmit(onEditSubmit)}>
          <Input
            label="Title (Read-Only)"
            id="coach-edit-title"
            disabled
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start *"
              id="coach-edit-start"
              type="datetime-local"
              error={errors.scheduled_start?.message}
              {...register('scheduled_start', { required: 'Start time is required' })}
            />
            <Input
              label="End *"
              id="coach-edit-end"
              type="datetime-local"
              error={errors.scheduled_end?.message}
              {...register('scheduled_end', { required: 'End time is required' })}
            />
          </div>
          <Input
            label="Meeting Link (Read-Only)"
            id="coach-edit-meet"
            disabled
            error={errors.meeting_link?.message}
            {...register('meeting_link')}
          />
        </form>
      </Modal>
    </div>
  );
};
