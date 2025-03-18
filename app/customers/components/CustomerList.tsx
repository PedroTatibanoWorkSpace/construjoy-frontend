"use client";

import React, { useState } from "react";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../service/reactQuery/customer.query";
import { Customer } from "../entities/customers.entity";
import { formatDate } from "../../utils/format";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import NewCustomerModal from "./modals/NewCustomerModal";
import { EditCustomerModal } from "./modals/EditCustomerModal";
import { DeleteCustomerModal } from "./modals/DeleteCustomerModal";
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

export default function CustomerList() {
  const { data: customers = [], isLoading, error } = useCustomers();
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedCustomers = [...customers].sort((a, b) => {
    const aId = a.internalId ? Number(a.internalId) : 0;
    const bId = b.internalId ? Number(b.internalId) : 0;
    return aId - bId;
  });

  const filteredCustomers = sortedCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.document.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.phone.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleOpenNewModal = () => setIsNewModalOpen(true);
  const handleCloseNewModal = () => setIsNewModalOpen(false);
  const handleOpenEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedCustomer(null);
    setIsEditModalOpen(false);
  };
  const handleOpenDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setSelectedCustomer(null);
    setIsDeleteModalOpen(false);
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    createCustomerMutation.mutate(newCustomer);
    setIsNewModalOpen(false);
  };

  const handleUpdateCustomer = (updatedCustomer: Partial<Customer>) => {
    if (selectedCustomer?.id) {
      updateCustomerMutation.mutate({ id: selectedCustomer.id, data: updatedCustomer });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer?.id) {
      deleteCustomerMutation.mutate(selectedCustomer.id);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar clientes</div>;

  return (
    <div className="space-y-4">

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, documento ou email..."
            className="dark-input block w-full pl-10 pr-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Button onClick={handleOpenNewModal} className="bg-blue-600 text-white hover:bg-blue-800">
          Novo Cliente
        </Button>
      </div>

      <div className="rounded-lg shadow">
        <Table className="hover:bg-transparent">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.document}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{formatDate(new Date(customer.createdAt || ""))}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="bg-gray-700 text-white hover:bg-gray-800 mr-2"
                    onClick={() => handleOpenEditModal(customer)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 text-white hover:bg-red-800"
                    onClick={() => handleOpenDeleteModal(customer)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={currentPage === 1 ? undefined : handlePrevPage}
                className={`${
                  currentPage === 1 ? "opacity-50 pointer-events-none" : "bg-gray-700 text-white hover:bg-gray-800"
                }`}
              >
              </PaginationPrevious>
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              return (
                <PaginationItem key={page}>
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    className={currentPage === page ? "bg-white text-black" : "bg-gray-600 text-white hover:bg-gray-700"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={currentPage === totalPages ? undefined : handleNextPage}
                className={`${
                  currentPage === totalPages ? "opacity-50 pointer-events-none" : "bg-gray-700 text-white hover:bg-gray-800"
                }`}
              >
                Próxima
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <NewCustomerModal isOpen={isNewModalOpen} onClose={handleCloseNewModal} onAddCustomer={handleAddCustomer} />
      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        customer={selectedCustomer}
        onSave={handleUpdateCustomer}
      />
      <DeleteCustomerModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteCustomer}
      />
    </div>
  );
}
