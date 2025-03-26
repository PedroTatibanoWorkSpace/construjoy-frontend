import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  findAllCreditPurchases,
  findOneCreditPurchase,
  createCreditPurchase,
  updateCreditPurchase,
  deleteCreditPurchase,
  paidAccount
} from '../creditPurchase.service';
import { CreditPurchase } from '../../entities/credit-purchase.entity';
import { UpdateCreditPurchaseInput, PaidCreditPurchaseInput } from '../../types/credit-purchase.type';

export const useCreditPurchases = () => {
  return useQuery<CreditPurchase[]>('creditPurchases', findAllCreditPurchases);
};

export const useCreditPurchase = (id: string) => {
  return useQuery<CreditPurchase>(['creditPurchase', id], () => findOneCreditPurchase(id));
};

export const useCreateCreditPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation(createCreditPurchase, {
    onSuccess: () => {
      queryClient.invalidateQueries('creditPurchases');
    },
  });
};

export const usePaidAccount = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, paymentDate }: PaidCreditPurchaseInput) => paidAccount(id, paymentDate),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('creditPurchases');
      },
    }
  );
};

export const useUpdateCreditPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: UpdateCreditPurchaseInput) => updateCreditPurchase(id, data),
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