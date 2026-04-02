import api from "@/services/api/apiConfig";
import {
  FinancialSummary,
  ReceivableByMonth,
  ReceivableByStatus,
  TopClient,
  OverdueAgingItem,
  MonthlyRevenue,
} from "../types/analytics.types";

export const getFinancialSummary = async (
  startDate?: string,
  endDate?: string
): Promise<FinancialSummary> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const response = await api.get(`/analytics/summary?${params.toString()}`);
  return response.data.data;
};

export const getReceivablesByMonth = async (
  startDate?: string,
  endDate?: string
): Promise<ReceivableByMonth[]> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const response = await api.get(`/analytics/receivables-by-month?${params.toString()}`);
  return response.data.data;
};

export const getReceivablesByStatus = async (): Promise<ReceivableByStatus[]> => {
  const response = await api.get("/analytics/receivables-by-status");
  return response.data.data;
};

export const getTopClients = async (limit?: number): Promise<TopClient[]> => {
  const params = limit ? `?limit=${limit}` : "";
  const response = await api.get(`/analytics/top-clients${params}`);
  return response.data.data;
};

export const getOverdueAging = async (): Promise<OverdueAgingItem[]> => {
  const response = await api.get("/analytics/overdue-aging");
  return response.data.data;
};

export const getMonthlyRevenue = async (
  startDate?: string,
  endDate?: string
): Promise<MonthlyRevenue[]> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const response = await api.get(`/analytics/monthly-revenue?${params.toString()}`);
  return response.data.data;
};
