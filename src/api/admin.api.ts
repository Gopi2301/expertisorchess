import apiClient from './client';
import type { DashboardSummary, ApiResponse } from '../types';

export const adminApi = {
  summary: () =>
    apiClient.get<ApiResponse<DashboardSummary>>('/admin/summary').then(r => r.data),
};
