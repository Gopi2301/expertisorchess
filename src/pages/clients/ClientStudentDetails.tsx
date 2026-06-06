import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Trophy, CheckCircle, Video, Mail, RefreshCw, UserCheck } from 'lucide-react';
import { studentsApi } from '../../api/students.api';
import { classesApi } from '../../api/classes.api';
import { formatDateTime } from '../../utils/format';
import { Button } from '../../components/ui/Button';
import { StatusBadge, ChessLevelBadge, ClassStatusBadge } from '../../components/ui/Badge';
import type { Student, Class } from '../../types';

export const ClientStudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentRes, classesRes] = await Promise.all([
          studentsApi.get(id),
          classesApi.listForClient({ limit: 200 })
        ]);
        setStudent(studentRes.data);
        
        // Filter classes to only those where this student is enrolled
        const studentClasses = classesRes.data.filter(cls => 
           cls.students?.some(sc => sc.student_id === id)
        );
        setClasses(studentClasses);
      } catch (err) {
        console.error('Failed to load student details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-bg-strong rounded w-32 mb-6" />
        <div className="h-32 bg-bg-strong rounded-xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-bg-strong rounded-xl" />
          <div className="h-64 bg-bg-strong rounded-xl" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted">Student not found.</p>
        <Button className="mt-4" onClick={() => navigate('/client/students')}>Go Back</Button>
      </div>
    );
  }

  const now = new Date();
  const upcomingClasses = classes
    .filter(c => new Date(c.scheduled_start) > now)
    .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime());
    
  const pastClasses = classes
    .filter(c => new Date(c.scheduled_start) <= now)
    .sort((a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button 
        onClick={() => navigate('/client/students')}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} /> Back to Students
      </button>

      {/* Header Profile Card */}
      <div className="bg-bg-strong border border-border rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-bg-elevated border-2 border-border flex items-center justify-center font-bold text-2xl text-text-primary">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
              {student.name}
              <StatusBadge status={student.status} />
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
              <span className="flex items-center gap-1"><Trophy size={14} className="text-bg-brand" /> <ChessLevelBadge level={student.chess_level} /></span>
              {student.age && <span>{student.age} years old</span>}
              {/* Invite status */}
              {student.email && (
                (student as any).keycloak_user_id ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <UserCheck size={13} /> Account Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Mail size={13} /> Invite Pending
                  </span>
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Resend invite if email set and no KC account yet */}
          {student.email && !(student as any).keycloak_user_id && (
            <Button
              variant="secondary"
              size="sm"
              icon={resending ? undefined : <RefreshCw size={14} />}
              onClick={async () => {
                if (!id) return;
                setResending(true);
                setResendMessage(null);
                try {
                  const res = await studentsApi.resendInvite(id);
                  setResendMessage(`Invite resent to ${res.data?.email}`);
                } catch {
                  setResendMessage('Failed to resend invite.');
                } finally {
                  setResending(false);
                }
              }}
            >
              {resending ? 'Sending…' : 'Resend Invite'}
            </Button>
          )}
          <Link to={`/client/calendar`}>
             <Button variant="secondary" icon={<Calendar size={16} />}>Family Schedule</Button>
          </Link>
        </div>
      </div>

      {resendMessage && (
        <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {resendMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-bg-strong border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-bg-muted/30">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Calendar size={16} className="text-bg-brand" />
              Upcoming Classes
            </h2>
          </div>
          <div className="divide-y divide-border">
            {upcomingClasses.length === 0 ? (
              <p className="px-5 py-8 text-center text-text-muted text-sm">No upcoming classes.</p>
            ) : (
              upcomingClasses.map((cls) => (
                <div key={cls.id} className="px-5 py-4 flex items-center justify-between hover:bg-bg-muted/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary">{cls.title}</p>
                      <ClassStatusBadge status={cls.status} />
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      {formatDateTime(cls.scheduled_start)} • Coach {cls.coach?.name}
                    </p>
                  </div>
                  {cls.meeting_link && (
                    <Button size="sm" variant="ghost" onClick={() => window.open(cls.meeting_link, '_blank')} icon={<Video size={14} />}>
                      Join
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Past Classes / Attendance */}
        <div className="bg-bg-strong border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-bg-muted/30">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <CheckCircle size={16} className="text-bg-brand" />
              Past Classes
            </h2>
          </div>
          <div className="divide-y divide-border">
            {pastClasses.length === 0 ? (
              <p className="px-5 py-8 text-center text-text-muted text-sm">No past classes yet.</p>
            ) : (
              pastClasses.map((cls) => (
                <div key={cls.id} className="px-5 py-4 flex items-center justify-between hover:bg-bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{cls.title}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {formatDateTime(cls.scheduled_start)}
                    </p>
                  </div>
                  <ClassStatusBadge status={cls.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
