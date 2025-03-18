import { Customer } from "../entities/customers.entity";

export interface UpdateCustomerInput {
  id: string;
  data: Partial<Customer>;
}