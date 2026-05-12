import apiClient from './client';
import type { Plan, PaginatedResponse, ApiResponse, PaginationParams } from '../types';

export const plansApi = {
  list: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Plan>>('/plans', { params }).then(r => r.data),

  get: (id: string) =>
    apiClient.get<ApiResponse<Plan>>(`/plans/${id}`).then(r => r.data),

  create: (data: Partial<Plan>) =>
    apiClient.post<ApiResponse<Plan>>('/plans', data).then(r => r.data),

  update: (id: string, data: Partial<Plan>) =>
    apiClient.patch<ApiResponse<Plan>>(`/plans/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/plans/${id}`).then(r => r.data),
};
