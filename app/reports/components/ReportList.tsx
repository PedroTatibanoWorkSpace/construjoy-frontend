"use client";

import React, { useState } from "react";
import { MagnifyingGlassIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { generateCustomerPDF } from "@/app/utils/drawnPDF";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCustomers } from "@/app/customers/service/reactQuery/customer.query";
import { StandardPagination } from "@/app/components/Pagination";
import { formatCurrency } from "@/app/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: customers = [], isLoading } = useCustomers();
  const itemsPerPage = 10;

  const customersWithDebtInfo = customers.map((customer) => {
    const pendingReceivables = customer.receivables?.filter(
      (r) => r.paymentStatus && r.paymentStatus !== "Pago"
    ) || [];

    const totalDebt = pendingReceivables.reduce((sum, r) => sum + r.value, 0);
    const overdueCount = pendingReceivables.filter((r) => r.paymentStatus === "Atrasado").length;
    const pendingCount = pendingReceivables.filter((r) => r.paymentStatus === "Pendente").length;

    return {
      ...customer,
      totalDebt,
      overdueCount,
      pendingCount,
      totalPending: pendingReceivables.length,
      hasDebt: pendingReceivables.length > 0,
    };
  });

  const filteredCustomers = customersWithDebtInfo.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.document.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40" aria-live="polite">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="space-y-5"
    >
      {/* Search */}
      <div className="flex items-center">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome ou documento..."
            className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/80 text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <caption className="sr-only">Relatório de débitos por cliente</caption>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Débito Total</TableHead>
            <TableHead>Contas</TableHead>
            <TableHead>Situação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            <AnimatePresence>
              {paginatedCustomers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="border-b border-gray-800/40 transition-colors duration-150 hover:bg-white/[0.03]"
                >
                  <TableCell className="font-medium text-white">
                    {customer.name}
                  </TableCell>
                  <TableCell className="text-gray-400 font-mono text-xs">
                    {customer.document}
                  </TableCell>
                  <TableCell>
                    {customer.hasDebt ? (
                      <span className="font-semibold text-red-400">
                        {formatCurrency(customer.totalDebt)}
                      </span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.hasDebt ? (
                      <div className="flex items-center gap-2">
                        {customer.overdueCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md bg-red-500/15 text-red-400 border border-red-500/20">
                            {customer.overdueCount} vencida{customer.overdueCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {customer.pendingCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
                            {customer.pendingCount} pendente{customer.pendingCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        Em dia
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.hasDebt ? (
                      <div className="w-full bg-gray-800 rounded-full h-1.5 max-w-[100px]">
                        <div
                          className="bg-gradient-to-r from-red-500 to-yellow-500 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              (customer.overdueCount / Math.max(customer.totalPending, 1)) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full bg-gray-800 rounded-full h-1.5 max-w-[100px]">
                        <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {customer.hasDebt ? (
                      <Button
                        size="sm"
                        onClick={() => generateCustomerPDF(customer)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <DocumentArrowDownIcon className="h-3.5 w-3.5" />
                        Exportar PDF
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-600">Sem débitos</span>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>

      <StandardPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </motion.div>
  );
}
