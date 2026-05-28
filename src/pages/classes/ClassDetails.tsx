import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, User, BookOpen, Users, 
  ExternalLink, ArrowLeft, Pencil, Trash2, 
  CheckCircle, XCircle, AlertCircle, Play,
  ClipboardCheck, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { classesApi } from '../../api/classes.api';
import { attendanceApi, type AttendanceRecord } from '../../api/attendance.api';
import { Button } from '../../components/ui/Button';
import { ClassStatusBadge, AttendanceBadge } from '../../components/ui/Badge';
import { formatDateTime, getInitials } from '../../utils/format';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import type { Class, Attendance, AttendanceStatus, Coach, Plan, Syllabus } from '../../types';
import { ToastContext } from '../../components/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { coachesApi } from '../../api/coaches.api';
import { batchesApi } from '../../api/batches';
import { plansApi } from '../../api/plans.api';
import { syllabusApi } from '../../api/syllabus.api';

import { useRoutePrefix } from '../../hooks/useRoutePrefix';

type ClassForm = {
  title: string; coach_id: string; plan_id: string; syllabus_id?: string;
  scheduled_start: string; scheduled_end: string;
  max_students: number; meeting_link?: string; batch_id?: string;
};

export const ClassDetails: React.FC = () => {
  const prefix = useRoutePrefix();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const { hasRole } = useAuth();
  const isAdmin = hasRole('SUPER_ADMIN');
  const [classData, setClassData] = useState<Class | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [isAttendanceMode, setIsAttendanceMode] = useState(false);
  const [attRecords, setAttRecords] = useState<Map<string, AttendanceStatus>>(new Map());
  const [attRemarks, setAttRemarks] = useState<Map<string, string>>(new Map());
  
  // New states for Completion & Verification
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [completionData, setCompletionData] = useState({
    actual_start: '',
    actual_end: '',
    coach_status: 'PRESENT' as AttendanceStatus,
    recording_url: '',
  });

  // Edit states
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClassForm>();

  useEffect(() => {
    if (id) {
      fetchClass();
    }
    // Fetch options for edit modal
    coachesApi.list({ limit: 100 }).then(r => setCoaches(r.data)).catch(() => {});
    plansApi.list({ limit: 100 }).then(r => setPlans(r.data)).catch(() => {});
    syllabusApi.list({ limit: 100 }).then(r => setSyllabuses(r.data)).catch(() => {});
    batchesApi.findAll({ limit: 100 }).then(r => setBatches(r.data)).catch(() => {});
  }, [id]);

  const fetchClass = async () => {
    try {
      setLoading(true);
      const [classRes, attendanceRes] = await Promise.all([
        classesApi.get(id!),
        attendanceApi.getByClass(id!),
      ]);
      
      const cls = classRes.data;
      setClassData(cls);
      const att = attendanceRes.data;
      setAttendance(att);

      // Initialize attendance map
      const map = new Map<string, AttendanceStatus>();
      const remMap = new Map<string, string>();

      att.forEach(a => {
        const key = a.student_id ? `s:${a.student_id}` : `c:${a.coach_id}`;
        map.set(key, a.attendance_status);
        if (a.remarks) remMap.set(key, a.remarks);
      });

      // Default to PRESENT for enrolled students if not marked
      const students = cls.students?.length ? cls.students : (cls.batch?.students?.map(bs => ({ student_id: bs.student_id })) || []);
      students.forEach((sc: any) => {
        const key = `s:${sc.student_id}`;
        if (!map.has(key)) map.set(key, 'PRESENT');
      });

      // Default coach to PRESENT
      if (cls.coach_id) {
        const key = `c:${cls.coach_id}`;
        if (!map.has(key)) map.set(key, 'PRESENT');
      }

      setAttRecords(map);
      setAttRemarks(remMap);
    } catch (error) {
      addToast('Failed to load class details', 'error');
      navigate(`${prefix}/classes`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttendance = async () => {
    if (!id) return;
    try {
      setSavingAttendance(true);
      const records: AttendanceRecord[] = [];
      attRecords.forEach((status, key) => {
        const [type, pid] = key.split(':');
        records.push({
          ...(type === 's' ? { student_id: pid } : { coach_id: pid }),
          attendance_status: status,
          remarks: attRemarks.get(key) || undefined,
        });
      });
      await attendanceApi.bulkMark(id, records);
      addToast('Attendance saved successfully', 'success');
      setIsAttendanceMode(false);
      fetchClass();
    } catch (error: any) {
      addToast(error?.response?.data?.message ?? 'Failed to save attendance', 'error');
    } finally {
      setSavingAttendance(false);
    }
  };

  const setStatus = (key: string, status: AttendanceStatus) => {
    setAttRecords(prev => new Map(prev).set(key, status));
  };

  const handlePublish = async () => {
    if (!classData) return;
    try {
      setPublishing(true);
      await classesApi.publish(classData.id);
      addToast('Class published successfully', 'success');
      fetchClass();
    } catch (error: any) {
      addToast(error?.response?.data?.message ?? 'Failed to publish class', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleComplete = async () => {
    if (!id) return;
    try {
      setCompleting(true);
      await classesApi.complete(id, completionData);
      addToast('Class marked as completed', 'success');
      setShowCompleteModal(false);
      fetchClass();
    } catch (error: any) {
      addToast(error?.response?.data?.message ?? 'Failed to complete class', 'error');
    } finally {
      setCompleting(false);
    }
  };

  const handleVerify = async () => {
    if (!id) return;
    try {
      setVerifying(true);
      await classesApi.verify(id);
      addToast('Class verified successfully', 'success');
      fetchClass();
    } catch (error: any) {
      addToast(error?.response?.data?.message ?? 'Failed to verify class', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await classesApi.delete(id);
      addToast('Class deleted successfully', 'success');
      navigate(`${prefix}/classes`);
    } catch (error: any) {
      addToast(error?.response?.data?.message ?? 'Failed to delete class', 'error');
    }
  };

  const openCompleteModal = () => {
    if (!classData) return;
    setCompletionData({
      actual_start: classData.scheduled_start.substring(0, 16), // Format for datetime-local
      actual_end: new Date().toISOString().substring(0, 16),
      coach_status: 'PRESENT',
      recording_url: classData.recording_url || '',
    });
    setShowCompleteModal(true);
  };

  const toLocalInput = (iso: string) => new Date(iso).toISOString().slice(0, 16);

  const openEdit = () => {
    if (!classData) return;
    reset({
      title: classData.title,
      coach_id: classData.coach_id,
      plan_id: classData.plan_id,
      syllabus_id: classData.syllabus_id ?? '',
      max_students: classData.max_students,
      meeting_link: classData.meeting_link ?? '',
      batch_id: classData.batch_id ?? '',
      scheduled_start: toLocalInput(classData.scheduled_start),
      scheduled_end: toLocalInput(classData.scheduled_end),
    });
    setShowEditModal(true);
  };

  const onEditSubmit = async (form: ClassForm) => {
    if (!id) return;
    setSubmittingEdit(true);
    try {
      const payload = {
        ...form,
        max_students: Number(form.max_students),
        scheduled_start: new Date(form.scheduled_start).toISOString(),
        scheduled_end: new Date(form.scheduled_end).toISOString(),
        class_type: form.batch_id ? 'GROUP' : 'INDIVIDUAL' as any,
        batch_id: form.batch_id || undefined,
      };
      if (isAdmin) {
        await classesApi.update(id, payload);
      } else {
        await classesApi.coachUpdate(id, {
          title: payload.title,
          meeting_link: payload.meeting_link,
          scheduled_start: payload.scheduled_start,
          scheduled_end: payload.scheduled_end,
        });
      }
      addToast('Class updated successfully', 'success');
      setShowEditModal(false);
      fetchClass();
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to update class', 'error');
    } finally {
      setSubmittingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bg-brand"></div>
      </div>
    );
  }

  if (!classData) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to={`${prefix}/classes`} className="p-2 hover:bg-bg-strong rounded-lg transition-colors text-text-muted hover:text-text-primary">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClassStatusBadge status={classData.status} />
              <span className="text-xs text-text-muted">• {classData.class_type}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">{classData.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {classData.status === 'PUBLISHED' && (
            <Button onClick={openCompleteModal} variant="primary" icon={<CheckCircle size={16} />}>
              Complete Class
            </Button>
          )}
          {classData.status === 'COMPLETED' && !classData.admin_verified && (
            <Button onClick={handleVerify} loading={verifying} variant="primary" icon={<ShieldCheck size={16} />}>
              Verify (Admin)
            </Button>
          )}
          {classData.status === 'DRAFT' && (
            <Button onClick={handlePublish} loading={publishing} variant="primary" icon={<CheckCircle size={16} />}>
              Publish Class
            </Button>
          )}
          <Button variant="ghost" onClick={openEdit} icon={<Pencil size={16} />}>Edit</Button>
          {isAdmin && (
            <Button variant="ghost" onClick={handleDelete} className="text-error-strong hover:bg-bg-error" icon={<Trash2 size={16} />}>
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-bg-strong border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-bg-brand" /> Class Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-bg-muted rounded-lg text-text-secondary">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Scheduled Date</p>
                    <p className="text-sm text-text-primary font-medium">{formatDateTime(classData.scheduled_start)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-bg-muted rounded-lg text-text-secondary">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Duration</p>
                    <p className="text-sm text-text-primary font-medium">
                      {Math.round((new Date(classData.scheduled_end).getTime() - new Date(classData.scheduled_start).getTime()) / 60000)} minutes
                    </p>
                  </div>
                </div>
                {classData.actual_start && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-bg-success/10 rounded-lg text-text-success">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Actual Time</p>
                      <p className="text-sm text-text-primary font-medium">
                        {formatDateTime(classData.actual_start)} - {classData.actual_end ? formatDateTime(classData.actual_end).split(',')[1] : '...'}
                      </p>
                      {classData.actual_start && classData.actual_end && (
                        <p className="text-[10px] text-text-success font-bold mt-0.5">
                          Duration: {Math.round((new Date(classData.actual_end).getTime() - new Date(classData.actual_start).getTime()) / 60000)} mins
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {classData.meeting_link && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-bg-muted rounded-lg text-text-secondary">
                      <ExternalLink size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Meeting Link</p>
                      <a href={classData.meeting_link} target="_blank" rel="noopener noreferrer" 
                        className="text-sm text-bg-brand hover:underline flex items-center gap-1 font-medium">
                        Join Meeting <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-bg-muted rounded-lg text-text-secondary">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Coach</p>
                    <p className="text-sm text-text-primary font-medium">{classData.coach?.name || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-bg-muted rounded-lg text-text-secondary">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Syllabus</p>
                    <p className="text-sm text-text-primary font-medium">{classData.syllabus?.title || 'None selected'}</p>
                  </div>
                </div>
                {classData.batch && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-bg-muted rounded-lg text-text-secondary">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Batch</p>
                      <Link to={`${prefix}/batches`} className="text-sm text-bg-brand hover:underline font-medium">
                        {classData.batch.title}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enrolled Students */}
          <div className="bg-bg-strong border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Users size={18} className="text-bg-brand" /> 
                {isAttendanceMode ? 'Mark Attendance' : 'Enrolled Students'}
              </h2>
              <div className="flex items-center gap-2">
                {isAttendanceMode ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => setIsAttendanceMode(false)}>Cancel</Button>
                    <Button size="sm" variant="primary" onClick={handleSaveAttendance} loading={savingAttendance} icon={<CheckCircle size={14} />}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => setIsAttendanceMode(true)} icon={<ClipboardCheck size={14} />}>
                      Mark Attendance
                    </Button>
                    <span className="text-xs font-medium px-2 py-1 bg-bg-muted rounded-full text-text-secondary">
                      {classData.students?.length || 0} / {classData.max_students}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="divide-y divide-border">
              {/* Coach Row (Only in Attendance Mode) */}
              {isAttendanceMode && classData.coach && (
                <div className="p-4 bg-bg-brand/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-brand text-text-on-brand flex items-center justify-center font-bold">
                      {getInitials(classData.coach.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{classData.coach.name}</p>
                      <p className="text-xs text-bg-brand font-medium">Coach</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {(['PRESENT', 'ABSENT', 'LATE'] as AttendanceStatus[]).map(status => (
                      <button
                        key={status}
                        onClick={() => setStatus(`c:${classData.coach_id}`, status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          attRecords.get(`c:${classData.coach_id}`) === status
                            ? status === 'PRESENT' ? 'bg-bg-success text-text-success border border-green-800' :
                              status === 'ABSENT' ? 'bg-bg-error text-error-strong border border-red-900' :
                              'bg-yellow-950 text-warning border border-yellow-800'
                            : 'bg-bg-strong text-text-muted hover:bg-bg-muted'
                        }`}
                      >
                        {status.charAt(0)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(() => {
                const students = classData.students && classData.students.length > 0 
                  ? classData.students 
                  : (classData.batch?.students?.map(bs => ({
                      id: bs.id,
                      student: bs.student,
                      enrollment_status: 'CONFIRMED' as const,
                      enrolled_at: bs.enrolled_at,
                    })) || []);

                if (students.length > 0) {
                  return (students as any[]).map((enrollment) => {
                    const studentId = enrollment.student.id;
                    const key = `s:${studentId}`;
                    const currentStatus = attRecords.get(key);
                    const existingAtt = attendance.find(a => a.student_id === studentId);

                    return (
                      <div key={enrollment.id} className="p-4 flex items-center justify-between hover:bg-bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-bg-muted flex items-center justify-center text-text-secondary font-bold">
                            {getInitials(enrollment.student.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{enrollment.student.name}</p>
                            <p className="text-xs text-text-muted">{enrollment.student.chess_level}</p>
                          </div>
                        </div>
                        
                        {isAttendanceMode ? (
                          <div className="flex gap-1">
                            {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map(status => (
                              <button
                                key={status}
                                onClick={() => setStatus(key, status)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                  currentStatus === status
                                    ? status === 'PRESENT' ? 'bg-bg-success text-text-success border border-green-800' :
                                      status === 'ABSENT' ? 'bg-bg-error text-error-strong border border-red-900' :
                                      status === 'LATE' ? 'bg-yellow-950 text-warning border border-yellow-800' :
                                      'bg-bg-muted text-text-muted border border-border'
                                    : 'bg-bg-strong text-text-muted hover:bg-bg-muted'
                                }`}
                                title={status}
                              >
                                {status.charAt(0)}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            {existingAtt ? (
                              <AttendanceBadge status={existingAtt.attendance_status} />
                            ) : (
                              <div className="flex items-center gap-1.5">
                                {enrollment.enrollment_status === 'CONFIRMED' ? (
                                  <span className="flex items-center gap-1 text-xs text-text-success font-medium">
                                    <CheckCircle size={14} /> Confirmed
                                  </span>
                                ) : enrollment.enrollment_status === 'PENDING' ? (
                                  <span className="flex items-center gap-1 text-xs text-text-warning font-medium">
                                    <Clock size={14} /> Pending
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-xs text-error-strong font-medium">
                                    <XCircle size={14} /> Declined
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  });
                }

                return (
                  <div className="p-10 text-center text-text-muted">
                    <Users size={40} className="mx-auto mb-3 opacity-20" />
                    <p>No students enrolled yet.</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Right Column: Actions / Stats */}
        <div className="space-y-6">
          <div className="bg-bg-brand/5 border border-bg-brand/20 rounded-xl p-6">
            <h3 className="text-sm font-bold text-bg-brand uppercase tracking-wider mb-4">Meeting Link</h3>
            {classData.meeting_link ? (
              <div className="space-y-4">
                <div className="p-3 bg-bg-strong border border-border rounded-lg break-all text-xs font-mono text-text-secondary">
                  {classData.meeting_link}
                </div>
                <Button fullWidth onClick={() => { window.open(classData.meeting_link, '_blank'); }} icon={<Play size={16} />}>
                  Join Class Now
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-text-muted mb-4">No meeting link provided yet.</p>
                <Button variant="ghost" fullWidth size="sm">Add Link</Button>
              </div>
            )}
          </div>

          <div className="bg-bg-strong border border-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Capacity</span>
                <span className="text-sm font-semibold text-text-primary">
                  {Math.round(((classData.students?.length || 0) / classData.max_students) * 100)}%
                </span>
              </div>
              <div className="w-full bg-bg-muted rounded-full h-2">
                <div 
                  className="bg-bg-brand h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((classData.students?.length || 0) / classData.max_students) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-text-muted">
                {classData.students?.length || 0} students out of {classData.max_students} capacity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Class Session"
      >
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Actual Start Time"
              type="datetime-local"
              value={completionData.actual_start}
              onChange={(e) => setCompletionData(prev => ({ ...prev, actual_start: e.target.value }))}
            />
            <Input
              label="Actual End Time"
              type="datetime-local"
              value={completionData.actual_end}
              onChange={(e) => setCompletionData(prev => ({ ...prev, actual_end: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Coach Attendance Status</label>
            <div className="flex gap-2">
              {(['PRESENT', 'ABSENT', 'LATE'] as AttendanceStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => setCompletionData(prev => ({ ...prev, coach_status: status }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                    completionData.coach_status === status
                      ? 'bg-bg-brand text-text-on-brand border-bg-brand'
                      : 'bg-bg-strong text-text-muted border-border hover:border-border-strong'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Class Recording URL (Optional)"
            placeholder="https://zoom.us/rec/..."
            value={completionData.recording_url}
            onChange={(e) => setCompletionData(prev => ({ ...prev, recording_url: e.target.value }))}
          />

          <div className="pt-4 flex gap-3">
            <Button fullWidth variant="ghost" onClick={() => setShowCompleteModal(false)}>Cancel</Button>
            <Button fullWidth variant="primary" onClick={handleComplete} loading={completing}>
              Submit Log
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Class Modal */}
      <Modal 
        open={showEditModal} 
        onClose={() => setShowEditModal(false)}
        title="Edit Class" 
        size="lg"
      >
        <form className="grid grid-cols-2 gap-4 pt-2" onSubmit={handleSubmit(onEditSubmit)}>
          <div className="col-span-2">
            <Input label="Title *" id="cls-title" error={errors.title?.message}
              {...register('title', { required: 'Title is required' })} />
          </div>
          <Select label="Coach *" id="cls-coach" 
            options={coaches.map(c => ({ value: c.id, label: c.name }))} 
            placeholder="Select coach…"
            error={errors.coach_id?.message}
            disabled={!isAdmin}
            {...register('coach_id', { required: 'Coach is required' })} />
          <Select label="Plan *" id="cls-plan" 
            options={plans.map(p => ({ value: p.id, label: `${p.name} (max ${p.max_students})` }))} 
            placeholder="Select plan…"
            error={errors.plan_id?.message}
            disabled={!isAdmin}
            {...register('plan_id', { required: 'Plan is required' })} />
          <Select label="Syllabus" id="cls-syllabus" 
            options={[{ value: '', label: '— None —' }, ...syllabuses.map(s => ({ value: s.id, label: s.title }))]} 
            disabled={!isAdmin}
            {...register('syllabus_id')} />
          <Select label="Batch (Auto-Enroll Students)" id="cls-batch"
            options={[{ value: '', label: '— Individual Class (No Batch) —' }, ...batches.map(b => ({ value: b.id, label: b.title }))]}
            disabled={!isAdmin}
            {...register('batch_id')} />
          <Input label="Start *" id="cls-start" type="datetime-local" error={errors.scheduled_start?.message}
            {...register('scheduled_start', { required: 'Start time is required' })} />
          <Input label="End *" id="cls-end" type="datetime-local" error={errors.scheduled_end?.message}
            {...register('scheduled_end', { required: 'End time is required' })} />
          <Input label="Max Students" id="cls-max" type="number" disabled={!isAdmin} {...register('max_students', { valueAsNumber: true })} />
          <Input label="Meeting Link" id="cls-meet" {...register('meeting_link')} />
          
          <div className="col-span-2 pt-4 flex gap-3">
            <Button fullWidth variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button fullWidth variant="primary" loading={submittingEdit} onClick={handleSubmit(onEditSubmit)}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
