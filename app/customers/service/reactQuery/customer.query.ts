import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  findAllCustomers,
  findOneCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../customer.service";
import { Customer } from "../../entities/customers.entity";
import { UpdateCustomerInput } from "../../types/customer.type";
import { toast } from "@/hooks/use-toast";

export const useCustomers = () => {
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: findAllCustomers,
  });
};

export const useCustomer = (id: string) => {
  return useQuery<Customer>({
    queryKey: ["customer", id],
    queryFn: () => findOneCustomer(id),
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao criar cliente", error.message);
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateCustomerInput) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar cliente", error.message);
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao excluir cliente", error.message);
    },
  });
};
