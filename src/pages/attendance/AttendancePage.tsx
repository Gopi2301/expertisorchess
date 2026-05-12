import React, { useState, useContext, useEffect } from 'react';
import { ClipboardList, CheckCircle } from 'lucide-react';
import { Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AttendanceBadge } from '../../components/ui/Badge';
import { ToastContext } from '../../components/layout/AppLayout';
import { classesApi } from '../../api/classes.api';
import { attendanceApi, type AttendanceRecord } from '../../api/attendance.api';
import { getInitials } from '../../utils/format';
import type { Class, Attendance } from '../../types';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export const AttendancePage: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [existing, setExisting] = useState<Attendance[]>([]);
  const [records, setRecords] = useState<Map<string, AttendanceStatus>>(new Map());
  const [remarks, setRemarks] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  useEffect(() => {
    classesApi.list({ limit: 100, sortBy: 'scheduled_start', sortOrder: 'desc' })
      .then(r => setClasses(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClassId) { setExisting([]); setRecords(new Map()); setSelectedClass(null); return; }
    setLoading(true);
    Promise.all([
      classesApi.get(selectedClassId),
      attendanceApi.getByClass(selectedClassId),
    ]).then(([classRes, attRes]) => {
      const cls = classRes.data;
      setSelectedClass(cls);
      const att = attRes.data;
      setExisting(att);

      // Build initial record map from existing attendance + enrolled students/coach
      const map = new Map<string, AttendanceStatus>();
      const remMap = new Map<string, string>();

      att.forEach(a => {
        const key = a.student_id ? `s:${a.student_id}` : `c:${a.coach_id}`;
        map.set(key, a.attendance_status as AttendanceStatus);
        if (a.remarks) remMap.set(key, a.remarks);
      });

      // Pre-fill enrolled students as PRESENT if not already recorded
      if (cls.students) {
        cls.students.forEach(sc => {
          const key = `s:${sc.student_id}`;
          if (!map.has(key)) map.set(key, 'PRESENT');
        });
      }
      setRecords(new Map(map));
      setRemarks(new Map(remMap));
    }).catch(() => addToast('Failed to load class data', 'error'))
      .finally(() => setLoading(false));
  }, [selectedClassId]);

  const setStatus = (key: string, status: AttendanceStatus) => {
    setRecords(prev => new Map(prev).set(key, status));
  };

  const setRemark = (key: string, remark: string) => {
    setRemarks(prev => new Map(prev).set(key, remark));
  };

  const onSubmit = async () => {
    if (!selectedClassId) return;
    setSubmitting(true);
    try {
      const attendanceRecords: AttendanceRecord[] = [];
      records.forEach((status, key) => {
        const [type, id] = key.split(':');
        attendanceRecords.push({
          ...(type === 's' ? { student_id: id } : { coach_id: id }),
          attendance_status: status,
          remarks: remarks.get(key) || undefined,
        });
      });
      await attendanceApi.bulkMark(selectedClassId, attendanceRecords);
      addToast(`Attendance marked for ${attendanceRecords.length} people`, 'success');
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to mark attendance', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const classOptions = classes.map(c => ({
    value: c.id,
    label: `${c.title} — ${new Date(c.scheduled_start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`,
  }));

  const statusButtons: { status: AttendanceStatus; label: string; color: string }[] = [
    { status: 'PRESENT', label: 'P', color: 'bg-bg-success text-text-success border border-green-800' },
    { status: 'ABSENT', label: 'A', color: 'bg-bg-error text-error-strong border border-red-900' },
    { status: 'LATE', label: 'L', color: 'bg-yellow-950 text-warning border border-yellow-800' },
    { status: 'EXCUSED', label: 'E', color: 'bg-bg-muted text-text-muted border border-border' },
  ];

  const renderPersonRow = (key: string, name: string, role: 'student' | 'coach') => {
    const current = records.get(key) ?? 'PRESENT';
    return (
      <div key={key} className="flex items-center gap-4 py-3 px-4 border-b border-border last:border-0 hover:bg-bg-muted/20 transition-colors">
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
          ${role === 'coach' ? 'bg-bg-brand/10 text-bg-brand border border-bg-brand/20' : 'bg-bg-elevated text-text-secondary'}`}>
          {getInitials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{name}</p>
          <p className="text-xs text-text-muted capitalize">{role}</p>
        </div>
        {/* Status picker */}
        <div className="flex gap-1.5">
          {statusButtons.map(btn => (
            <button
              key={btn.status}
              onClick={() => setStatus(key, btn.status)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                current === btn.status
                  ? btn.color + ' ring-1 ring-offset-1 ring-offset-bg ring-current scale-105'
                  : 'bg-bg-elevated text-text-muted hover:bg-bg-strong'
              }`}
              title={btn.status}
            >
              {btn.label}
            </button>
          ))}
        </div>
        {/* Existing badge */}
        <div className="w-20 text-right">
          {existing.find(a => (a.student_id && `s:${a.student_id}` === key) || (a.coach_id && `c:${a.coach_id}` === key))
            ? <AttendanceBadge status={current} />
            : <span className="text-xs text-text-muted">New</span>
          }
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <ClipboardList size={22} className="text-bg-brand" /> Attendance
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Mark attendance for a class session</p>
        </div>
      </div>

      {/* Class selector */}
      <div className="bg-bg-strong border border-border rounded-xl p-5">
        <div className="max-w-sm">
          <Select
            label="Select Class"
            id="att-class"
            options={classOptions}
            placeholder="Choose a class…"
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
          />
        </div>
      </div>

      {/* Attendance sheet */}
      {selectedClassId && (
        <div className="bg-bg-strong border border-border rounded-xl animate-slide-up">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">{selectedClass?.title}</h2>
              <p className="text-xs text-text-muted mt-0.5">
                P = Present · A = Absent · L = Late · E = Excused
              </p>
            </div>
            <Button
              onClick={onSubmit}
              loading={submitting}
              disabled={records.size === 0}
              icon={<CheckCircle size={16} />}
            >
              Save Attendance
            </Button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-text-muted text-sm">Loading class data…</div>
          ) : records.size === 0 ? (
            <div className="py-16 text-center text-text-muted text-sm">
              No enrolled students or coach found for this class.
            </div>
          ) : (
            <div>
              {/* Coach row */}
              {selectedClass?.coach && renderPersonRow(
                `c:${selectedClass.coach_id}`,
                selectedClass.coach.name,
                'coach',
              )}
              {/* Student rows */}
              {selectedClass?.students?.map(sc =>
                renderPersonRow(
                  `s:${sc.student_id}`,
                  sc.student?.name ?? sc.student_id,
                  'student',
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
