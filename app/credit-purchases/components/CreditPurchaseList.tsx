"use client";

import React, { useState } from "react";
import {
  useCreditPurchases,
  useCreateCreditPurchase,
  useDeleteCreditPurchase,
  useUpdateCreditPurchase,
} from "../service/reactQuery/creditPurchase.query";
import {
  formatCurrency,
  formatDate,
  formatDateForSearch,
  getStatusClass,
} from "../../utils/format";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import NewCreditPurchaseModal from "./modals/NewCreditPurchaseModal";
import { DeleteModal } from "@/app/components/modals/DeleteModal";
import { EditCreditPurchaseModal } from "./modals/EditCreditPurchaseModal";
import { CreditPurchase } from "../entities/credit-purchase.entity";
import PaidCreditPurchaseModal from "./modals/PaidCreditPurchaseModal";
import { usePaidAccount } from "../service/reactQuery/creditPurchase.query";

export default function CreditPurchaseList() {
  const { data: purchases = [], isLoading } = useCreditPurchases();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaidCreditModal, setIsPaidCreditModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<CreditPurchase | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const createCreditPurchaseMutation = useCreateCreditPurchase();
  const updateCreditPurchaseMutation = useUpdateCreditPurchase();
  const deleteCreditPurchaseMutation = useDeleteCreditPurchase();
  const isPaidAccount = usePaidAccount();

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

  const handleClosePaidCreditModal = () => {
    setSelectedPurchase(null);
    setIsPaidCreditModal(false);
  };

  const handleOpenPaidCreditModal = (purchase: CreditPurchase) => {
    setSelectedPurchase(purchase);
    setIsPaidCreditModal(true);
  };

  const handleDeletePurchase = () => {
    if (selectedPurchase?.id) {
      deleteCreditPurchaseMutation.mutate(selectedPurchase.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handlePaidCreditPurchase = () => {
    if (selectedPurchase?.id) {
      isPaidAccount.mutate({
        id: selectedPurchase.id,
        paymentDate: new Date(),
      });
      setIsPaidCreditModal(false);
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
      updateCreditPurchaseMutation.mutate({
        id: selectedPurchase.id,
        data: updatedPurchase,
      });
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

  // Pagination
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-6 p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por cliente, descrição, valor ou data..."
            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={handleOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova Compra
        </Button>
      </div>

      <div className="rounded-lg shadow-md overflow-hidden border border-gray-700">
        <Table className="table-auto w-full bg-gray-800 text-white">
          <TableHeader>
            <TableRow className="bg-gray-700">
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Cliente
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Descrição
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Valor
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Validade
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Data da compra
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Data do Pagamento
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-4 text-gray-400"
                >
                  Carregando...
                </TableCell>
              </TableRow>
            ) : paginatedPurchases.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-4 text-gray-400"
                >
                  Nenhuma compra encontrada.
                </TableCell>
              </TableRow>
            ) : (
              paginatedPurchases.map((purchase) => (
                <TableRow
                  key={purchase.id}
                  className="hover:bg-gray-700 transition-colors duration-150"
                >
                  <TableCell className="px-4 py-3 break-words max-w-[600px]">
                    {purchase.client?.name || ""}
                  </TableCell>
                  <TableCell className="px-4 py-3 break-words max-w-[150px]">
                    {purchase.description}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {formatCurrency(purchase.value)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {formatDate(purchase.validate)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {formatDate(purchase.purchaseDate)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-lg font-medium ${getStatusClass(
                        purchase.paymentStatus || ""
                      )}`}
                    >
                      {purchase.paymentStatus || ""}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {purchase.paymentDate ? (
                      <span className="inline-block px-2 py-0.5 bg-green-200 text-green-950 rounded-md">
                        {formatDate(purchase.paymentDate)}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 bg-gray-400 text-black rounded-md">
                        Não pago
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-gray-500 text-white hover:bg-gray-600 px-3 py-1 rounded-md transition"
                        onClick={() => handleOpenPaidCreditModal(purchase)}
                      >
                        <CurrencyDollarIcon className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        className="bg-gray-700 text-white hover:bg-gray-600 px-3 py-1 rounded-md transition"
                        onClick={() => handleOpenEditModal(purchase)}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-500 px-3 py-1 rounded-md transition"
                        onClick={() => handleOpenDeleteModal(purchase)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={
                  currentPage === 1
                    ? undefined
                    : () => setCurrentPage(currentPage - 1)
                }
                className={`${
                  currentPage === 1
                    ? "opacity-50 pointer-events-none"
                    : "bg-gray-700 text-white hover:bg-gray-800"
                } transition-colors rounded-l-lg px-3 py-2`}
              >
                Anterior
              </PaginationPrevious>
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              return (
                <PaginationItem key={page}>
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    className={`${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    } transition-colors px-3 py-2`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={
                  currentPage === totalPages
                    ? undefined
                    : () => setCurrentPage(currentPage + 1)
                }
                className={`${
                  currentPage === totalPages
                    ? "opacity-50 pointer-events-none"
                    : "bg-gray-700 text-white hover:bg-gray-800"
                } transition-colors rounded-r-lg px-3 py-2`}
              >
                Próxima
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
      <PaidCreditPurchaseModal
        isOpen={isPaidCreditModal}
        onClose={handleClosePaidCreditModal}
        creditPurchase={selectedPurchase}
        onAddCreditPurchase={handlePaidCreditPurchase}
      />
    </div>
  );
}
