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

export const useCustomers = () => {
  return useQuery<Customer[]>("customers", findAllCustomers);
};

export const useCustomer = (id: string) => {
  return useQuery<Customer>(["customer", id], () => findOneCustomer(id));
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation(createCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries("customers");
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }: UpdateCustomerInput) => updateCustomer(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("customers");
      },
    }
  );
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries("customers");
    },
  });
};
