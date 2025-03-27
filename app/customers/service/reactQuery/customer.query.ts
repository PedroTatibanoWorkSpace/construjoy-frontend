import { useQuery, useMutation, useQueryClient } from "react-query";
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
  return useQuery<Customer[]>("customers", findAllCustomers, {
    onError: (error: any) => {
      toast.error("Erro ao carregar clientes", error?.message || "Não foi possível carregar a lista de clientes.");
    }
  });
};

export const useCustomer = (id: string) => {
  return useQuery<Customer>(["customer", id], () => findOneCustomer(id), {
    onError: (error: any) => {
      toast.error("Erro ao carregar cliente", error?.message || "Não foi possível carregar os detalhes do cliente.");
    }
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation(createCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries("customers");
    }
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: UpdateCustomerInput) => updateCustomer(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("customers");
      }
    }
  );
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries("customers");
    }
  });
};
