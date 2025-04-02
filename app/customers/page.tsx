"use client";

import React from 'react';
import CustomerList from './components/CustomerList';
import { motion } from "framer-motion";
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useCustomers } from './service/reactQuery/customer.query';

export default function CustomersPage() {
  const { data: customers = [] } = useCustomers();
  
  const activeCustomers = customers.filter(customer => 
    customer.status !== 'Inactive'
  ).length;
  
  const customersWithCredit = customers.filter(customer => 
    customer.receivables && customer.receivables.some(r => 
      r.paymentStatus === 'Pendente' || r.paymentStatus === 'Atrasado'
    )
  ).length;

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg mr-4">
            <UserGroupIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Clientes
            </h1>
            <p className="text-gray-400 mt-1">Gerencie sua base de clientes</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
      >
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 shadow-lg">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Clientes Ativos</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-blue-400">{activeCustomers}</span>
            <span className="text-gray-400 ml-2 text-sm mb-1">de {customers.length} clientes</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 shadow-lg">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Com Crédito Pendente</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-amber-400">{customersWithCredit}</span>
            <span className="text-gray-400 ml-2 text-sm mb-1">clientes</span>
          </div>
        </div>
      </motion.div>
      
      <CustomerList />
    </div>
  );
}