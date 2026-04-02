"use client";

import React from "react";
import { useCreditPurchases } from "./credit-purchases/service/reactQuery/creditPurchase.query";
import {
  useFinancialSummary,
  useReceivablesByMonth,
  useReceivablesByStatus,
  useTopClients,
  useOverdueAging,
  useMonthlyRevenue,
} from "./dashboard/service/reactQuery/analytics.query";
import { formatDate, formatCurrency } from "./utils";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import {
  HomeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import FinancialSummaryCards from "./dashboard/components/FinancialSummaryCards";
import ReceivablesByMonthChart from "./dashboard/components/ReceivablesByMonthChart";
import ReceivablesByStatusChart from "./dashboard/components/ReceivablesByStatusChart";
import MonthlyRevenueChart from "./dashboard/components/MonthlyRevenueChart";
import TopClientsTable from "./dashboard/components/TopClientsTable";
import OverdueAgingChart from "./dashboard/components/OverdueAgingChart";

export default function Home() {
  const { data: purchases = [], isLoading: isLoadingPurchases } = useCreditPurchases();
  const { data: summary } = useFinancialSummary();
  const { data: byMonth = [] } = useReceivablesByMonth();
  const { data: byStatus = [] } = useReceivablesByStatus();
  const { data: topClients = [] } = useTopClients(10);
  const { data: aging = [] } = useOverdueAging();
  const { data: revenue = [] } = useMonthlyRevenue();

  const overduePurchases = purchases
    .filter((p) => p.paymentStatus === "Atrasado")
    .sort(
      (a, b) =>
        new Date(a.validate).getTime() - new Date(b.validate).getTime()
    );

  if (isLoadingPurchases) {
    return (
      <div className="flex justify-center items-center h-screen" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-800 to-indigo-900 rounded-xl shadow-lg mr-4">
              <HomeIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Painel de Análise
              </h1>
              <p className="text-gray-400 mt-1">
                Visão geral e análise de dados financeiros
              </p>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        {summary && <FinancialSummaryCards data={summary} />}

        {/* Charts Row 1: Bar + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReceivablesByMonthChart data={byMonth} />
          <ReceivablesByStatusChart data={byStatus} />
        </div>

        {/* Charts Row 2: Revenue Line */}
        <MonthlyRevenueChart data={revenue} />

        {/* Charts Row 3: Aging + Top Clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OverdueAgingChart data={aging} />
          <TopClientsTable data={topClients} />
        </div>

        {/* Overdue Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl overflow-hidden border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
                Contas Atrasadas
              </h2>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-900/30 text-red-400 border border-red-700/40">
                {overduePurchases.length} pendente
                {overduePurchases.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <caption className="sr-only">Lista de contas atrasadas</caption>
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Valor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Dias Atrasados
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {overduePurchases.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-400"
                      >
                        Nenhuma conta atrasada encontrada
                      </td>
                    </tr>
                  ) : (
                    overduePurchases.map((purchase, index) => {
                      const today = new Date();
                      const dueDate = new Date(purchase.validate);
                      const diffTime = today.getTime() - dueDate.getTime();
                      const diffDays = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <motion.tr
                          key={purchase.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                          }}
                          className="hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                            {purchase.client?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {purchase.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatCurrency(purchase.value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDate(purchase.validate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs rounded-lg font-medium bg-red-900 text-red-200">
                              {diffDays} dia{diffDays !== 1 ? "s" : ""}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <Toaster />
    </>
  );
}
