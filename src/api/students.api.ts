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
};
