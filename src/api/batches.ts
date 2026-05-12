import apiClient from './client';

export const batchesApi = {
  findAll: async (params?: any) => {
    const response = await apiClient.get('/batches', { params });
    return response.data;
  },

  findOne: async (id: string) => {
    const response = await apiClient.get(`/batches/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/batches', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.patch(`/batches/${id}`, data);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await apiClient.delete(`/batches/${id}`);
    return response.data;
  },

  enrollStudent: async (id: string, studentId: string) => {
    const response = await apiClient.post(`/batches/${id}/enroll`, { student_id: studentId });
    return response.data;
  },

  unenrollStudent: async (id: string, studentId: string) => {
    const response = await apiClient.delete(`/batches/${id}/enroll/${studentId}`);
    return response.data;
  },
};
