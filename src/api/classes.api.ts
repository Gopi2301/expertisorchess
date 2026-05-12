import apiClient from './client';
import type { Class, StudentClass, PaginatedResponse, ApiResponse, PaginationParams } from '../types';

export const classesApi = {
  list: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Class>>('/classes', { params }).then(r => r.data),

  get: (id: string) =>
    apiClient.get<ApiResponse<Class>>(`/classes/${id}`).then(r => r.data),

  create: (data: Partial<Class>) =>
    apiClient.post<ApiResponse<Class>>('/classes', data).then(r => r.data),

  update: (id: string, data: Partial<Class>) =>
    apiClient.patch<ApiResponse<Class>>(`/classes/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/classes/${id}`).then(r => r.data),

  publish: (id: string) =>
    apiClient.post(`/classes/${id}/publish`).then(r => r.data),

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
};
