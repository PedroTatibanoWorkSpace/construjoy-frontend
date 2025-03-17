import api from '../../../services/api/apiConfig';

export const findAllReports = async () => {
  const response = await api.get('/reports');
  return response.data;
};

export const findOneReport = async (id: string) => {
  const response = await api.get(`/reports/${id}`);
  return response.data;
};

export const createReport = async (data: { title: string; content: string }) => {
  const response = await api.post('/reports', data);
  return response.data;
};

export const updateReport = async (id: string, data: Partial<typeof createReport>) => {
  const response = await api.put(`/reports/${id}`, data);
  return response.data;
};

export const deleteReport = async (id: string) => {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
};
