import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Calendar, Search, List, LayoutGrid, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { ClassStatusBadge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useApi } from '../../hooks/useApi';
import { classesApi } from '../../api/classes.api';
import { coachesApi } from '../../api/coaches.api';
import { batchesApi } from '../../api/batches';
import { plansApi } from '../../api/plans.api';
import { syllabusApi } from '../../api/syllabus.api';
import { ToastContext } from '../../components/layout/AppLayout';
import { formatDateTime } from '../../utils/format';
import type { Class, Coach, Plan, Syllabus, PlanType } from '../../types';

type ClassForm = {
  title: string; coach_id: string; plan_id: string; syllabus_id?: string;
  scheduled_start: string; scheduled_end: string;
  max_students: number; meeting_link?: string; batch_id?: string;
};

const StatusDotColors: Record<string, string> = {
  DRAFT: 'bg-text-muted',
  PUBLISHED: 'bg-bg-brand',
  ONGOING: 'bg-text-success',
  COMPLETED: 'bg-text-secondary',
  CANCELLED: 'bg-error-strong',
};

export const ClassesList: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const { data, meta, loading, refetch, params, updateParams } = useApi<Class>({
    fetcher: classesApi.list,
  });

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [view, setView] = useState<'table' | 'grid'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Class | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClassForm>();

  useEffect(() => {
    coachesApi.list({ limit: 100 }).then(r => setCoaches(r.data)).catch(() => {});
    plansApi.list({ limit: 100 }).then(r => setPlans(r.data)).catch(() => {});
    syllabusApi.list({ limit: 100 }).then(r => setSyllabuses(r.data)).catch(() => {});
    batchesApi.findAll({ limit: 100 }).then(r => setBatches(r.data)).catch(() => {});
  }, []);

  const toLocalInput = (iso: string) => new Date(iso).toISOString().slice(0, 16);

  const openCreate = () => { setEditTarget(null); reset({ max_students: 1, batch_id: '' }); setModalOpen(true); };
  const openEdit = (c: Class) => {
    setEditTarget(c);
    reset({
      title: c.title, coach_id: c.coach_id, plan_id: c.plan_id,
      syllabus_id: c.syllabus_id ?? '', max_students: c.max_students,
      meeting_link: c.meeting_link ?? '', batch_id: c.batch_id ?? '',
      scheduled_start: toLocalInput(c.scheduled_start),
      scheduled_end: toLocalInput(c.scheduled_end),
    });
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
      if (editTarget) {
        await classesApi.update(editTarget.id, payload);
        addToast('Class updated', 'success');
      } else {
        await classesApi.create(payload);
        addToast('Class created', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!deleteId) return;
    try {
      await classesApi.delete(deleteId);
      addToast('Class deleted', 'success');
      setDeleteId(null);
      refetch();
    } catch { addToast('Failed to delete', 'error'); }
  };

  const onPublish = async (id: string) => {
    try {
      await classesApi.publish(id);
      addToast('Class published', 'success');
      refetch();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to publish', 'error');
    }
  };

  const coachOptions = coaches.map(c => ({ value: c.id, label: c.name }));
  const planOptions = plans.map(p => ({ value: p.id, label: `${p.name} (max ${p.max_students})` }));
  const syllabusOptions = [{ value: '', label: '— None —' }, ...syllabuses.map(s => ({ value: s.id, label: s.title }))];
  const batchOptions = [{ value: '', label: '— Individual Class (No Batch) —' }, ...batches.map(b => ({ value: b.id, label: b.title }))];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Calendar size={22} className="text-bg-brand" /> Classes
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{meta?.total ?? 0} total classes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setView('grid')} icon={<LayoutGrid size={15} />}
            className={view === 'grid' ? 'text-bg-brand' : ''} />
          <Button variant="ghost" size="sm" onClick={() => setView('table')} icon={<List size={15} />}
            className={view === 'table' ? 'text-bg-brand' : ''} />
          <Button onClick={openCreate} icon={<Plus size={16} />}>Add Class</Button>
        </div>
      </div>

      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-bg-strong border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bg-brand"
          placeholder="Search classes…"
          onChange={e => updateParams({ search: e.target.value, page: 1 })}
        />
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-bg-strong border border-border rounded-xl p-5 animate-pulse space-y-3">
              <div className="h-4 bg-bg-elevated rounded w-3/4" />
              <div className="h-3 bg-bg-elevated rounded w-1/2" />
              <div className="h-3 bg-bg-elevated rounded w-2/3" />
            </div>
          )) : data.map(cls => (
            <div key={cls.id} className="bg-bg-strong border border-border rounded-xl p-5 hover:border-border-strong transition-colors card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${StatusDotColors[cls.status]}`} />
                  <ClassStatusBadge status={cls.status} />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(cls)} icon={<Pencil size={13} />} />
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(cls.id)} icon={<Trash2 size={13} />}
                    className="hover:text-error-strong" />
                  {cls.status === 'DRAFT' && (
                    <Button variant="ghost" size="sm" onClick={() => onPublish(cls.id)} icon={<CheckCircle size={13} />}
                      className="text-text-success hover:bg-bg-success/10" title="Publish Class" />
                  )}
                </div>
              </div>
              <Link to={`/classes/${cls.id}`}>
                <h3 className="font-semibold text-text-primary hover:text-bg-brand transition-colors">{cls.title}</h3>
              </Link>
              <p className="text-xs text-text-muted mt-1">{formatDateTime(cls.scheduled_start)}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-text-muted">Max {cls.max_students} students</span>
                {cls.batch && (
                  <span className="text-xs px-2 py-0.5 bg-bg-brand/10 rounded-full text-bg-brand font-medium">
                    Batch: {cls.batch.title}
                  </span>
                )}
                {!cls.batch && <span className="text-xs px-2 py-0.5 bg-bg-muted rounded-full text-text-secondary">{cls.class_type}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <Table<Class>
          loading={loading} data={data} emptyMessage="No classes found."
          columns={[
            { key: 'title', header: 'Title', render: row => (
              <Link to={`/classes/${row.id}`} className="font-medium text-text-primary hover:text-bg-brand">{row.title}</Link>
            ) },
            { key: 'status', header: 'Status', render: row => <ClassStatusBadge status={row.status} /> },
            { key: 'scheduled_start', header: 'Scheduled', render: row => formatDateTime(row.scheduled_start) },
            { key: 'max_students', header: 'Capacity', render: row => `${row.max_students} students` },
            { key: 'actions', header: '', render: row => (
              <div className="flex items-center justify-end gap-1">
                {row.status === 'DRAFT' && (
                  <Button variant="ghost" size="sm" onClick={() => onPublish(row.id)} icon={<CheckCircle size={14} />}
                    className="text-text-success hover:bg-bg-success/10" />
                )}
                <Button variant="ghost" size="sm" onClick={() => openEdit(row)} icon={<Pencil size={14} />} />
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(row.id)} icon={<Trash2 size={14} />}
                  className="hover:text-error-strong hover:bg-bg-error" />
              </div>
            ) },
          ]}
        />
      )}

      {meta && (
        <Pagination
          page={params.page ?? 1} totalPages={meta.totalPages}
          total={meta.total} limit={meta.limit}
          onPageChange={p => { updateParams({ page: p }); refetch({ ...params, page: p }); }}
        />
      )}

      {/* Create / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Class' : 'New Class'} size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={submitting} onClick={handleSubmit(onSubmit)}>
              {editTarget ? 'Save Changes' : 'Create Class'}
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-span-2">
            <Input label="Title *" id="cls-title" error={errors.title?.message}
              {...register('title', { required: 'Title is required' })} />
          </div>
          <Select label="Coach *" id="cls-coach" options={coachOptions} placeholder="Select coach…"
            error={errors.coach_id?.message}
            {...register('coach_id', { required: 'Coach is required' })} />
          <Select label="Plan *" id="cls-plan" options={planOptions} placeholder="Select plan…"
            error={errors.plan_id?.message}
            {...register('plan_id', { required: 'Plan is required' })} />
          <Select label="Syllabus" id="cls-syllabus" options={syllabusOptions} {...register('syllabus_id')} />
          <Select label="Batch (Auto-Enroll Students)" id="cls-batch"
            options={batchOptions}
            {...register('batch_id')} />
          <Input label="Start *" id="cls-start" type="datetime-local" error={errors.scheduled_start?.message}
            {...register('scheduled_start', { required: 'Start time is required' })} />
          <Input label="End *" id="cls-end" type="datetime-local" error={errors.scheduled_end?.message}
            {...register('scheduled_end', { required: 'End time is required' })} />
          <Input label="Max Students" id="cls-max" type="number" {...register('max_students', { valueAsNumber: true })} />
          <Input label="Meeting Link" id="cls-meet" {...register('meeting_link')} />
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Class" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={onDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">Are you sure you want to delete this class?</p>
      </Modal>
    </div>
  );
};
