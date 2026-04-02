import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  findAllCreditPurchases,
  findOneCreditPurchase,
  createCreditPurchase,
  updateCreditPurchase,
  deleteCreditPurchase,
  paidAccount,
  paidMultiplesAccounts
} from '../creditPurchase.service';
import { CreditPurchase } from '../../entities/credit-purchase.entity';
import { UpdateCreditPurchaseInput, PaidCreditPurchaseInput } from '../../types/credit-purchase.type';
import { PaidMultiplesAccountsInput } from '../../types/credit-purchase.type';
import { toast } from '@/hooks/use-toast';

export const useCreditPurchases = () => {
  return useQuery<CreditPurchase[]>({
    queryKey: ['creditPurchases'],
    queryFn: findAllCreditPurchases,
  });
};

export const useCreditPurchase = (id: string) => {
  return useQuery<CreditPurchase>({
    queryKey: ['creditPurchase', id],
    queryFn: () => findOneCreditPurchase(id),
  });
};

export const useCreateCreditPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCreditPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditPurchases'] });
    },
    onError: (error: any) => {
      toast.error("Erro ao criar compra", error.message);
    },
  });
};

export const usePaidAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, paymentDate }: PaidCreditPurchaseInput) => paidAccount(id, paymentDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditPurchases'] });
    },
    onError: (error: any) => {
      toast.error("Erro ao registrar pagamento", error.message);
    },
  });
};

export const useUpdateCreditPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateCreditPurchaseInput) => updateCreditPurchase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditPurchases'] });
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar compra", error.message);
    },
  });
};

export const useDeleteCreditPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCreditPurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditPurchases'] });
    },
    onError: (error: any) => {
      toast.error("Erro ao excluir compra", error.message);
    },
  });
};

export const usePaidMultipleAccounts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: PaidMultiplesAccountsInput) => paidMultiplesAccounts(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditPurchases'] });
    },
    onError: (error: any) => {
      toast.error("Erro ao registrar múltiplos pagamentos", error.message);
    },
  });
};