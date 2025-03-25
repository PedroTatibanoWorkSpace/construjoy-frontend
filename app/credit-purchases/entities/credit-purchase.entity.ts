import { Customer } from "@/app/customers/entities/customers.entity";

export interface CreditPurchase {
     id?: string;
     clientId: string;
     value: number;
     description: string;
     validate: Date;
     purchaseDate: Date;
     paymentStatus?: "Pendente" | "Pago" | "Atrasado";
     paymentDate?: Date;
     createdAt?: Date;
     internalId?: number;
     client: Customer;
}