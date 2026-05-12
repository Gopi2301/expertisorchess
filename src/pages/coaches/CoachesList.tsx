import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2, Crown, Search, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useApi } from '../../hooks/useApi';
import { coachesApi } from '../../api/coaches.api';
import { CoachActivityDrawer } from './CoachActivityDrawer';
import { ToastContext } from '../../components/layout/AppLayout';
import { useAuth } from '../../contexts/AuthContext';
import type { Coach, Status } from '../../types';

type CoachForm = {
  name: string; email: string; phone?: string;
  fide_rating?: number; rapid_rating?: number; blitz_rating?: number;
  experience_years?: number; bio?: string; hourly_rate?: number;
  current_syllabus?: string;
};

type TabFilter = 'ALL' | 'PENDING' | 'ACTIVE' | 'REJECTED';
const TABS: { key: TabFilter; label: string }[] = [
  { key: 'ALL',      label: 'All' },
  { key: 'PENDING',  label: 'Pending' },
  { key: 'ACTIVE',   label: 'Active' },
  { key: 'REJECTED', label: 'Rejected' },
];

export const CoachesList: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const { hasRole }  = useAuth();
  const isSuperAdmin = hasRole('SUPER_ADMIN');

  const [activeTab, setActiveTab]     = useState<TabFilter>('ALL');
  const [editTarget, setEditTarget]   = useState<Coach | null>(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [drawerCoach, setDrawerCoach] = useState<Coach | null>(null);

  const { data, meta, loading, refetch, params, updateParams } = useApi<Coach>({
    fetcher: coachesApi.list,
    initialParams: {},
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CoachForm>();

  // ── Filtered data by tab ───────────────────────────────────────────────────
  const filtered = activeTab === 'ALL'
    ? data
    : data.filter(c => c.status === activeTab);

  const tabCount = (key: TabFilter) =>
    key === 'ALL' ? data.length : data.filter(c => c.status === key).length;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openEdit = (coach: Coach) => {
    setEditTarget(coach);
    reset({
      name: coach.name, email: coach.email, phone: coach.phone ?? '',
      fide_rating: coach.fide_rating,      rapid_rating: coach.rapid_rating,
      blitz_rating: coach.blitz_rating, experience_years: coach.experience_years,
      bio: coach.bio ?? '', hourly_rate: coach.hourly_rate,
      current_syllabus: coach.current_syllabus ?? '',
    });
    setModalOpen(true);
  };

  const onSubmit = async (formData: CoachForm) => {
    if (!editTarget) return;
    setSubmitting(true);
    try {
      await coachesApi.update(editTarget.id, formData);
      addToast('Coach updated successfully', 'success');
      setModalOpen(false);
      refetch();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to update coach', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const onApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await coachesApi.approve(id);
      addToast('Coach approved and set to Active', 'success');
      refetch();
    } catch {
      addToast('Failed to approve coach', 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const onReject = async (id: string) => {
    setRejectingId(id);
    try {
      await coachesApi.reject(id);
      addToast('Coach application rejected', 'success');
      refetch();
    } catch {
      addToast('Failed to reject coach', 'error');
    } finally {
      setRejectingId(null);
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

  const pendingCount = data.filter(c => c.status === 'PENDING').length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Crown size={22} className="text-bg-brand" /> Coaches
          </h1>
          <p className="text-sm text-text-muted mt-0.5">
            {meta?.total ?? 0} total
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-400 text-xs font-medium">
                <Clock size={11} /> {pendingCount} pending approval
              </span>
            )}
          </p>
        </div>
        {/* Link to public onboarding page */}
        <a
          href="/coach-apply"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-bg-elevated text-text-secondary text-xs hover:text-text-primary hover:border-bg-brand/40 transition-colors"
        >
          <ExternalLink size={12} /> Coach Onboarding Page
        </a>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative max-w-xs w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-bg-strong border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bg-brand"
            placeholder="Search coaches…"
            onChange={e => updateParams({ search: e.target.value, page: 1 })}
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 bg-bg-elevated border border-border rounded-xl p-1">
          {TABS.map(tab => {
            const count = tabCount(tab.key);
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${activeTab === tab.key
                    ? 'bg-bg-brand text-text-on-brand shadow-sm'
                    : 'text-text-muted hover:text-text-primary'}`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
                    ${activeTab === tab.key ? 'bg-white/20' :
                      tab.key === 'PENDING' ? 'bg-amber-400/20 text-amber-400' : 'bg-bg-strong'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Table<Coach>
        loading={loading}
        data={filtered}
        emptyMessage={activeTab === 'PENDING' ? 'No pending applications.' : 'No coaches found.'}
        columns={[
          {
            key: 'name', header: 'Coach',
            render: row => (
              <button
                onClick={() => setDrawerCoach(row)}
                className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-bg-brand/10 border border-bg-brand/20 flex items-center justify-center text-bg-brand text-xs font-bold">
                  {row.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-text-primary text-sm flex items-center gap-1">
                    {row.name}
                    <ExternalLink size={10} className="text-text-muted" />
                  </p>
                  <p className="text-xs text-text-muted">{row.email}</p>
                </div>
              </button>
            ),
          },
          {
            key: 'ratings', header: 'Ratings',
            render: row => (
              <div className="flex gap-2 text-xs">
                {row.fide_rating  && <span className="px-2 py-0.5 bg-bg-muted rounded-full text-text-secondary">FIDE {row.fide_rating}</span>}
                {row.rapid_rating && <span className="px-2 py-0.5 bg-bg-muted rounded-full text-text-secondary">Rapid {row.rapid_rating}</span>}
                {!row.fide_rating && !row.rapid_rating && <span className="text-text-muted">—</span>}
              </div>
            ),
          },
          { key: 'experience_years', header: 'Exp.', render: row => row.experience_years ? `${row.experience_years}y` : '—' },
          {
            key: 'hourly_rate', header: 'Rate',
            render: row => row.hourly_rate ? `₹${row.hourly_rate}/h` : '—'
          },
          {
            key: 'current_syllabus', header: 'Syllabus',
            render: row => (
              <div className="max-w-[150px] truncate text-xs text-text-secondary" title={row.current_syllabus ?? ''}>
                {row.current_syllabus || '—'}
              </div>
            )
          },
          { key: 'status', header: 'Status', render: row => <StatusBadge status={row.status} /> },
          {
            key: 'actions', header: '',
            render: row => (
              <div className="flex items-center justify-end gap-1">
                {isSuperAdmin && row.status === 'PENDING' && (
                  <>
                    {/* Approve */}
                    <Button
                      variant="ghost" size="sm"
                      loading={approvingId === row.id}
                      onClick={() => onApprove(row.id)}
                      icon={<CheckCircle2 size={14} />}
                      className="hover:text-green-400 hover:bg-green-400/10"
                      title="Approve"
                    />
                    {/* Reject */}
                    <Button
                      variant="ghost" size="sm"
                      loading={rejectingId === row.id}
                      onClick={() => onReject(row.id)}
                      icon={<XCircle size={14} />}
                      className="hover:text-red-400 hover:bg-red-400/10"
                      title="Reject"
                    />
                  </>
                )}
                {isSuperAdmin && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(row)} icon={<Pencil size={14} />} />
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(row.id)} icon={<Trash2 size={14} />}
                      className="hover:text-error-strong hover:bg-bg-error" />
                  </>
                )}
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

      {/* Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Coach"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={submitting} onClick={handleSubmit(onSubmit)}>Save Changes</Button>
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
          <div className="col-span-2">
            <Input label="Current Handling Syllabus" id="coach-syllabus" placeholder="e.g. Beginner to Intermediate / Endgame Masterclass" {...register('current_syllabus')} />
          </div>
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

      {/* Activity Drawer */}
      <CoachActivityDrawer
        coach={drawerCoach}
        onClose={() => setDrawerCoach(null)}
      />
    </div>
  );
};
