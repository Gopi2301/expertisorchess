import React, { useEffect, useState, useContext } from 'react';
import { X, Users, Plus, Trash2, Search, UserPlus, Loader2 } from 'lucide-react';
import { batchesApi } from '../../api/batches';
import { studentsApi } from '../../api/students.api';
import { ToastContext } from '../../components/layout/AppLayout';
import type { Batch, Student } from '../../types';
import { Button } from '../../components/ui/Button';

interface BatchStudentsDrawerProps {
  batch: Batch | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export const BatchStudentsDrawer: React.FC<BatchStudentsDrawerProps> = ({ batch, onClose, onUpdate }) => {
  const { addToast } = useContext(ToastContext);
  const [students, setStudents] = useState<any[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [unenrolling, setUnenrolling] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const fetchBatchStudents = async () => {
    if (!batch) return;
    setLoading(true);
    try {
      const res = await batchesApi.findOne(batch.id);
      setStudents(res.data.students || []);
    } catch (err) {
      console.error('Failed to fetch batch students', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const res = await studentsApi.list({ limit: 100, search });
      // Filter out students already in the batch
      const existingIds = students.map(s => s.student_id);
      setAvailableStudents(res.data.filter(s => !existingIds.includes(s.id)));
    } catch (err) {
      console.error('Failed to fetch available students', err);
    }
  };

  useEffect(() => {
    if (batch) {
      fetchBatchStudents();
      setShowAdd(false);
    } else {
      setStudents([]);
    }
  }, [batch?.id]);

  useEffect(() => {
    if (showAdd) {
      fetchAvailableStudents();
    }
  }, [showAdd, search, students]);

  const onEnroll = async (studentId: string) => {
    if (!batch) return;
    setEnrolling(studentId);
    try {
      await batchesApi.enrollStudent(batch.id, studentId);
      addToast('Student enrolled successfully', 'success');
      fetchBatchStudents();
      onUpdate?.();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to enroll student', 'error');
    } finally {
      setEnrolling(null);
    }
  };

  const onUnenroll = async (studentId: string) => {
    if (!batch) return;
    setUnenrolling(studentId);
    try {
      await batchesApi.unenrollStudent(batch.id, studentId);
      addToast('Student removed from batch', 'success');
      fetchBatchStudents();
      onUpdate?.();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to remove student', 'error');
    } finally {
      setUnenrolling(null);
    }
  };

  const open = !!batch;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-bg-strong border-l border-border z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bg-brand/10 border border-bg-brand/20 flex items-center justify-center text-bg-brand font-bold">
              <Users size={20} />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm">{batch?.title}</p>
              <p className="text-xs text-text-muted">{students.length} Students Enrolled</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-border bg-bg-muted/50 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            {showAdd ? 'Enroll New Students' : 'Current Students'}
          </h3>
          <Button 
            size="sm" 
            variant={showAdd ? 'ghost' : 'primary'}
            onClick={() => setShowAdd(!showAdd)}
            icon={showAdd ? <X size={14} /> : <UserPlus size={14} />}
          >
            {showAdd ? 'Cancel' : 'Enroll Student'}
          </Button>
        </div>

        {/* Search for adding students */}
        {showAdd && (
          <div className="px-6 py-3 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm bg-bg-elevated border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bg-brand"
                placeholder="Search students to add..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 text-bg-brand animate-spin" />
            </div>
          ) : showAdd ? (
            <div className="space-y-3">
              {availableStudents.length > 0 ? (
                availableStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between bg-bg-elevated border border-border rounded-xl p-3 hover:border-bg-brand/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bg-brand/10 flex items-center justify-center text-bg-brand text-xs font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-text-primary font-medium">{student.name}</p>
                        <p className="text-[10px] text-text-muted uppercase font-semibold">{student.chess_level}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onEnroll(student.id)}
                      loading={enrolling === student.id}
                      icon={<Plus size={14} />}
                      className="text-bg-brand hover:bg-bg-brand/10"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-text-muted">No available students found.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {students.length > 0 ? (
                students.map(bs => (
                  <div key={bs.id} className="flex items-center justify-between bg-bg-muted/30 border border-border rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary text-xs font-bold border border-border">
                        {bs.student?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="text-sm text-text-primary font-medium">{bs.student?.name}</p>
                        <p className="text-[10px] text-text-muted">Enrolled {new Date(bs.enrolled_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onUnenroll(bs.student_id)}
                      loading={unenrolling === bs.student_id}
                      icon={<Trash2 size={14} />}
                      className="text-text-muted hover:text-error-strong hover:bg-bg-error/10"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="w-12 h-12 bg-bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users size={20} className="text-text-muted" />
                  </div>
                  <p className="text-sm text-text-muted mb-4">No students enrolled in this batch.</p>
                  <Button size="sm" onClick={() => setShowAdd(true)}>Enroll First Student</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
