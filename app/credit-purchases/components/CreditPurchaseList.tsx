'use client';

import React, { useState } from 'react';
import { CreditPurchase, Customer } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import NewCreditPurchaseModal from './NewCreditPurchaseModal';

// Mock data - substituir por chamadas API reais
const mockCustomers: Customer[] = [
  {
    id: '1',
    fullName: 'João Silva',
    cpf: '123.456.789-00',
    address: 'Rua Principal, 123',
    phone: '(11) 98765-4321',
    email: 'joao@exemplo.com',
    registrationDate: new Date('2023-01-01'),
  },
];

const mockPurchases: CreditPurchase[] = [
  {
    id: '1',
    customerId: '1',
    amount: 1000,
    description: 'Compra de materiais',
    purchaseDate: new Date('2023-08-01'),
    dueDate: new Date('2023-09-05'),
    status: 'pending',
  },
];

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid':
      return 'Pago';
    case 'pending':
      return 'Pendente';
    case 'overdue':
      return 'Atrasado';
    default:
      return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-900 text-green-200';
    case 'pending':
      return 'bg-yellow-900 text-yellow-200';
    case 'overdue':
      return 'bg-red-900 text-red-200';
    default:
      return 'bg-gray-900 text-gray-200';
  }
};

export default function CreditPurchaseList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredPurchases = mockPurchases.filter(purchase => {
    const customer = mockCustomers.find(c => c.id === purchase.customerId);
    return (
      customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por cliente ou descrição..."
            className="dark-input block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleOpenModal}
        >
          Nova Compra
        </button>
      </div>

      <div className="dark-card rounded-lg shadow overflow-hidden">
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
                  Data da Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedPurchases.map((purchase) => {
                const customer = mockCustomers.find(c => c.id === purchase.customerId);
                return (
                  <tr key={purchase.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {customer?.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {purchase.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatCurrency(purchase.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(purchase.purchaseDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(purchase.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(purchase.status)}`}>
                        {getStatusText(purchase.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        Editar
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-300">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
      <NewCreditPurchaseModal isOpen={isModalOpen} onClose={handleCloseModal} customers={mockCustomers} />
    </div>
  );
}