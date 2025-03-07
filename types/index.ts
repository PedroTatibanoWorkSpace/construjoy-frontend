export interface Purchase {
  id: string;
  amount: number;
  description: string;
  purchaseDate: Date;
  dueDate: Date;
  status: 'pending' | 'paid';
}

export interface Customer {
  id: string;
  fullName: string;
  purchases: Purchase[];
}
