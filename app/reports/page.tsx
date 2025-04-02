"use client";

import React from 'react';
import ReportList from './components/ReportList';
import { motion } from "framer-motion";
import { ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
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

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl shadow-lg mr-4">
            <ChartBarIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
              Relatórios
            </h1>
            <p className="text-gray-400 mt-1">Visualize e exporte relatórios de débitos de clientes</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-200 mb-2">Total de Clientes</h3>
            <div className="p-2 rounded-lg bg-blue-900/20">
              <DocumentTextIcon className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-400">{customers.length}</p>
          <div className="mt-4">
            <span className="text-xs text-gray-400">Com débitos pendentes: {customersWithDebt}</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-200 mb-2">Crédito Total Pendente</h3>
            <div className="p-2 rounded-lg bg-green-900/20">
              <DocumentTextIcon className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalDebt)}</p>
          <div className="mt-4">
            <span className="text-xs text-gray-400">Valor total de débitos pendentes</span>
          </div>
        </div>
      </motion.div>
      
      <ReportList />
    </div>
  );
}
