import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  findAllCustomers,
  findOneCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../customer.service";
import { Customer } from "../entity/customers.entity";

export const useCustomers = () => {
  return useQuery<Customer[]>("customers", findAllCustomers);
};

export const useCustomer = (id: string) => {
  return useQuery<Customer>(["customer", id], () => findOneCustomer(id));
};

export interface CreateCustomerInput {
  customer: Customer;
}

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation(createCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries("customers");
    },
  });
};

export interface UpdateCustomerInput {
  id: string;
  data: Partial<Customer>;
}

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
