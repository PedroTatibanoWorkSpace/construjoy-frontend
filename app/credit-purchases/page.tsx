"use client";

import React from 'react';
import CreditPurchaseList from './components/CreditPurchaseList';
import { motion } from "framer-motion";
import { CreditCardIcon, BanknotesIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useCreditPurchases } from './service/reactQuery/creditPurchase.query';
import { formatCurrency } from '../utils';

export default function CreditPurchasesPage() {
  const { data: purchases = [] } = useCreditPurchases();

  const totalCredit = purchases.reduce((sum, purchase) => {
    if (purchase.paymentStatus !== 'Pago') return sum + purchase.value;
    return sum;
  }, 0);

  const overdueCount = purchases.filter(p => p.paymentStatus === 'Atrasado').length;
  const pendingCount = purchases.filter(p => p.paymentStatus === 'Pendente').length;

  const cards = [
    {
      title: "Crédito Pendente",
      value: formatCurrency(totalCredit),
      subtitle: "Total de crédito em aberto",
      icon: BanknotesIcon,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Vencidos",
      value: overdueCount.toString(),
      subtitle: "Créditos em atraso",
      icon: ExclamationTriangleIcon,
      color: "text-red-400",
      bg: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      title: "Pendentes",
      value: pendingCount.toString(),
      subtitle: "Aguardando pagamento",
      icon: ClockIcon,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
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
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 mr-4">
            <CreditCardIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
              Compras a Crédito
            </h1>
            <p className="text-gray-500 mt-1">Gerencie os créditos concedidos</p>
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

      <CreditPurchaseList />
    </div>
  );
}
