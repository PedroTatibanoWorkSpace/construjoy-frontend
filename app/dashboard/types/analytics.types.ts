export interface FinancialSummary {
  totalReceivables: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalCount: number;
  collectionRate: number;
}

export interface ReceivableByMonth {
  month: string;
  status: string;
  total: number;
  count: number;
}

export interface ReceivableByStatus {
  status: string;
  total: number;
  count: number;
}

export interface TopClient {
  id: string;
  name: string;
  document: string;
  totalDebt: number;
  overdueCount: number;
  pendingCount: number;
}

export interface OverdueAgingItem {
  range: string;
  count: number;
  total: number;
}

export interface MonthlyRevenue {
  month: string;
  total: number;
  count: number;
}
