"use client";

import React, { useState } from "react";
import { useCreditPurchases } from "../service/reactQuery/creditPurchase.query";
import { formatCurrency, formatDate } from "../../utils/format";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import NewCreditPurchaseModal from "./NewCreditPurchaseModal";

const getStatusClass = (status: string) => {
  switch (status) {
    case "Pago":
      return "bg-green-600 text-white";
    case "Pendente":
      return "bg-yellow-600 text-black";
    case "Atrasado":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

export default function CreditPurchaseList() {
  const { data: purchases = [], isLoading } = useCreditPurchases();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("data", purchases)
  const itemsPerPage = 10;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const filteredPurchases = purchases.filter((purchase) => {
    return (
      purchase.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(
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
            placeholder="Buscar por descrição..."
            className="dark-input block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Nova Compra
        </Button>
      </div>

      <div className="rounded-lg shadow">
        <Table className="hover:bg-transparent">
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Pagamento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              paginatedPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.description}</TableCell>
                  <TableCell>{formatCurrency(purchase.value)}</TableCell>
                  <TableCell>{formatDate(purchase.validate)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusClass(
                        purchase.paymentStatus || ""
                      )}`}
                    >
                      {(purchase.paymentStatus || "")}
                    </span>
                  </TableCell>
                  <TableCell>
                    {purchase.paymentDate
                      ? formatDate(purchase.paymentDate)
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-blue-800 text-white hover:bg-blue-900 mr-2"
                    >
                      Editar
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="hover:bg-red-700"
                    >
                      Excluir
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
      <NewCreditPurchaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customers={[]} // Adjust if customer data is needed
      />
    </div>
  );
}
