import apiClient from './client';
import type { Client, Student, PaginatedResponse, ApiResponse, PaginationParams } from '../types';

export const clientsApi = {
  list: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Client>>('/clients', { params }).then(r => r.data),

  meDashboard: () =>
    apiClient.get<ApiResponse<any>>('/clients/me/dashboard').then(r => r.data),

  get: (id: string) =>
    apiClient.get<ApiResponse<Client>>(`/clients/${id}`).then(r => r.data),

  create: (data: Partial<Client>) =>
    apiClient.post<ApiResponse<Client>>('/clients', data).then(r => r.data),

  update: (id: string, data: Partial<Client>) =>
    apiClient.patch<ApiResponse<Client>>(`/clients/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/clients/${id}`).then(r => r.data),

  getStudents: (id: string, params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Student>>(`/clients/${id}/students`, { params }).then(r => r.data),
};
