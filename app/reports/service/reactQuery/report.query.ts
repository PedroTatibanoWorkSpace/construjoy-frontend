import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  findAllReports,
  findOneReport,
  createReport,
  updateReport,
  deleteReport,
} from '../report.service';

export const useReports = () => {
  return useQuery('reports', findAllReports);
};

export const useReport = (id: string) => {
  return useQuery(['report', id], () => findOneReport(id));
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation(createReport, {
    onSuccess: () => {
      queryClient.invalidateQueries('reports');
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: string; data: Partial<Parameters<typeof createReport>[0]> }) =>
      updateReport(id, data as any), // Adicionado `as any` para evitar erro de tipo
    {
      onSuccess: () => {
        queryClient.invalidateQueries('reports');
      },
    }
  );
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteReport, {
    onSuccess: () => {
      queryClient.invalidateQueries('reports');
    },
  });
};