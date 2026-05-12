import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { useApi } from '../../hooks/useApi';
import { syllabusApi } from '../../api/syllabus.api';
import { ToastContext } from '../../components/layout/AppLayout';
import { formatDate } from '../../utils/format';
import type { Syllabus } from '../../types';

type SyllabusForm = { title: string; description?: string };

export const SyllabusList: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const { data, meta, loading, refetch, params, updateParams } = useApi<Syllabus>({ fetcher: syllabusApi.list });
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Syllabus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SyllabusForm>();

  const openCreate = () => { setEditTarget(null); reset({}); setModalOpen(true); };
  const openEdit = (s: Syllabus) => { setEditTarget(s); reset({ title: s.title, description: s.description ?? '' }); setModalOpen(true); };

  const onSubmit = async (form: SyllabusForm) => {
    setSubmitting(true);
    try {
      if (editTarget) { await syllabusApi.update(editTarget.id, form); addToast('Syllabus updated', 'success'); }
      else { await syllabusApi.create(form); addToast('Syllabus created', 'success'); }
      setModalOpen(false); refetch();
    } catch (e: any) { addToast(e?.response?.data?.message ?? 'Failed', 'error'); }
    finally { setSubmitting(false); }
  };

  const onDelete = async () => {
    if (!deleteId) return;
    try { await syllabusApi.delete(deleteId); addToast('Deleted', 'success'); setDeleteId(null); refetch(); }
    catch { addToast('Failed', 'error'); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <BookOpen size={22} className="text-bg-brand" /> Syllabus
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{meta?.total ?? 0} syllabuses</p>
        </div>
        <Button onClick={openCreate} icon={<Plus size={16} />}>Add Syllabus</Button>
      </div>

      <Table<Syllabus>
        loading={loading} data={data} emptyMessage="No syllabus found."
        columns={[
          { key: 'title', header: 'Title', render: row => <Link to={`/syllabus/${row.id}`} className="font-medium text-bg-brand hover:underline">{row.title}</Link> },
          { key: 'description', header: 'Description', render: row => <span className="text-text-muted text-sm truncate max-w-xs block">{row.description ?? '—'}</span> },
          { key: 'created_at', header: 'Created', render: row => formatDate(row.created_at) },
          { key: 'actions', header: '', render: row => (
            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="sm" onClick={() => openEdit(row)} icon={<Pencil size={14} />} />
              <Button variant="ghost" size="sm" onClick={() => setDeleteId(row.id)} icon={<Trash2 size={14} />} className="hover:text-error-strong hover:bg-bg-error" />
            </div>
          ) },
        ]}
      />
      {meta && <Pagination page={params.page ?? 1} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onPageChange={p => { updateParams({ page: p }); refetch({ ...params, page: p }); }} />}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Syllabus' : 'New Syllabus'} size="sm"
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={submitting} onClick={handleSubmit(onSubmit)}>{editTarget ? 'Save' : 'Create'}</Button></>}
      >
        <form className="space-y-4">
          <Input label="Title *" id="syl-title" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
          <Textarea label="Description" id="syl-desc" rows={3} {...register('description')} />
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Syllabus" size="sm"
        footer={<><Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button><Button variant="danger" onClick={onDelete}>Delete</Button></>}
      ><p className="text-sm text-text-secondary">Delete this syllabus?</p></Modal>
    </div>
  );
};
