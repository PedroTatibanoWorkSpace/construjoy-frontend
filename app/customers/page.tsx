"use client";

import React from 'react';
import CustomerList from './components/CustomerList';
import { motion } from "framer-motion";
import { UserGroupIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
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
    <div className="space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 mr-4">
            <UserGroupIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Clientes
            </h1>
            <p className="text-gray-500 mt-1">Gerencie sua base de clientes</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Clientes Ativos</p>
              <p className="text-2xl font-bold mt-1 text-blue-400">{activeCustomers}</p>
              <p className="text-xs text-gray-500 mt-2">de {customers.length} clientes cadastrados</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10">
              <UserGroupIcon className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400">Com Crédito Pendente</p>
              <p className="text-2xl font-bold mt-1 text-amber-400">{customersWithCredit}</p>
              <p className="text-xs text-gray-500 mt-2">clientes com débitos em aberto</p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <CustomerList />
    </div>
  );
}
