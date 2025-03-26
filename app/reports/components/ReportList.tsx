'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { generateCustomerPDF } from '@/app/utils/drawnPDF';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCustomers } from '@/app/customers/service/reactQuery/customer.query';

export default function ReportList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { data: customers = [], isLoading, error } = useCustomers();
  const itemsPerPage = 10;

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const handleNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  return (
    <div className="space-y-6 p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="rounded-lg shadow-md overflow-hidden border border-gray-700">
        <Table className="table-auto w-full bg-gray-800 text-white">
          <TableHeader>
            <TableRow className="bg-gray-700">
              <TableHead className="px-4 py-3 text-left text-gray-300">Nome Completo</TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">CPF</TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4 text-gray-400">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-700 transition-colors duration-150">
                  <TableCell className="px-4 py-3">{customer.name}</TableCell>
                  <TableCell className="px-4 py-3">{customer.document}</TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      title='Gerar PDF'
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                      onClick={() => generateCustomerPDF(customer)}
                    >
                      <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                      Gerar Relatório <br/>de Débitos
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-700 text-white hover:bg-gray-600 transition-colors rounded-l-lg px-3 py-2"
          >
            Anterior
          </Button>
          <span className="text-gray-300">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-700 text-white hover:bg-gray-600 transition-colors rounded-r-lg px-3 py-2"
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
