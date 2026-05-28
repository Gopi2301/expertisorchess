import apiClient from './client';
import type { Coach, PaginatedResponse, ApiResponse, PaginationParams } from '../types';

export interface CoachActivity {
  coach: Coach;
  stats: { totalClasses: number; totalAttendance: number };
  recentClasses: Array<{
    id: string; title: string; status: string;
    scheduled_start: string; scheduled_end: string; class_type: string;
  }>;
  timeline: Array<{ event: string; date: string; color: string }>;
}

export const coachesApi = {
  list: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Coach>>('/coaches', { params }).then(r => r.data),

  me: () =>
    apiClient.get<ApiResponse<Coach>>('/coaches/me').then(r => r.data),

  meDashboard: () =>
    apiClient.get<ApiResponse<CoachActivity>>('/coaches/me/dashboard').then(r => r.data),

  get: (id: string) =>
    apiClient.get<ApiResponse<Coach>>(`/coaches/${id}`).then(r => r.data),

  /** Public self-registration — no auth required */
  create: (data: Partial<Coach>) =>
    apiClient.post<ApiResponse<Coach>>('/coaches', data).then(r => r.data),

  /** SUPER_ADMIN approves a PENDING coach → ACTIVE */
  approve: (id: string) =>
    apiClient.patch<ApiResponse<Coach>>(`/coaches/${id}/approve`).then(r => r.data),

  /** SUPER_ADMIN rejects a PENDING coach → REJECTED */
  reject: (id: string) =>
    apiClient.patch<ApiResponse<Coach>>(`/coaches/${id}/reject`).then(r => r.data),

  /** Activity log: profile + stats + timeline */
  getActivity: (id: string) =>
    apiClient.get<ApiResponse<CoachActivity>>(`/coaches/${id}/activity`).then(r => r.data),

  update: (id: string, data: Partial<Coach>) =>
    apiClient.patch<ApiResponse<Coach>>(`/coaches/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    apiClient.delete(`/coaches/${id}`).then(r => r.data),
};
