import apiClient from './client';
import type { Student, PaginatedResponse, ApiResponse, PaginationParams } from '../types';

export const studentsApi = {
  list: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Student>>('/students', { params }).then(r => r.data),

  meDashboard: () =>
    apiClient.get<ApiResponse<any>>('/students/me/dashboard').then(r => r.data),

  get: (id: string) =>
    apiClient.get<ApiResponse<Student>>(`/students/${id}`).then(r => r.data),

  create: (data: Partial<Student>) =>
    apiClient.post<ApiResponse<Student>>('/students', data).then(r => r.data),

  update: (id: string, data: Partial<Student>) =>
    apiClient.patch<ApiResponse<Student>>(`/students/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/students/${id}`).then(r => r.data),

  /** Claim a student invite token — authenticates the logged-in KC user to a student record */
  claimInvite: (token: string) =>
    apiClient.post<ApiResponse<Student>>('/students/claim-invite', { token }).then(r => r.data),

  /** Resend an invite email to a student (CLIENT or ADMIN only) */
  resendInvite: (studentId: string) =>
    apiClient.post<ApiResponse<{ message: string; email: string }>>(`/students/${studentId}/resend-invite`).then(r => r.data),
};

