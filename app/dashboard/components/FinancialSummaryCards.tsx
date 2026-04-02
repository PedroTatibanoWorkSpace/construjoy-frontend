"use client";

import { motion } from "framer-motion";
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { FinancialSummary } from "../types/analytics.types";

interface Props {
  data: FinancialSummary;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function FinancialSummaryCards({ data }: Props) {
  const cards = [
    {
      title: "Total Recebíveis",
      value: formatCurrency(data.totalReceivables),
      icon: BanknotesIcon,
      color: "text-blue-400",
      bg: "bg-blue-900/20",
    },
    {
      title: "Total Recebido",
      value: formatCurrency(data.totalPaid),
      icon: CheckCircleIcon,
      color: "text-emerald-400",
      bg: "bg-emerald-900/20",
    },
    {
      title: "Pendente",
      value: formatCurrency(data.totalPending),
      icon: ClockIcon,
      color: "text-yellow-400",
      bg: "bg-yellow-900/20",
    },
    {
      title: "Vencido",
      value: formatCurrency(data.totalOverdue),
      icon: ExclamationTriangleIcon,
      color: "text-red-400",
      bg: "bg-red-900/20",
    },
    {
      title: "Taxa de Cobrança",
      value: `${data.collectionRate}%`,
      icon: ChartBarIcon,
      color: "text-purple-400",
      bg: "bg-purple-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          whileHover={{ scale: 1.03 }}
          className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 border border-gray-700 p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">{card.title}</p>
              <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${card.bg}`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
