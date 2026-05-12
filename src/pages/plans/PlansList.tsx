import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useApi } from '../../hooks/useApi';
import { plansApi } from '../../api/plans.api';
import { ToastContext } from '../../components/layout/AppLayout';
import { formatCurrency } from '../../utils/format';
import type { Plan } from '../../types';

type PlanForm = {
  name: string; type: string;
  classes_per_month: number; duration_minutes: number;
  min_students: number; max_students: number;
  price: number; status: string;
};

export const PlansList: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const { data, meta, loading, refetch, params, updateParams } = useApi<Plan>({ fetcher: plansApi.list });
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Plan | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PlanForm>();

  const openCreate = () => { setEditTarget(null); reset({ type: 'INDIVIDUAL', min_students: 1, max_students: 1, status: 'ACTIVE' }); setModalOpen(true); };
  const openEdit = (p: Plan) => {
    setEditTarget(p);
    reset({ name: p.name, type: p.type, classes_per_month: p.classes_per_month, duration_minutes: p.duration_minutes, min_students: p.min_students, max_students: p.max_students, price: Number(p.price), status: p.status });
    setModalOpen(true);
  };

  const onSubmit = async (form: PlanForm) => {
    setSubmitting(true);
    try {
      if (editTarget) { await plansApi.update(editTarget.id, form as any); addToast('Plan updated', 'success'); }
      else { await plansApi.create(form as any); addToast('Plan created', 'success'); }
      setModalOpen(false); refetch();
    } catch (e: any) { addToast(e?.response?.data?.message ?? 'Failed', 'error'); }
    finally { setSubmitting(false); }
  };

  const onDelete = async () => {
    if (!deleteId) return;
    try { await plansApi.delete(deleteId); addToast('Plan deleted', 'success'); setDeleteId(null); refetch(); }
    catch { addToast('Failed', 'error'); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <FileText size={22} className="text-bg-brand" /> Plans
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{meta?.total ?? 0} plans</p>
        </div>
        <Button onClick={openCreate} icon={<Plus size={16} />}>Add Plan</Button>
      </div>

      <Table<Plan>
        loading={loading} data={data} emptyMessage="No plans found."
        columns={[
          { key: 'name', header: 'Name', render: row => <span className="font-medium text-text-primary">{row.name}</span> },
          { key: 'type', header: 'Type', render: row => <span className="text-xs px-2 py-0.5 bg-bg-muted rounded-full text-text-secondary">{row.type}</span> },
          { key: 'classes_per_month', header: 'Classes/Month' },
          { key: 'duration_minutes', header: 'Duration', render: row => `${row.duration_minutes} min` },
          { key: 'students', header: 'Capacity', render: row => `${row.min_students}–${row.max_students} students` },
          { key: 'price', header: 'Price', render: row => <span className="font-semibold text-bg-brand">{formatCurrency(row.price)}</span> },
          { key: 'status', header: 'Status', render: row => <StatusBadge status={row.status} /> },
          { key: 'actions', header: '', render: row => (
            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="sm" onClick={() => openEdit(row)} icon={<Pencil size={14} />} />
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(row.id)} icon={<Trash2 size={14} />} className="hover:text-error-strong hover:bg-bg-error" />
            </div>
          ) },
        ]}
      />
      {meta && <Pagination page={params.page ?? 1} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onPageChange={p => { updateParams({ page: p }); refetch({ ...params, page: p }); }} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Plan' : 'New Plan'} size="md"
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={submitting} onClick={handleSubmit(onSubmit)}>{editTarget ? 'Save' : 'Create Plan'}</Button></>}
      >
        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Input label="Plan Name *" id="p-name" error={errors.name?.message} {...register('name', { required: 'Required' })} /></div>
          <Select label="Type" id="p-type" options={[{ value: 'INDIVIDUAL', label: 'Individual' }, { value: 'GROUP', label: 'Group' }]} {...register('type')} />
          <Input label="Price (₹) *" id="p-price" type="number" step="0.01" error={errors.price?.message} {...register('price', { required: 'Required', valueAsNumber: true })} />
          <Input label="Classes/Month *" id="p-cpm" type="number" {...register('classes_per_month', { required: true, valueAsNumber: true })} />
          <Input label="Duration (min) *" id="p-dur" type="number" {...register('duration_minutes', { required: true, valueAsNumber: true })} />
          <Input label="Min Students" id="p-min" type="number" {...register('min_students', { valueAsNumber: true })} />
          <Input label="Max Students" id="p-max" type="number" {...register('max_students', { valueAsNumber: true })} />
          <Select label="Status" id="p-status" options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]} {...register('status')} />
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Plan" size="sm"
        footer={<><Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button><Button variant="danger" onClick={onDelete}>Delete</Button></>}
      ><p className="text-sm text-text-secondary">Delete this plan?</p></Modal>
    </div>
  );
};
