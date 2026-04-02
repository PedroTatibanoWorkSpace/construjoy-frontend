import { useQuery } from "@tanstack/react-query";
import {
  getFinancialSummary,
  getReceivablesByMonth,
  getReceivablesByStatus,
  getTopClients,
  getOverdueAging,
  getMonthlyRevenue,
} from "../analytics.service";

export const useFinancialSummary = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["analytics", "summary", startDate, endDate],
    queryFn: () => getFinancialSummary(startDate, endDate),
  });
};

export const useReceivablesByMonth = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["analytics", "receivables-by-month", startDate, endDate],
    queryFn: () => getReceivablesByMonth(startDate, endDate),
  });
};

export const useReceivablesByStatus = () => {
  return useQuery({
    queryKey: ["analytics", "receivables-by-status"],
    queryFn: getReceivablesByStatus,
  });
};

export const useTopClients = (limit?: number) => {
  return useQuery({
    queryKey: ["analytics", "top-clients", limit],
    queryFn: () => getTopClients(limit),
  });
};

export const useOverdueAging = () => {
  return useQuery({
    queryKey: ["analytics", "overdue-aging"],
    queryFn: getOverdueAging,
  });
};

export const useMonthlyRevenue = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["analytics", "monthly-revenue", startDate, endDate],
    queryFn: () => getMonthlyRevenue(startDate, endDate),
  });
};
