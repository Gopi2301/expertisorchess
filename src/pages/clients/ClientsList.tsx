import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Users, Search } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { useApi } from '../../hooks/useApi';
import { clientsApi } from '../../api/clients.api';
import { ToastContext } from '../../components/layout/AppLayout';
import { formatDate } from '../../utils/format';
import type { Client } from '../../types';

type ClientForm = {
  name: string; email: string; phone?: string;
  address?: string; notes?: string;
};

export const ClientsList: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const { data, meta, loading, refetch, params, updateParams } = useApi<Client>({
    fetcher: clientsApi.list,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Client | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientForm>();

  const openCreate = () => { setEditTarget(null); reset({}); setModalOpen(true); };
  const openEdit = (c: Client) => {
    setEditTarget(c);
    reset({ name: c.name, email: c.email, phone: c.phone ?? '', address: c.address ?? '', notes: c.notes ?? '' });
    setModalOpen(true);
  };

  const onSubmit = async (form: ClientForm) => {
    setSubmitting(true);
    try {
      if (editTarget) {
        await clientsApi.update(editTarget.id, form);
        addToast('Client updated', 'success');
      } else {
        await clientsApi.create(form);
        addToast('Client created', 'success');
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
      await clientsApi.delete(deleteId);
      addToast('Client deleted', 'success');
      setDeleteId(null);
      refetch();
    } catch { addToast('Failed to delete', 'error'); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Users size={22} className="text-bg-brand" /> Clients
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{meta?.total ?? 0} total clients</p>
        </div>
        <Button onClick={openCreate} icon={<Plus size={16} />}>Add Client</Button>
      </div>

      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-bg-strong border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bg-brand"
          placeholder="Search clients…"
          onChange={e => updateParams({ search: e.target.value, page: 1 })}
        />
      </div>

      <Table<Client>
        loading={loading}
        data={data}
        emptyMessage="No clients found."
        columns={[
          {
            key: 'name', header: 'Client',
            render: row => (
              <div>
                <p className="font-medium text-text-primary text-sm">{row.name}</p>
                <p className="text-xs text-text-muted">{row.email}</p>
              </div>
            ),
          },
          {
            key: 'phone', header: 'Phone', render: row => row.phone ?? '—'
          },
          {
            key: 'students', header: 'Students',
            render: row => (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-bg-brand/10 text-bg-brand text-xs font-semibold">
                  {row._count?.students ?? 0}
                </span>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {row.students && row.students.length > 0 ? (
                    row.students.map(s => (
                      <span key={s.id} className="text-[10px] leading-tight text-text-secondary bg-bg-strong px-1.5 py-0.5 rounded border border-border truncate max-w-[80px]">
                        {s.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-text-muted">None</span>
                  )}
                </div>
              </div>
            ),
          },
          { key: 'created_at', header: 'Joined', render: row => formatDate(row.created_at) },
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
        title={editTarget ? 'Edit Client' : 'Add Client'} size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={submitting} onClick={handleSubmit(onSubmit)}>
              {editTarget ? 'Save Changes' : 'Create Client'}
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full Name *" id="client-name" error={errors.name?.message}
            {...register('name', { required: 'Name is required' })} />
          <Input label="Email *" id="client-email" type="email" error={errors.email?.message}
            {...register('email', { required: 'Email is required' })} />
          <Input label="Phone" id="client-phone" {...register('phone')} />
          <Textarea label="Address" id="client-address" rows={2} {...register('address')} />
          <Textarea label="Notes" id="client-notes" rows={2} {...register('notes')} />
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Client" size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={onDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">Are you sure you want to delete this client?</p>
      </Modal>
    </div>
  );
};
