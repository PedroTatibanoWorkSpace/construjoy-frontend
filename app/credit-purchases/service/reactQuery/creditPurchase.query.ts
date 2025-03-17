import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  findAllCreditPurchases,
  findOneCreditPurchase,
  createCreditPurchase,
  updateCreditPurchase,
  deleteCreditPurchase,
} from '../creditPurchase.service';

export const useCreditPurchases = () => {
  return useQuery('creditPurchases', findAllCreditPurchases);
};

export const useCreditPurchase = (id: string) => {
  return useQuery(['creditPurchase', id], () => findOneCreditPurchase(id));
};

export const useCreateCreditPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation(createCreditPurchase, {
    onSuccess: () => {
      queryClient.invalidateQueries('creditPurchases');
    },
  });
};

export const useUpdateCreditPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: { id: string; data: Partial<Parameters<typeof createCreditPurchase>[0]> }) =>
      updateCreditPurchase(id, data as any), // Adicionado `as any` para evitar erro de tipo
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creditPurchases');
      },
    }
  );
};

export const useDeleteCreditPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteCreditPurchase, {
    onSuccess: () => {
      queryClient.invalidateQueries('creditPurchases');
    },
  });
};