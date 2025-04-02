"use client";

import React from 'react';
import CreditPurchaseList from './components/CreditPurchaseList';
import { motion } from "framer-motion";
import { CreditCardIcon, BanknotesIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useCreditPurchases } from './service/reactQuery/creditPurchase.query';
import { formatCurrency } from '../utils';

export default function CreditPurchasesPage() {
  const { data: purchases = [] } = useCreditPurchases();
  
  // Cálculos para o painel de resumo
  const totalCredit = purchases.reduce((sum, purchase) => {
    if (purchase.paymentStatus !== 'Pago') {
      return sum + purchase.value;
    }
    return sum;
  }, 0);
  
  const overdueCount = purchases.filter(p => p.paymentStatus === 'Atrasado').length;
  const pendingCount = purchases.filter(p => p.paymentStatus === 'Pendente').length;

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-lg mr-4">
            <CreditCardIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
              Compras a Crédito
            </h1>
            <p className="text-gray-400 mt-1">Gerencie os créditos concedidos</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-200 mb-2">Crédito Total</h3>
            <div className="p-2 rounded-lg bg-green-900/20">
              <BanknotesIcon className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalCredit)}</p>
          <p className="text-xs text-gray-400 mt-1">Total de crédito pendente</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-200 mb-2">Vencidos</h3>
            <div className="p-2 rounded-lg bg-red-900/20">
              <ClockIcon className="h-5 w-5 text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-400">{overdueCount}</p>
          <p className="text-xs text-gray-400 mt-1">Créditos em atraso</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-200 mb-2">Pendentes</h3>
            <div className="p-2 rounded-lg bg-amber-700/20">
              <ClockIcon className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
          <p className="text-xs text-gray-400 mt-1">Aguardando pagamento</p>
        </div>
      </motion.div>
      
      <CreditPurchaseList />
    </div>
  );
}