import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  BookOpen, ArrowLeft, Calendar, User, 
  ExternalLink, Clock, Plus, Pencil, Trash2
} from 'lucide-react';
import { syllabusApi } from '../../api/syllabus.api';
import apiClient from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { ClassStatusBadge } from '../../components/ui/Badge';
import { formatDateTime, formatDate } from '../../utils/format';
import { ToastContext } from '../../components/layout/AppLayout';
import { coachesApi } from '../../api/coaches.api';
import { plansApi } from '../../api/plans.api';
import { classesApi } from '../../api/classes.api';
import { batchesApi } from '../../api/batches';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import type { Syllabus, Class, Coach, Plan } from '../../types';

type ClassForm = {
  title: string; coach_id: string; plan_id: string;
  scheduled_start: string; scheduled_end: string;
  max_students: number; meeting_link?: string; batch_id?: string;
};

export const SyllabusDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClassForm>();

  useEffect(() => {
    if (id) {
      fetchData();
      loadFormOptions();
    }
  }, [id]);

  const loadFormOptions = async () => {
    try {
      const [cRes, pRes, bRes] = await Promise.all([
        coachesApi.list({ limit: 100 }),
        plansApi.list({ limit: 100 }),
        batchesApi.findAll({ limit: 100 })
      ]);
      setCoaches(cRes.data);
      setPlans(pRes.data);
      setBatches(bRes.data);
    } catch (e) {}
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sylRes, clsRes] = await Promise.all([
        syllabusApi.get(id!),
        apiClient.get('/classes', { params: { syllabus_id: id } }).then(r => r.data)
      ]);
      setSyllabus(sylRes.data);
      setClasses(clsRes.data);
    } catch (error) {
      addToast('Failed to load details', 'error');
      navigate('/syllabus');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    reset({ 
      max_students: 1, 
      batch_id: '',
      title: syllabus?.title ? `${syllabus.title} Class` : ''
    });
    setModalOpen(true);
  };

  const onSubmit = async (form: ClassForm) => {
    if (!id) return;
    setSubmitting(true);
    try {
      const payload = { 
        ...form, 
        syllabus_id: id,
        max_students: Number(form.max_students),
        scheduled_start: new Date(form.scheduled_start).toISOString(),
        scheduled_end: new Date(form.scheduled_end).toISOString(),
        class_type: form.batch_id ? 'GROUP' : 'INDIVIDUAL' as any,
        batch_id: form.batch_id || undefined,
      };
      await classesApi.create(payload);
      addToast('Class created successfully', 'success');
      setModalOpen(false);
      fetchData();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to create class', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const coachOptions = coaches.map(c => ({ value: c.id, label: c.name }));
  const planOptions = plans.map(p => ({ value: p.id, label: `${p.name} (max ${p.max_students})` }));
  const batchOptions = [{ value: '', label: '— Individual Class (No Batch) —' }, ...batches.map(b => ({ value: b.id, label: b.title }))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bg-brand"></div>
      </div>
    );
  }

  if (!syllabus) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/syllabus" className="p-2 hover:bg-bg-strong rounded-lg transition-colors text-text-muted hover:text-text-primary">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <BookOpen size={24} className="text-bg-brand" /> {syllabus.title}
            </h1>
            <p className="text-sm text-text-muted mt-0.5">Syllabus Details & Associated Classes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" icon={<Pencil size={16} />}>Edit</Button>
          <Button variant="ghost" className="text-error-strong hover:bg-bg-error" icon={<Trash2 size={16} />}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-strong border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              Information
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-text-secondary whitespace-pre-wrap">
                {syllabus.description || 'No description provided.'}
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Created On</p>
                <p className="text-sm text-text-primary font-medium">{formatDate(syllabus.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Last Updated</p>
                <p className="text-sm text-text-primary font-medium">{formatDate(syllabus.updated_at)}</p>
              </div>
            </div>
          </div>

          <div className="bg-bg-strong border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                Classes using this Syllabus
              </h2>
              <span className="text-xs font-medium px-2 py-1 bg-bg-muted rounded-full text-text-secondary">
                {classes.length} classes
              </span>
            </div>
            
            <Table<Class>
              data={classes}
              emptyMessage="No classes assigned to this syllabus."
              columns={[
                { 
                  key: 'title', 
                  header: 'Class Name', 
                  render: row => (
                    <Link to={`/classes/${row.id}`} className="font-medium text-bg-brand hover:underline">
                      {row.title}
                    </Link>
                  ) 
                },
                { 
                  key: 'scheduled_start', 
                  header: 'Scheduled', 
                  render: row => (
                    <div className="flex flex-col">
                      <span className="text-sm text-text-primary">{formatDateTime(row.scheduled_start)}</span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock size={12} /> 
                        {Math.round((new Date(row.scheduled_end).getTime() - new Date(row.scheduled_start).getTime()) / 60000)} mins
                      </span>
                    </div>
                  ) 
                },
                { 
                  key: 'status', 
                  header: 'Status', 
                  render: row => <ClassStatusBadge status={row.status} /> 
                },
                {
                  key: 'coach',
                  header: 'Coach',
                  render: row => row.coach ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-bg-muted flex items-center justify-center text-[10px] font-bold">
                        {row.coach.name.charAt(0)}
                      </div>
                      <span className="text-sm text-text-primary">{row.coach.name}</span>
                    </div>
                  ) : <span className="text-text-muted text-xs">Unassigned</span>
                },
                {
                  key: 'meeting_link',
                  header: 'Meeting',
                  render: row => row.meeting_link ? (
                    <a href={row.meeting_link} target="_blank" rel="noopener noreferrer" className="p-2 text-bg-brand hover:bg-bg-brand/10 rounded-lg inline-block">
                      <ExternalLink size={16} />
                    </a>
                  ) : <span className="text-text-muted text-xs">—</span>
                },
                {
                  key: 'actions',
                  header: '',
                  render: row => (
                    <div className="flex justify-end">
                      <Link to={`/classes/${row.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-brand/5 border border-bg-brand/20 rounded-xl p-6">
            <h3 className="text-sm font-bold text-bg-brand uppercase tracking-wider mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Total Classes</span>
                <span className="text-lg font-bold text-text-primary">{classes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Active Batches</span>
                <span className="text-lg font-bold text-text-primary">
                  {/* We might need to fetch this or it could be added to backend response */}
                  —
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button fullWidth variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
                Create Class
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title="Create New Class" size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={submitting} onClick={handleSubmit(onSubmit)}>Create Class</Button>
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
          <Select label="Batch (Auto-Enroll Students)" id="cls-batch"
            options={batchOptions}
            {...register('batch_id')} />
          <Input label="Start *" id="cls-start" type="datetime-local" error={errors.scheduled_start?.message}
            {...register('scheduled_start', { required: 'Start time is required' })} />
          <Input label="End *" id="cls-end" type="datetime-local" error={errors.scheduled_end?.message}
            {...register('scheduled_end', { required: 'End time is required' })} />
          <Input label="Max Students" id="cls-max" type="number" {...register('max_students', { valueAsNumber: true })} />
          <Input label="Meeting Link" id="cls-meet" {...register('meeting_link')} />
          <div className="col-span-2 p-3 bg-bg-muted rounded-lg text-xs text-text-muted flex items-center gap-2">
            <BookOpen size={14} /> This class will be automatically linked to <strong>{syllabus.title}</strong>
          </div>
        </form>
      </Modal>
    </div>
  );
};
