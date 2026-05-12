import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, User, BookOpen, Users, 
  ExternalLink, ArrowLeft, Pencil, Trash2, 
  CheckCircle, XCircle, AlertCircle, Play
} from 'lucide-react';
import { classesApi } from '../../api/classes.api';
import { Button } from '../../components/ui/Button';
import { ClassStatusBadge } from '../../components/ui/Badge';
import { formatDateTime } from '../../utils/format';
import { ToastContext } from '../../components/layout/AppLayout';
import type { Class, StudentClass } from '../../types';

export const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClass();
    }
  }, [id]);

  const fetchClass = async () => {
    try {
      setLoading(true);
      const res = await classesApi.get(id!);
      setClassData(res.data);
    } catch (error) {
      addToast('Failed to load class details', 'error');
      navigate('/classes');
    } finally {
      setLoading(false);
    }
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

  const handleDelete = async () => {
    if (!classData || !window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await classesApi.delete(classData.id);
      addToast('Class deleted', 'success');
      navigate('/classes');
    } catch (error) {
      addToast('Failed to delete class', 'error');
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
          <Link to="/classes" className="p-2 hover:bg-bg-strong rounded-lg transition-colors text-text-muted hover:text-text-primary">
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
          {classData.status === 'DRAFT' && (
            <Button onClick={handlePublish} loading={publishing} variant="primary" icon={<CheckCircle size={16} />}>
              Publish Class
            </Button>
          )}
          <Button variant="ghost" icon={<Pencil size={16} />}>Edit</Button>
          <Button variant="ghost" onClick={handleDelete} className="text-error-strong hover:bg-bg-error" icon={<Trash2 size={16} />}>
            Delete
          </Button>
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
                      <Link to={`/batches`} className="text-sm text-bg-brand hover:underline font-medium">
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
                <Users size={18} className="text-bg-brand" /> Enrolled Students
              </h2>
              <span className="text-xs font-medium px-2 py-1 bg-bg-muted rounded-full text-text-secondary">
                {classData.students?.length || 0} / {classData.max_students}
              </span>
            </div>
            <div className="divide-y divide-border">
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
                  return (students as any[]).map((enrollment) => (
                    <div key={enrollment.id} className="p-4 flex items-center justify-between hover:bg-bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-bg-brand/10 flex items-center justify-center text-bg-brand font-bold">
                          {enrollment.student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{enrollment.student.name}</p>
                          <p className="text-xs text-text-muted">{enrollment.student.chess_level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
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
                      </div>
                    </div>
                  ));
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
    </div>
  );
};
