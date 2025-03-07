'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { generateCustomerPDF } from '@/utils/drawnPDF';

const mockCustomers = [
  {
    id: '1',
    fullName: 'João Silva',
    purchases: [
      {
        id: '1',
        amount: 1000,
        description: 'Compra de materiais',
        purchaseDate: new Date('2023-08-01'),
        dueDate: new Date('2025-12-05'),
        status: 'pending' as 'pending' 
      },
      {
        id: '1',
        amount: 23323,
        description: 'Compra de materiais',
        purchaseDate: new Date('2023-08-01'),
        dueDate: new Date('2023-09-05'),
        status: 'pending' as 'pending' 
      },
      {
        id: '1',
        amount: 1000,
        description: 'Compra de materiais',
        purchaseDate: new Date('2023-08-01'),
        dueDate: new Date('2023-09-05'),
        status: 'pending' as 'pending' 
      }
    ]
  },
];


export default function ReportList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="dark-input block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="dark-card rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Nome Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                    {customer.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-blue-400 hover:text-blue-300 mr-3"
                      onClick={() => generateCustomerPDF(customer)}
                    >
                      Gerar PDF
                    </button>
                  </td>
                </tr>
              ))}
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
    </div>
  );
}
