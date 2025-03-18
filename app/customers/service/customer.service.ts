import api from "../../../services/api/apiConfig";
import { Customer } from "../entities/customers.entity";

export const findAllCustomers = async (): Promise<Customer[]> => {
  const response = await api.get("/clients");
  return response.data.data;
};

export const findOneCustomer = async (id: string): Promise<Customer> => {
  const response = await api.get(`/clients/${id}`);
  return response.data.data;
};

export const createCustomer = async (customer: Customer): Promise<Customer> => {
  const response = await api.post("/clients", customer);
  return response.data.data;
};

export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
): Promise<Customer> => {
  const response = await api.patch(`/clients/${id}`, data);
  return response.data.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/clients/${id}`);
};
