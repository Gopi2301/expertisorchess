import apiClient from './client';
import type { Coach, PaginatedResponse, ApiResponse, PaginationParams } from '../types';

export const coachesApi = {
  list: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Coach>>('/coaches', { params }).then(r => r.data),

  get: (id: string) =>
    apiClient.get<ApiResponse<Coach>>(`/coaches/${id}`).then(r => r.data),

  create: (data: Partial<Coach>) =>
    apiClient.post<ApiResponse<Coach>>('/coaches', data).then(r => r.data),

  update: (id: string, data: Partial<Coach>) =>
    apiClient.patch<ApiResponse<Coach>>(`/coaches/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/coaches/${id}`).then(r => r.data),
};
