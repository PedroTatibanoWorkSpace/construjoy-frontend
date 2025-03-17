"use client";

import React, { useState } from "react";
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "../service/reactQuery/customer.query";
import { Customer } from "../service/entity/customers.entity";
import { formatDate } from "../../utils/format";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import NewCustomerModal from "./modals/NewCustomerModal";
import { EditCustomerModal } from "./modals/EditCustomerModal";
import { DeleteCustomerModal } from "./modals/DeleteCustomerModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function CustomerList() {
  const { data: customers = [], isLoading, error } = useCustomers();
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const itemsPerPage = 10;

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
    if (selectedCustomer && selectedCustomer.id) {
      updateCustomerMutation.mutate({ id: selectedCustomer.id, data: updatedCustomer });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer && selectedCustomer.id) {
      deleteCustomerMutation.mutate(selectedCustomer.id);
      setIsDeleteModalOpen(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      customer?.document?.includes(searchTerm) ||
      customer?.email?.toLowerCase()?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleOpenNewModal} className="bg-blue-600 text-white hover:bg-blue-700">
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
                    className="bg-blue-800 text-white hover:bg-blue-900 mr-2"
                    onClick={() => handleOpenEditModal(customer)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="hover:bg-red-700"
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
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
          <Button variant="outline" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
            Anterior
          </Button>
          <span className="text-gray-300">Página {currentPage} de {totalPages}</span>
          <Button variant="outline" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>
            Próxima
          </Button>
        </div>
      )}
      
      <NewCustomerModal isOpen={isNewModalOpen} onClose={handleCloseNewModal} onAddCustomer={handleAddCustomer} />
      <EditCustomerModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} customer={selectedCustomer} onSave={handleUpdateCustomer} />
      <DeleteCustomerModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleDeleteCustomer} />
    </div>
  );
}
