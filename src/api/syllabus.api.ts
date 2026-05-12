import apiClient from './client';
import type { Syllabus, PaginatedResponse, ApiResponse, PaginationParams } from '../types';

export const syllabusApi = {
  list: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Syllabus>>('/syllabuses', { params }).then(r => r.data),

  get: (id: string) =>
    apiClient.get<ApiResponse<Syllabus>>(`/syllabuses/${id}`).then(r => r.data),

  create: (data: Partial<Syllabus>) =>
    apiClient.post<ApiResponse<Syllabus>>('/syllabuses', data).then(r => r.data),

  update: (id: string, data: Partial<Syllabus>) =>
    apiClient.patch<ApiResponse<Syllabus>>(`/syllabuses/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/syllabuses/${id}`).then(r => r.data),
};
