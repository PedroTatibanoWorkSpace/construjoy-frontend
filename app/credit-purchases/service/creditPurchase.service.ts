import api from '../../../services/api/apiConfig';

export const findAllCreditPurchases = async () => {
  const response = await api.get('/credit-purchases');
  return response.data;
};

export const findOneCreditPurchase = async (id: string) => {
  const response = await api.get(`/credit-purchases/${id}`);
  return response.data;
};

export const createCreditPurchase = async (data: {
  customerId: string;
  amount: number;
  description: string;
  purchaseDate: string;
  dueDate: string;
}) => {
  const response = await api.post('/credit-purchases', data);
  return response.data;
};

export const updateCreditPurchase = async (
  id: string,
  data: Partial<typeof createCreditPurchase>
) => {
  const response = await api.put(`/credit-purchases/${id}`, data);
  return response.data;
};

export const deleteCreditPurchase = async (id: string) => {
  const response = await api.delete(`/credit-purchases/${id}`);
  return response.data;
};
