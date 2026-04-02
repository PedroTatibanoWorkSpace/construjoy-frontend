"use client";

import React from 'react';
import ReportList from './components/ReportList';
import { motion } from "framer-motion";
import { ChartBarIcon, DocumentTextIcon, ExclamationTriangleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useCustomers } from '../customers/service/reactQuery/customer.query';
import { useCreditPurchases } from '../credit-purchases/service/reactQuery/creditPurchase.query';
import { formatCurrency } from '../utils';

export default function ReportsPage() {
  const { data: customers = [] } = useCustomers();
  const { data: purchases = [] } = useCreditPurchases();

  const customersWithDebt = customers.filter(customer =>
    customer.receivables && customer.receivables.some(r =>
      r.paymentStatus === 'Pendente' || r.paymentStatus === 'Atrasado'
    )
  ).length;

  const totalDebt = purchases.reduce((sum, purchase) => {
    if (purchase.paymentStatus !== 'Pago') {
      return sum + purchase.value;
    }
    return sum;
  }, 0);

  const overdueDebt = purchases.reduce((sum, purchase) => {
    if (purchase.paymentStatus === 'Atrasado') {
      return sum + purchase.value;
    }
    return sum;
  }, 0);

  const pendingCount = purchases.filter(p => p.paymentStatus === 'Pendente').length;
  const overdueCount = purchases.filter(p => p.paymentStatus === 'Atrasado').length;

  const cards = [
    {
      title: "Total de Clientes",
      value: customers.length.toString(),
      subtitle: `${customersWithDebt} com débitos pendentes`,
      icon: UserGroupIcon,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Débito Total",
      value: formatCurrency(totalDebt),
      subtitle: `${pendingCount + overdueCount} contas em aberto`,
      icon: DocumentTextIcon,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Total Vencido",
      value: formatCurrency(overdueDebt),
      subtitle: `${overdueCount} contas atrasadas`,
      icon: ExclamationTriangleIcon,
      color: "text-red-400",
      bg: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-2">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg shadow-teal-500/20 mr-4">
            <ChartBarIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
              Relatórios
            </h1>
            <p className="text-gray-500 mt-1">Visualize e exporte relatórios de débitos por cliente</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`rounded-xl border ${card.borderColor} ${card.bg} p-5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                <p className="text-xs text-gray-500 mt-2">{card.subtitle}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ReportList />
    </div>
  );
}
