import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, GraduationCap, Search } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { StatusBadge, ChessLevelBadge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { useApi } from '../../hooks/useApi';
import { studentsApi } from '../../api/students.api';
import { clientsApi } from '../../api/clients.api';
import { ToastContext } from '../../components/layout/AppLayout';
import type { Student, Client } from '../../types';

type StudentForm = {
  name: string; client_id: string; email?: string; phone?: string;
  age?: number; chess_level: string; current_rating?: number;
  goals?: string; status: string; relation_to_client: string;
};

export const StudentsList: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const { data, meta, loading, refetch, params, updateParams } = useApi<Student>({
    fetcher: studentsApi.list,
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentForm>();

  // Load clients for dropdown
  useEffect(() => {
    clientsApi.list({ limit: 100 }).then(r => setClients(r.data)).catch(() => {});
  }, []);

  const openCreate = () => { setEditTarget(null); reset({ chess_level: 'BEGINNER', status: 'ACTIVE', relation_to_client: 'PARENT' }); setModalOpen(true); };
  const openEdit = (s: Student) => {
    setEditTarget(s);
    reset({
      name: s.name, client_id: s.client_id, email: s.email ?? '',
      phone: s.phone ?? '', age: s.age, chess_level: s.chess_level,
      current_rating: s.current_rating, goals: s.goals ?? '',
      status: s.status, relation_to_client: s.relation_to_client,
    });
    setModalOpen(true);
  };

  const onSubmit = async (form: StudentForm) => {
    setSubmitting(true);
    try {
      if (editTarget) {
        await studentsApi.update(editTarget.id, form as any);
        addToast('Student updated', 'success');
      } else {
        await studentsApi.create(form as any);
        addToast('Student created', 'success');
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
      await studentsApi.delete(deleteId);
      addToast('Student deleted', 'success');
      setDeleteId(null);
      refetch();
    } catch { addToast('Failed to delete', 'error'); }
  };

  const clientOptions = clients.map(c => ({ value: c.id, label: `${c.name} (${c.email})` }));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <GraduationCap size={22} className="text-bg-brand" /> Students
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{meta?.total ?? 0} total students</p>
        </div>
        <Button onClick={openCreate} icon={<Plus size={16} />}>Add Student</Button>
      </div>

      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-bg-strong border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bg-brand"
          placeholder="Search students…"
          onChange={e => updateParams({ search: e.target.value, page: 1 })}
        />
      </div>

      <Table<Student>
        loading={loading} data={data}
        emptyMessage="No students found."
        columns={[
          {
            key: 'name', header: 'Student',
            render: row => (
              <div>
                <p className="font-medium text-text-primary text-sm">{row.name}</p>
                <p className="text-xs text-text-muted">{row.age ? `Age ${row.age}` : ''} {row.email ?? ''}</p>
              </div>
            ),
          },
          { key: 'chess_level', header: 'Level', render: row => <ChessLevelBadge level={row.chess_level} /> },
          { key: 'current_rating', header: 'Rating', render: row => row.current_rating ?? '—' },
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
          page={params.page ?? 1} totalPages={meta.totalPages}
          total={meta.total} limit={meta.limit}
          onPageChange={p => { updateParams({ page: p }); refetch({ ...params, page: p }); }}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Student' : 'Add Student'} size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={submitting} onClick={handleSubmit(onSubmit)}>
              {editTarget ? 'Save Changes' : 'Create Student'}
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full Name *" id="s-name" error={errors.name?.message}
            {...register('name', { required: 'Name is required' })} />
          <Select
            label="Client (Parent/Guardian) *" id="s-client"
            options={clientOptions}
            placeholder="Select client…"
            error={errors.client_id?.message}
            {...register('client_id', { required: 'Client is required' })}
          />
          <Input label="Email" id="s-email" type="email" {...register('email')} />
          <Input label="Phone" id="s-phone" {...register('phone')} />
          <Input label="Age" id="s-age" type="number" {...register('age', { valueAsNumber: true })} />
          <Input label="Current Rating" id="s-rating" type="number" {...register('current_rating', { valueAsNumber: true })} />
          <Select
            label="Chess Level" id="s-level"
            options={[
              { value: 'BEGINNER', label: 'Beginner' },
              { value: 'INTERMEDIATE', label: 'Intermediate' },
              { value: 'ADVANCED', label: 'Advanced' },
              { value: 'EXPERT', label: 'Expert' },
            ]}
            {...register('chess_level')}
          />
          <Select
            label="Relation to Client" id="s-relation"
            options={[
              { value: 'PARENT', label: 'Parent' },
              { value: 'GUARDIAN', label: 'Guardian' },
              { value: 'SELF', label: 'Self' },
              { value: 'OTHER', label: 'Other' },
            ]}
            {...register('relation_to_client')}
          />
          <Select
            label="Status" id="s-status"
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'SUSPENDED', label: 'Suspended' },
            ]}
            {...register('status')}
          />
          <div className="col-span-2">
            <Textarea label="Goals" id="s-goals" rows={2} {...register('goals')} />
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Student" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={onDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">Are you sure you want to delete this student?</p>
      </Modal>
    </div>
  );
};
