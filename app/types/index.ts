export interface Customer {
  id: string;
  fullName: string;
  cpf: string;
  address: string;
  phone?: string;
  email?: string;
  registrationDate: Date;
}

export interface CreditPurchase {
  id: string;
  customerId: string;
  amount: number;
  description: string;
  purchaseDate: Date;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
}

export interface CustomerCredit {
  customer: Customer;
  totalCredit: number;
  purchases: CreditPurchase[];
}