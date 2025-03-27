import { CreditPurchase } from "../entities/credit-purchase.entity";
import { PaidMultipleReceivablesDto } from "../service/dtos/PaidMultiplePurchases.dto";

export interface UpdateCreditPurchaseInput {
  id: string;
  data: Partial<CreditPurchase>;
}

export interface PaidCreditPurchaseInput {
  id: string;
  paymentDate: Date; 

}

export interface PaidMultiplesAccountsInput {
  id: string;
  data: PaidMultipleReceivablesDto;
}

