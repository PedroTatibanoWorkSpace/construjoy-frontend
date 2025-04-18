import api from "../../../services/api/apiConfig";
import { CreditPurchase } from "../entities/credit-purchase.entity";
import { PaidMultipleReceivablesDto } from "./dtos/PaidMultiplePurchases.dto";

export const findAllCreditPurchases = async (): Promise<CreditPurchase[]> => {
  const response = await api.get("/receivables");
  return response.data.data;
};

export const findOneCreditPurchase = async (
  id: string
): Promise<CreditPurchase> => {
  const response = await api.get(`/receivables/${id}`);
  return response.data.data;
};

export const createCreditPurchase = async (
  creditPurchase: CreditPurchase
): Promise<CreditPurchase> => {
  const response = await api.post("/receivables", creditPurchase);
  return response.data.data;
};

export const paidAccount = async (
  id: string,
  paymentDate: Date
): Promise<CreditPurchase> => {
  const response = await api.patch(`/receivables/paid/${id}`, { paymentDate });
  return response.data.data;
};

export const paidMultiplesAccounts = async (
  id: string,
  data: PaidMultipleReceivablesDto
): Promise<CreditPurchase[]> => {
    const response = await api.patch(`/receivables/paid-multiple/${id}`, data);
    return response.data.data;
};

export const updateCreditPurchase = async (
  id: string,
  data: Partial<CreditPurchase>
): Promise<CreditPurchase> => {
  const response = await api.patch(`/receivables/${id}`, data);
  return response.data.data;
};

export const deleteCreditPurchase = async (id: string): Promise<void> => {
  await api.delete(`/receivables/${id}`);
};
