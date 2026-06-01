import apiClient from './client';
import type { Class, StudentClass, PaginatedResponse, ApiResponse, PaginationParams } from '../types';

export type CalendarParams = PaginationParams & { date_from?: string; date_to?: string; coach_id?: string; status?: string };

export const classesApi = {
  list: (params?: CalendarParams) =>
    apiClient.get<PaginatedResponse<Class>>('/classes', { params }).then(r => r.data),
  
  listMy: (params?: CalendarParams) =>
    apiClient.get<PaginatedResponse<Class>>('/classes/my', { params }).then(r => r.data),

  get: (id: string) =>
    apiClient.get<ApiResponse<Class>>(`/classes/${id}`).then(r => r.data),

  create: (data: Partial<Class>) =>
    apiClient.post<ApiResponse<Class>>('/classes', data).then(r => r.data),

  update: (id: string, data: Partial<Class>) =>
    apiClient.patch<ApiResponse<Class>>(`/classes/${id}`, data).then(r => r.data),

  coachUpdate: (id: string, data: { title?: string; meeting_link?: string; scheduled_start?: string; scheduled_end?: string }) =>
    apiClient.patch<ApiResponse<Class>>(`/classes/${id}/coach-update`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/classes/${id}`).then(r => r.data),

  publish: (id: string) =>
    apiClient.post(`/classes/${id}/publish`).then(r => r.data),

  complete: (id: string, data: FormData) =>
    apiClient.post(`/classes/${id}/complete`, data).then(r => r.data),

  verify: (id: string) =>
    apiClient.patch(`/classes/${id}/verify`).then(r => r.data),

  // Enrollment
  getEnrollments: (classId: string) =>
    apiClient.get<ApiResponse<StudentClass[]>>(`/classes/${classId}/students`).then(r => r.data),

  enrollStudent: (classId: string, studentId: string) =>
    apiClient.post<ApiResponse<StudentClass>>(`/classes/${classId}/enroll`, { student_id: studentId }).then(r => r.data),

  unenrollStudent: (classId: string, studentId: string) =>
    apiClient.delete(`/classes/${classId}/enroll/${studentId}`).then(r => r.data),

  // Syllabus linking
  linkSyllabus: (classId: string, syllabusId: string) =>
    apiClient.patch(`/classes/${classId}/syllabus`, { syllabus_id: syllabusId }).then(r => r.data),

  // Calendar-specific
  listForStudent: (params?: CalendarParams) =>
    apiClient.get<PaginatedResponse<Class>>('/classes/student-schedule', { params }).then(r => r.data),

  listPendingConfirm: (params?: CalendarParams) =>
    apiClient.get<PaginatedResponse<Class>>('/classes/pending-confirm', { params }).then(r => r.data),
};
