import { z } from 'zod';

export const customerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Invalid CPF format'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
});

export const creditPurchaseSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(3, 'Description is required'),
  purchaseDate: z.date(),
});