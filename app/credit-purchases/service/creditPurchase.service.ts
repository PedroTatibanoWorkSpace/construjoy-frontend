import api from '../../../services/api/apiConfig';
import { CreditPurchase } from '../entities/credit-purchase.entity';

export const findAllCreditPurchases = async (): Promise<CreditPurchase[]> => {
  const response = await api.get('/receivables');
  return response.data.data;
};

export const findOneCreditPurchase = async (id: string): Promise<CreditPurchase> => {
  const response = await api.get(`/receivables/${id}`);
  return response.data.data;
};

export const createCreditPurchase = async (creditPurchase: CreditPurchase): Promise<CreditPurchase> => {
  const response = await api.post('/receivables', creditPurchase);
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
