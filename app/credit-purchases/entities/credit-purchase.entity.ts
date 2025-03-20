import { Customer } from "@/app/customers/entities/customers.entity";

export interface CreditPurchase {
     id?: string;
     userId: string;
     clientId: string;
     value: number;
     description: string;
     validate: Date;
     paymentStatus?: "Pendente" | "Pago" | "Atrasado";
     paymentDate?: Date;
     createdAt?: Date;
     internalId?: number;
     client: Customer;
}