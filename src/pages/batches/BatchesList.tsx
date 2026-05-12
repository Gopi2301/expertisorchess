import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Layers, Search, Users, BookOpen } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useApi } from '../../hooks/useApi';
import { batchesApi } from '../../api/batches';
import type { Batch } from '../../types';
import { coachesApi } from '../../api/coaches.api';
import { plansApi } from '../../api/plans.api';
import { syllabusApi } from '../../api/syllabus.api';
import { studentsApi } from '../../api/students.api';
import { ToastContext } from '../../components/layout/AppLayout';
import { BatchStudentsDrawer } from './BatchStudentsDrawer';

type BatchForm = {
  title: string;
  coach_id: string;
  plan_id: string;
  syllabus_id?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  student_ids?: string[];
};

export const BatchesList: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const { data, meta, loading, refetch, params, updateParams } = useApi<Batch>({
    fetcher: batchesApi.findAll,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Batch | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewStudentsBatch, setViewStudentsBatch] = useState<Batch | null>(null);

  // For form selects
  const [coaches, setCoaches] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [syllabuses, setSyllabuses] = useState<any[]>([]);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BatchForm>();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [coachRes, planRes, syllabusRes, studentRes] = await Promise.all([
          coachesApi.list({ limit: 100, status: 'ACTIVE' }),
          plansApi.list({ limit: 100 }),
          syllabusApi.list({ limit: 100 }),
          studentsApi.list({ limit: 100, status: 'ACTIVE' }),
        ]);
        setCoaches(coachRes.data || []);
        setPlans(planRes.data);
        setSyllabuses(syllabusRes.data);
        setAvailableStudents(studentRes.data);
      } catch (err) {
        console.error('Failed to fetch form data', err);
      }
    };
    fetchFormData();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setSelectedStudentIds([]);
    reset({ status: 'ACTIVE' });
    setModalOpen(true);
  };

  const openEdit = (batch: Batch) => {
    setEditTarget(batch);
    setSelectedStudentIds([]); // We manage students via the drawer for existing batches
    reset({
      title: batch.title,
      coach_id: batch.coach_id,
      plan_id: batch.plan_id,
      syllabus_id: batch.syllabus_id || '',
      status: batch.status as any,
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData: BatchForm) => {
    setSubmitting(true);
    try {
      if (editTarget) {
        await batchesApi.update(editTarget.id, formData);
        addToast('Batch updated successfully', 'success');
      } else {
        await batchesApi.create({ ...formData, student_ids: selectedStudentIds });
        addToast('Batch created successfully', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to save batch', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!deleteId) return;
    try {
      await batchesApi.remove(deleteId);
      addToast('Batch deleted', 'success');
      setDeleteId(null);
      refetch();
    } catch {
      addToast('Failed to delete batch', 'error');
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Layers size={22} className="text-bg-brand" /> Groups & Batches
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Manage student groups, coach assignments, and plans.</p>
        </div>
        <Button onClick={openCreate} icon={<Plus size={16} />}>Create Group</Button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-bg-strong border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bg-brand"
          placeholder="Search batches…"
          onChange={e => updateParams({ search: e.target.value, page: 1 })}
        />
      </div>

      <Table<Batch>
        loading={loading}
        data={data}
        emptyMessage="No batches found. Add your first batch."
        columns={[
          {
            key: 'title', header: 'Batch',
            render: row => (
              <div>
                <p className="font-medium text-text-primary text-sm">{row.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <button 
                    onClick={() => setViewStudentsBatch(row)}
                    className="text-xs text-bg-brand hover:underline flex items-center gap-1 font-medium"
                  >
                    <Users size={12} /> {row._count?.students ?? 0} students
                  </button>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <BookOpen size={12} /> {row._count?.classes ?? 0} sessions
                  </span>
                </div>
                {row.students && row.students.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {row.students.map((bs: any) => (
                      <span key={bs.id} className="text-[10px] px-1.5 py-0.5 rounded-md bg-bg-muted border border-border text-text-secondary">
                        {bs.student?.name}
                      </span>
                    ))}
                    {(row._count?.students ?? 0) > row.students.length && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-bg-elevated border border-border text-text-muted italic">
                        +{(row._count?.students ?? 0) - row.students.length} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ),
          },
          {
            key: 'coach', header: 'Coach',
            render: row => row.coach?.name ?? '—'
          },
          {
            key: 'plan', header: 'Plan',
            render: row => row.plan?.name ?? '—'
          },
          { key: 'status', header: 'Status', render: row => <StatusBadge status={row.status as any} /> },
          {
            key: 'actions', header: '',
            render: row => (
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(row)} icon={<Pencil size={14} />} />
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(row.id)} icon={<Trash2 size={14} />}
                  className="hover:text-error-strong hover:bg-bg-error" />
              </div>
            ),
          },
        ]}
      />

      {meta && (
        <Pagination
          page={params.page ?? 1}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={p => { updateParams({ page: p }); refetch({ ...params, page: p }); }}
        />
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Batch' : 'Add Batch'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={submitting} onClick={handleSubmit(onSubmit)}>
              {editTarget ? 'Save Changes' : 'Create Batch'}
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-span-2">
            <Input label="Batch Title *" id="batch-title" error={errors.title?.message}
              {...register('title', { required: 'Title is required' })} />
          </div>
          
          <Select
            label="Coach *" id="batch-coach"
            error={errors.coach_id?.message}
            placeholder="Select a Coach"
            options={coaches.map(c => ({ value: c.id, label: c.name }))}
            {...register('coach_id', { required: 'Coach is required' })}
          />

          <Select
            label="Plan *" id="batch-plan"
            error={errors.plan_id?.message}
            options={plans.map(p => ({ value: p.id, label: p.name }))}
            {...register('plan_id', { required: 'Plan is required' })}
          />

          <Select
            label="Syllabus" id="batch-syllabus"
            options={[
              { value: '', label: 'Select Syllabus' },
              ...syllabuses.map(s => ({ value: s.id, label: s.title }))
            ]}
            {...register('syllabus_id')}
          />

          <Select
            label="Status" id="batch-status"
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'SUSPENDED', label: 'Suspended' },
            ]}
            {...register('status')}
          />

          {!editTarget && (
            <div className="col-span-2 space-y-2 mt-2">
              <label className="text-sm font-medium text-text-primary flex items-center justify-between">
                Initial Students
                <span className="text-[10px] text-text-muted bg-bg-muted px-1.5 py-0.5 rounded uppercase">Optional</span>
              </label>
              <div className="bg-bg-muted/50 border border-border rounded-lg p-3 max-h-40 overflow-y-auto grid grid-cols-2 gap-2">
                {availableStudents.length > 0 ? (
                  availableStudents.map(student => (
                    <label key={student.id} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-border text-bg-brand focus:ring-bg-brand/30 w-4 h-4 bg-bg-elevated"
                        checked={selectedStudentIds.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedStudentIds([...selectedStudentIds, student.id]);
                          else setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                        }}
                      />
                      {student.name}
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-text-muted text-center py-2 col-span-2">No active students found.</p>
                )}
              </div>
              <p className="text-[10px] text-text-muted italic">You can also manage students later by clicking on the student count in the table.</p>
            </div>
          )}
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Batch" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={onDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">Are you sure you want to delete this batch? This action cannot be undone.</p>
      </Modal>

      {/* Students Management Drawer */}
      <BatchStudentsDrawer 
        batch={viewStudentsBatch} 
        onClose={() => setViewStudentsBatch(null)}
        onUpdate={refetch}
      />
    </div>
  );
};
