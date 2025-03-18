import { CreditPurchase } from "../entities/credit-purchase.entity";

export interface UpdateCreditPurchaseInput {
    id: string;
    data: Partial<CreditPurchase>;
  }