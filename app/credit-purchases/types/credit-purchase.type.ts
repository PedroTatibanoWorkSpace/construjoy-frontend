import { CreditPurchase } from "../entities/credit-purchase.entity";

export interface UpdateCreditPurchaseInput {
  id: string;
  data: Partial<CreditPurchase>;
}

export interface PaidCreditPurchaseInput {
  id: string;
  paymentDate: Date; // Corrigido para refletir o nome correto do campo
}
