"use client";

import React from 'react';
import { useCustomers } from '../customers/service/reactQuery/customer.query';
import { useCreditPurchases } from '../credit-purchases/service/reactQuery/creditPurchase.query';
import { formatDate, formatCurrency } from '../utils';
import { Toaster } from "@/components/ui/toaster";

export default function Dashboard() {
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const { data: purchases = [], isLoading: isLoadingPurchases } = useCreditPurchases();
  
  const overdueCount = purchases.filter(p => p.paymentStatus === 'Atrasado').length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const dueThisMonth = purchases.filter(p => {
    const dueDate = new Date(p.validate);
    return dueDate.getMonth() === currentMonth && 
           dueDate.getFullYear() === currentYear && 
           p.paymentStatus === 'Pendente';
  }).length;
  
  const overduePurchases = purchases
    .filter(p => p.paymentStatus === 'Atrasado')
    .sort((a, b) => new Date(a.validate).getTime() - new Date(b.validate).getTime());

  if (isLoadingCustomers || isLoadingPurchases) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Painel de Controle de Crédito</h1>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="dark-card rounded-lg overflow-hidden shadow">
            <div className="p-5 bg-gradient-to-r from-gray-900 to-gray-800">
              <h3 className="text-lg font-medium text-gray-200">Créditos Vencidos</h3>
              <p className="mt-1 text-3xl font-semibold text-red-400">
                {overdueCount}
              </p>
            </div>
          </div>

          <div className="dark-card rounded-lg overflow-hidden shadow">
            <div className="p-5 bg-gradient-to-r from-gray-900 to-gray-800">
              <h3 className="text-lg font-medium text-gray-200">Vencimentos este Mês</h3>
              <p className="mt-1 text-3xl font-semibold text-yellow-400">
                {dueThisMonth}
              </p>
            </div>
          </div>

          <div className="dark-card rounded-lg overflow-hidden shadow">
            <div className="p-5 bg-gradient-to-r from-gray-900 to-gray-800">
              <h3 className="text-lg font-medium text-gray-200">Total de Clientes</h3>
              <p className="mt-1 text-3xl font-semibold text-blue-400">
                {customers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="dark-card shadow rounded-lg">
          <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-white">Contas Atrasadas</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Dias Atrasados
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {overduePurchases.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                        Nenhuma conta atrasada encontrada
                      </td>
                    </tr>
                  ) : (
                    overduePurchases.map((purchase) => {
                      const today = new Date();
                      const dueDate = new Date(purchase.validate);
                      const diffTime = today.getTime() - dueDate.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      
                      return (
                        <tr key={purchase.id}>
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
                              {diffDays} dia{diffDays !== 1 ? 's' : ''}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
