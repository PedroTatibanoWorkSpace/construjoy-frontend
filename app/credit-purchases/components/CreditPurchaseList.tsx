"use client";

import React, { useState } from "react";
import { useCreditPurchases, useCreateCreditPurchase, useDeleteCreditPurchase, useUpdateCreditPurchase } from "../service/reactQuery/creditPurchase.query";
import { formatCurrency, formatDate, formatDateForSearch } from "../../utils/format";
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
import NewCreditPurchaseModal from "./modals/NewCreditPurchaseModal";
import { CreditPurchase } from "../entities/credit-purchase.entity";
import { DeleteModal } from "@/app/components/modals/DeleteModal";
import { EditCreditPurchaseModal } from "./modals/EditCreditPurchaseModal";
import { getStatusClass } from "../../utils/format";
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function CreditPurchaseList() {
  const { data: purchases = [], isLoading } = useCreditPurchases();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteCreditPurchaseMutation = useDeleteCreditPurchase();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<CreditPurchase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const createCreditPurchaseMutation = useCreateCreditPurchase();
  const updateCreditPurchaseMutation = useUpdateCreditPurchase();
  const itemsPerPage = 10;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddCreditPurchase = (newCreditPurchase: CreditPurchase) => {
    createCreditPurchaseMutation.mutate(newCreditPurchase);
    handleCloseModal();
  };

  const handleOpenDeleteModal = (purchase: CreditPurchase) => {
    setSelectedPurchase(purchase);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedPurchase(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeletePurchase = () => {
    if (selectedPurchase?.id) {
      deleteCreditPurchaseMutation.mutate(selectedPurchase.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleOpenEditModal = (purchase: CreditPurchase) => {
    setSelectedPurchase(purchase);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedPurchase(null);
    setIsEditModalOpen(false);
  };

  const handleUpdatePurchase = (updatedPurchase: Partial<CreditPurchase>) => {
    if (selectedPurchase?.id) {
      updateCreditPurchaseMutation.mutate({ id: selectedPurchase.id, data: updatedPurchase });
      setIsEditModalOpen(false);
    }
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const searchTermLower = searchTerm.toLowerCase();
    const formattedValidate = formatDateForSearch(purchase.validate);
    const formattedPaymentDate = purchase.paymentDate
      ? formatDateForSearch(purchase.paymentDate)
      : "";

    return (
      purchase.description.toLowerCase().includes(searchTermLower) ||
      purchase.client?.name.toLowerCase().includes(searchTermLower) ||
      purchase.value.toString().includes(searchTerm) ||
      formattedValidate.includes(searchTerm) ||
      formattedPaymentDate.includes(searchTerm)
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
            placeholder="Buscar por cliente, descrição, valor ou data (dd/mm/aaaa)..."
            className="dark-input block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4" />
          Nova Compra
        </Button>
      </div>

      <div className="rounded-lg shadow">
        <Table className="hover:bg-transparent">
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Data da compra</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data do Pagamento</TableHead>
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
                  <TableCell>{purchase.client?.name || ""}</TableCell>
                  <TableCell className="break-words max-w-[150px]">
                    {purchase.description}
                  </TableCell>
                  <TableCell>{formatCurrency(purchase.value)}</TableCell>
                  <TableCell>{formatDate(purchase.validate)}</TableCell>
                  <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusClass(
                        purchase.paymentStatus || ""
                      )}`}
                    >
                      {purchase.paymentStatus || ""}
                    </span>
                  </TableCell>
                  <TableCell>
                    {purchase.paymentDate
                      ? formatDate(purchase.paymentDate)
                      : "Não pago"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="bg-gray-700 text-white hover:bg-gray-800 mr-2"
                      onClick={() => handleOpenEditModal(purchase)}
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="hover:bg-red-700"
                      onClick={() => handleOpenDeleteModal(purchase)}
                    >
                     <TrashIcon className="h-4 w-4" />
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
        onAddCreditPurchase={handleAddCreditPurchase}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeletePurchase}
      />
      <EditCreditPurchaseModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        creditPurchase={selectedPurchase}
        onSave={handleUpdatePurchase}
      />
    </div>
  );
}
