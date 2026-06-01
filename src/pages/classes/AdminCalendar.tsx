import React, { useContext, useState, useEffect, useCallback } from 'react';
import { CalendarDays, List, RefreshCw } from 'lucide-react';
import { CalendarView } from '../../components/ui/CalendarView';
import { ClassesList } from './ClassesList';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { classesApi } from '../../api/classes.api';
import { coachesApi } from '../../api/coaches.api';
import { plansApi } from '../../api/plans.api';
import { batchesApi } from '../../api/batches';
import { syllabusApi } from '../../api/syllabus.api';
import { ToastContext } from '../../components/layout/AppLayout';
import type { Class, Coach, Plan, Syllabus } from '../../types';

type ViewMode = 'calendar' | 'list';

type ClassForm = {
  title: string; coach_id: string; plan_id: string; syllabus_id?: string;
  scheduled_start: string; scheduled_end: string;
  max_students: number; meeting_link?: string; batch_id?: string;
};

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const AdminCalendar: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [filterCoachId, setFilterCoachId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>(() => {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      to:   new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
    };
  });

  // Create modal
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClassForm>();

  // Load dropdowns once
  useEffect(() => {
    coachesApi.list({ limit: 100 }).then(r => setCoaches(r.data)).catch(() => {});
    plansApi.list({ limit: 100 }).then(r => setPlans(r.data)).catch(() => {});
    syllabusApi.list({ limit: 100 }).then(r => setSyllabuses(r.data)).catch(() => {});
    batchesApi.findAll({ limit: 100 }).then(r => setBatches(r.data)).catch(() => {});
  }, []);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await classesApi.list({
        date_from: dateRange.from,
        date_to: dateRange.to,
        limit: 200,
        ...(filterCoachId && { coach_id: filterCoachId }),
        ...(filterStatus && { status: filterStatus }),
      });
      setClasses(res.data);
    } catch {
      addToast('Failed to load classes', 'error');
    } finally {
      setLoading(false);
    }
  }, [dateRange, filterCoachId, filterStatus]);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const handleRangeChange = useCallback((from: string, to: string) => {
    setDateRange({ from, to });
  }, []);

  const handleDateClick = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 16);
    reset({ max_students: 1, scheduled_start: local, scheduled_end: local });
    setModalOpen(true);
  };

  const onSubmit = async (form: ClassForm) => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        max_students: Number(form.max_students),
        scheduled_start: new Date(form.scheduled_start).toISOString(),
        scheduled_end: new Date(form.scheduled_end).toISOString(),
        class_type: form.batch_id ? 'GROUP' : 'INDIVIDUAL' as any,
        batch_id: form.batch_id || undefined,
      };
      await classesApi.create(payload);
      addToast('Class created', 'success');
      setModalOpen(false);
      fetchClasses();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const coachOptions = [{ value: '', label: 'All Coaches' }, ...coaches.map(c => ({ value: c.id, label: c.name }))];
  const coachSelectOptions = coaches.map(c => ({ value: c.id, label: c.name }));
  const planOptions = plans.map(p => ({ value: p.id, label: `${p.name} (max ${p.max_students})` }));
  const syllabusOptions = [{ value: '', label: '— None —' }, ...syllabuses.map(s => ({ value: s.id, label: s.title }))];
  const batchOptions = [{ value: '', label: '— Individual —' }, ...batches.map(b => ({ value: b.id, label: b.title }))];

  return (
    <div className="h-full flex flex-col gap-4 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <CalendarDays size={22} className="text-bg-brand" /> Calendar
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{classes.length} classes in view</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filters */}
          <select
            value={filterCoachId}
            onChange={e => setFilterCoachId(e.target.value)}
            className="text-sm bg-bg-strong border border-border text-text-secondary rounded-lg px-3 py-2 focus:outline-none focus:border-bg-brand"
          >
            {coachOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-sm bg-bg-strong border border-border text-text-secondary rounded-lg px-3 py-2 focus:outline-none focus:border-bg-brand"
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={fetchClasses}
            className="p-2 rounded-lg border border-border text-text-muted hover:text-text-primary hover:border-bg-brand transition-colors"
            title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* View toggle */}
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
            onDateClick={handleDateClick}
          />
        </div>
      ) : (
        <ClassesList />
      )}

      {/* Create Class Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Class" size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={submitting} onClick={handleSubmit(onSubmit)}>Create Class</Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-span-2">
            <Input label="Title *" id="adm-cls-title" error={errors.title?.message}
              {...register('title', { required: 'Title is required' })} />
          </div>
          <Select label="Coach *" id="adm-cls-coach" options={coachSelectOptions} placeholder="Select coach…"
            error={errors.coach_id?.message}
            {...register('coach_id', { required: 'Coach is required' })} />
          <Select label="Plan *" id="adm-cls-plan" options={planOptions} placeholder="Select plan…"
            error={errors.plan_id?.message}
            {...register('plan_id', { required: 'Plan is required' })} />
          <Select label="Syllabus" id="adm-cls-syllabus" options={syllabusOptions} {...register('syllabus_id')} />
          <Select label="Batch" id="adm-cls-batch" options={batchOptions} {...register('batch_id')} />
          <Input label="Start *" id="adm-cls-start" type="datetime-local" error={errors.scheduled_start?.message}
            {...register('scheduled_start', { required: 'Start time is required' })} />
          <Input label="End *" id="adm-cls-end" type="datetime-local" error={errors.scheduled_end?.message}
            {...register('scheduled_end', { required: 'End time is required' })} />
          <Input label="Max Students" id="adm-cls-max" type="number"
            {...register('max_students', { valueAsNumber: true })} />
          <Input label="Meeting Link" id="adm-cls-meet" {...register('meeting_link')} />
        </form>
      </Modal>
    </div>
  );
};
