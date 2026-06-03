import React, { useState, useContext, useEffect } from 'react';
import { ClipboardList, CheckCircle, Search, Calendar, Users, User, LayoutGrid, CheckSquare, XSquare, Clock, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AttendanceBadge } from '../../components/ui/Badge';
import { ToastContext } from '../../components/layout/AppLayout';
import { useAuth } from '../../contexts/AuthContext';
import { classesApi } from '../../api/classes.api';
import { attendanceApi, type AttendanceRecord } from '../../api/attendance.api';
import { getInitials, formatDateTime } from '../../utils/format';
import type { Class, Attendance, AttendanceStatus } from '../../types';

export const AttendancePage: React.FC = () => {
  const { addToast } = useContext(ToastContext);
  const { hasRole } = useAuth();
  const isAdmin = hasRole('SUPER_ADMIN');

  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [existing, setExisting] = useState<Attendance[]>([]);
  const [records, setRecords] = useState<Map<string, AttendanceStatus>>(new Map());
  const [remarks, setRemarks] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setClassesLoading(true);
    const fetcher = isAdmin ? classesApi.list : classesApi.listMy;
    fetcher({ limit: 100, sortBy: 'scheduled_start', sortOrder: 'desc' })
      .then(r => setClasses(r.data))
      .catch(() => addToast('Failed to load classes', 'error'))
      .finally(() => setClassesLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedClassId) { 
      setExisting([]); 
      setRecords(new Map()); 
      setSelectedClass(null); 
      return; 
    }
    
    setLoading(true);
    Promise.all([
      classesApi.get(selectedClassId),
      attendanceApi.getByClass(selectedClassId),
    ]).then(([classRes, attRes]) => {
      const cls = classRes.data;
      setSelectedClass(cls);
      const att = attRes.data;
      setExisting(att);

      const map = new Map<string, AttendanceStatus>();
      const remMap = new Map<string, string>();

      // Load existing records
      att.forEach(a => {
        const key = a.student_id ? `s:${a.student_id}` : `c:${a.coach_id}`;
        map.set(key, a.attendance_status as AttendanceStatus);
        if (a.remarks) remMap.set(key, a.remarks);
      });

      // Pre-fill coach as PRESENT if not marked
      if (cls.coach_id) {
        const key = `c:${cls.coach_id}`;
        if (!map.has(key)) map.set(key, 'PRESENT');
      }

      // Pre-fill students from direct enrollment OR batch
      const students = cls.students?.length 
        ? cls.students.map(sc => sc.student!) 
        : (cls.batch?.students?.map(bs => bs.student!) || []);

      students.forEach(s => {
        const key = `s:${s.id}`;
        if (!map.has(key)) map.set(key, 'PRESENT');
      });

      setRecords(new Map(map));
      setRemarks(new Map(remMap));
    }).catch(() => addToast('Failed to load class data', 'error'))
      .finally(() => setLoading(false));
  }, [selectedClassId]);

  const setStatus = (key: string, status: AttendanceStatus) => {
    setRecords(prev => new Map(prev).set(key, status));
  };

  const markAll = (status: AttendanceStatus) => {
    const newRecords = new Map(records);
    newRecords.forEach((_, key) => newRecords.set(key, status));
    setRecords(newRecords);
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
      
      // Refresh existing to show badges
      const attRes = await attendanceApi.getByClass(selectedClassId);
      setExisting(attRes.data);
    } catch (e: any) {
      addToast(e?.response?.data?.message ?? 'Failed to mark attendance', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClasses = classes.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.coach?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusOptions: { status: AttendanceStatus; label: string; icon: React.ReactNode; color: string; activeColor: string }[] = [
    { status: 'PRESENT', label: 'Present', icon: <CheckSquare size={14} />, color: 'text-text-success', activeColor: 'bg-bg-success text-text-success border-green-800' },
    { status: 'ABSENT', label: 'Absent', icon: <XSquare size={14} />, color: 'text-error-strong', activeColor: 'bg-bg-error text-error-strong border-red-900' },
    { status: 'LATE', label: 'Late', icon: <Clock size={14} />, color: 'text-warning', activeColor: 'bg-yellow-950 text-warning border-yellow-800' },
    { status: 'EXCUSED', label: 'Excused', icon: <Info size={14} />, color: 'text-text-muted', activeColor: 'bg-bg-muted text-text-muted border-border' },
  ];

  const renderPersonRow = (key: string, name: string, role: 'student' | 'coach', extra?: string) => {
    const current = records.get(key) ?? 'PRESENT';
    const isCoach = role === 'coach';

    return (
      <div key={key} className={`group flex flex-col sm:flex-row sm:items-center gap-4 py-4 px-5 border-b border-border last:border-0 hover:bg-bg-muted/10 transition-all duration-200 ${isCoach ? 'bg-bg-brand/5' : ''}`}>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-transform group-hover:scale-110
            ${isCoach ? 'bg-bg-brand text-text-on-brand shadow-lg shadow-bg-brand/20' : 'bg-bg-elevated text-text-secondary border border-border'}`}>
            {getInitials(name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-text-primary truncate">{name}</p>
              {isCoach && <span className="text-[10px] bg-bg-brand/20 text-bg-brand px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Coach</span>}
            </div>
            <p className="text-xs text-text-muted truncate">
              {extra || (isCoach ? 'Primary Instructor' : 'Chess Student')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-bg-strong p-1 rounded-xl border border-border shadow-inner">
            {statusOptions.map(opt => (
              <button
                key={opt.status}
                onClick={() => setStatus(key, opt.status)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  current === opt.status
                    ? opt.activeColor + ' shadow-sm'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-muted'
                }`}
                title={opt.label}
              >
                {opt.icon}
                <span className="hidden lg:inline">{opt.label}</span>
                <span className="lg:hidden">{opt.label.charAt(0)}</span>
              </button>
            ))}
          </div>
          
          <div className="w-24 text-right hidden sm:block">
            {existing.find(a => (a.student_id && `s:${a.student_id}` === key) || (a.coach_id && `c:${a.coach_id}` === key))
              ? <AttendanceBadge status={current} />
              : <span className="text-[10px] font-bold uppercase tracking-widest text-bg-brand animate-pulse">New</span>
            }
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-bg-brand/10 rounded-xl">
              <ClipboardList size={28} className="text-bg-brand" />
            </div>
            Attendance Tracker
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium">Manage and record presence for your chess sessions</p>
        </div>
        
        {selectedClass && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAll('PRESENT')}
              className="text-text-success hover:bg-bg-success/10"
              icon={<CheckSquare size={16} />}
            >
              All Present
            </Button>
            <Button
              onClick={onSubmit}
              loading={submitting}
              disabled={records.size === 0}
              icon={<CheckCircle size={18} />}
              className="shadow-lg shadow-bg-brand/20"
            >
              Save Attendance
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: Class Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-bg-strong/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border bg-bg-strong/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type="text"
                  placeholder="Search classes..."
                  className="w-full bg-bg-elevated border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-bg-brand/50 focus:border-bg-brand outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto divide-y divide-border">
              {classesLoading ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-bg-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-text-muted font-medium">Loading classes...</p>
                </div>
              ) : filteredClasses.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-text-muted">No classes found</p>
                </div>
              ) : (
                filteredClasses.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClassId(c.id)}
                    className={`w-full text-left p-4 hover:bg-bg-muted/50 transition-all group relative ${
                      selectedClassId === c.id ? 'bg-bg-brand/5 border-l-4 border-l-bg-brand' : 'border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-bold truncate ${selectedClassId === c.id ? 'text-bg-brand' : 'text-text-primary'}`}>
                        {c.title}
                      </p>
                      <span className="text-[10px] font-mono text-text-muted opacity-60">
                        {new Date(c.scheduled_start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <User size={12} /> {c.coach?.name || 'No Coach'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {c._count?.students || c.students?.length || c.batch?.students?.length || 0}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main: Attendance Sheet */}
        <div className="lg:col-span-8">
          {!selectedClassId ? (
            <div className="bg-bg-strong/30 border-2 border-dashed border-border rounded-3xl h-[400px] flex flex-col items-center justify-center text-center p-10 group">
              <div className="p-5 bg-bg-muted rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <LayoutGrid size={48} className="text-text-muted opacity-40" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">No Class Selected</h3>
              <p className="text-sm text-text-muted max-w-xs mt-1">Select a class from the sidebar to start marking attendance for students and coaches.</p>
            </div>
          ) : loading ? (
            <div className="bg-bg-strong/50 border border-border rounded-3xl h-[400px] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-bg-brand border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium text-text-primary">Preparing attendance sheet...</p>
            </div>
          ) : (
            <div className="bg-bg-strong border border-border rounded-3xl overflow-hidden shadow-xl shadow-black/5 animate-slide-up">
              {/* Sheet Header */}
              <div className="px-6 py-5 border-b border-border bg-bg-elevated/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">{selectedClass?.title}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-text-muted font-medium bg-bg-muted px-2 py-1 rounded-lg">
                        <Calendar size={12} /> {selectedClass && formatDateTime(selectedClass.scheduled_start)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-muted font-medium bg-bg-muted px-2 py-1 rounded-lg">
                        <Users size={12} /> {records.size} Total Attendees
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sheet Body */}
              <div className="divide-y divide-border min-h-[300px]">
                {/* Coach section */}
                {selectedClass?.coach && renderPersonRow(
                  `c:${selectedClass.coach_id}`,
                  selectedClass.coach.name,
                  'coach',
                )}

                {/* Students section */}
                {(() => {
                  const students = selectedClass?.students?.length 
                    ? selectedClass.students.map(sc => sc.student!) 
                    : (selectedClass?.batch?.students?.map(bs => bs.student!) || []);
                  
                  if (students.length === 0) {
                    return (
                      <div className="py-20 text-center">
                        <Users size={40} className="mx-auto mb-3 text-text-muted opacity-20" />
                        <p className="text-sm text-text-muted">No students enrolled in this session.</p>
                      </div>
                    );
                  }

                  return students.map(s => renderPersonRow(
                    `s:${s.id}`,
                    s.name,
                    'student',
                    s.chess_level
                  ));
                })()}
              </div>

              {/* Sheet Footer */}
              <div className="px-6 py-4 bg-bg-muted/30 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-text-success"></div>
                    <span className="text-[10px] font-bold text-text-muted uppercase">Present: {Array.from(records.values()).filter(v => v === 'PRESENT').length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-error-strong"></div>
                    <span className="text-[10px] font-bold text-text-muted uppercase">Absent: {Array.from(records.values()).filter(v => v === 'ABSENT').length}</span>
                  </div>
                </div>
                <p className="text-[10px] text-text-muted font-medium">Last updated automatically on status change. Press save to commit.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
