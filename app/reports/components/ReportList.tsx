'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { generateCustomerPDF } from '@/utils/drawnPDF';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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
        status: 'pending' as 'pending',
      },
      {
        id: '2',
        amount: 23323,
        description: 'Compra de materiais',
        purchaseDate: new Date('2023-08-01'),
        dueDate: new Date('2023-09-05'),
        status: 'pending' as 'pending',
      },
    ],
  },
];

export default function ReportList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

      <div className="rounded-lg shadow">
        <Table className="hover:bg-transparent">
          <TableHeader>
            <TableRow>
              <TableHead>Nome Completo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.fullName}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-500"
                    onClick={() => generateCustomerPDF(customer)}
                  >
                    Gerar PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-gray-300">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
