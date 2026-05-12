import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Crown, Search } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useApi } from '../../hooks/useApi';
import { coachesApi } from '../../api/coaches.api';
import { ToastContext } from '../../components/layout/AppLayout';
import type { Coach } from '../../types';

type CoachForm = {
  name: string; email: string; phone?: string;
  fide_rating?: number; rapid_rating?: number; blitz_rating?: number;
  experience_years?: number; bio?: string; hourly_rate?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
};

export const CoachesList: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const { data, meta, loading, refetch, params, updateParams } = useApi<Coach>({
    fetcher: coachesApi.list,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Coach | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CoachForm>();

  const openCreate = () => { setEditTarget(null); reset({}); setModalOpen(true); };
  const openEdit = (coach: Coach) => {
    setEditTarget(coach);
    reset({
      name: coach.name, email: coach.email, phone: coach.phone ?? '',
      fide_rating: coach.fide_rating, rapid_rating: coach.rapid_rating,
      blitz_rating: coach.blitz_rating, experience_years: coach.experience_years,
      bio: coach.bio ?? '', hourly_rate: coach.hourly_rate ? Number(coach.hourly_rate) : undefined,
      status: coach.status,
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: CoachForm) => {
    setSubmitting(true);
    try {
      if (editTarget) {
        await coachesApi.update(editTarget.id, data);
        addToast('Coach updated successfully', 'success');
      } else {
        await coachesApi.create(data);
        addToast('Coach created successfully', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to save coach', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!deleteId) return;
    try {
      await coachesApi.delete(deleteId);
      addToast('Coach deleted', 'success');
      setDeleteId(null);
      refetch();
    } catch {
      addToast('Failed to delete coach', 'error');
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Crown size={22} className="text-bg-brand" /> Coaches
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{meta?.total ?? 0} total coaches</p>
        </div>
        <Button onClick={openCreate} icon={<Plus size={16} />}>Add Coach</Button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-bg-strong border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bg-brand"
          placeholder="Search coaches…"
          onChange={e => updateParams({ search: e.target.value, page: 1 })}
        />
      </div>

      <Table<Coach>
        loading={loading}
        data={data}
        emptyMessage="No coaches found. Add your first coach."
        columns={[
          {
            key: 'name', header: 'Coach',
            render: row => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bg-brand/10 border border-bg-brand/20 flex items-center justify-center text-bg-brand text-xs font-bold">
                  {row.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-text-primary text-sm">{row.name}</p>
                  <p className="text-xs text-text-muted">{row.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'ratings', header: 'Ratings',
            render: row => (
              <div className="flex gap-2 text-xs">
                {row.fide_rating && <span className="px-2 py-0.5 bg-bg-muted rounded-full text-text-secondary">FIDE {row.fide_rating}</span>}
                {row.rapid_rating && <span className="px-2 py-0.5 bg-bg-muted rounded-full text-text-secondary">Rapid {row.rapid_rating}</span>}
                {!row.fide_rating && !row.rapid_rating && <span className="text-text-muted">—</span>}
              </div>
            ),
          },
          { key: 'experience_years', header: 'Exp.', render: row => row.experience_years ? `${row.experience_years}y` : '—' },
          { key: 'status', header: 'Status', render: row => <StatusBadge status={row.status} /> },
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
        title={editTarget ? 'Edit Coach' : 'Add Coach'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={submitting} onClick={handleSubmit(onSubmit)}>
              {editTarget ? 'Save Changes' : 'Create Coach'}
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full Name *" id="coach-name" error={errors.name?.message}
            {...register('name', { required: 'Name is required' })} />
          <Input label="Email *" id="coach-email" type="email" error={errors.email?.message}
            {...register('email', { required: 'Email is required' })} />
          <Input label="Phone" id="coach-phone" {...register('phone')} />
          <Input label="Hourly Rate (₹)" id="coach-rate" type="number" {...register('hourly_rate', { valueAsNumber: true })} />
          <Input label="FIDE Rating" id="coach-fide" type="number" {...register('fide_rating', { valueAsNumber: true })} />
          <Input label="Rapid Rating" id="coach-rapid" type="number" {...register('rapid_rating', { valueAsNumber: true })} />
          <Input label="Blitz Rating" id="coach-blitz" type="number" {...register('blitz_rating', { valueAsNumber: true })} />
          <Input label="Experience (years)" id="coach-exp" type="number" {...register('experience_years', { valueAsNumber: true })} />
          <Select
            label="Status" id="coach-status"
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'SUSPENDED', label: 'Suspended' },
            ]}
            {...register('status')}
          />
          <div className="col-span-2">
            <Textarea label="Bio" id="coach-bio" rows={3} {...register('bio')} />
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Coach" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={onDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">Are you sure you want to delete this coach? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};
