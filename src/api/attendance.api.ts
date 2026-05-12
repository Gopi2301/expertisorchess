import apiClient from './client';
import type { Attendance, ApiResponse } from '../types';

export interface AttendanceRecord {
  student_id?: string;
  coach_id?: string;
  attendance_status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export const attendanceApi = {
  getByClass: (classId: string) =>
    apiClient.get<ApiResponse<Attendance[]>>(`/attendance/class/${classId}`).then(r => r.data),

  bulkMark: (classId: string, records: AttendanceRecord[]) =>
    apiClient.post<ApiResponse<{ message: string; count: number }>>(
      `/attendance/class/${classId}/bulk`,
      { records },
    ).then(r => r.data),
};
