"use client";

import React, { useState } from "react";
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "../service/reactQuery/customer.query";
import { Customer } from "../entities/customers.entity";
import { formatDate } from "@/app/utils";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import NewCustomerModal from "./modals/NewCustomerModal";
import { EditCustomerModal } from "./modals/EditCustomerModal";
import { DeleteModal } from "../../components/modals/DeleteModal";
import { PaidMultipleModal } from "./modals/PaidMultipleModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { toast } from "@/hooks/use-toast";
import { StandardPagination } from "@/app/components/Pagination";
import { motion, AnimatePresence } from "framer-motion";

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

  const filteredCustomers = sortedCustomers.filter((customer) =>
    [
      customer.name.toLowerCase(),
      customer.document,
      customer.email.toLowerCase(),
      customer.phone,
    ].some((field) => field.includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPaidMultipleModalOpen, setIsPaidMultipleModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

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

  const handleOpenPaidMultipleModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsPaidMultipleModalOpen(true);
  };

  const handleClosePaidMultipleModal = () => {
    setSelectedCustomer(null);
    setIsPaidMultipleModalOpen(false);
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    createCustomerMutation.mutate(newCustomer, {
      onSuccess: () => {
        toast.success("Cliente adicionado", "Cliente cadastrado com sucesso!");
        setIsNewModalOpen(false);
      },
      onError: (error: any) => {
        toast.error(
          "Erro ao adicionar cliente",
          error?.message || "Não foi possível adicionar o cliente."
        );
      },
    });
  };

  const handleUpdateCustomer = (updatedCustomer: Partial<Customer>) => {
    if (selectedCustomer?.id) {
      updateCustomerMutation.mutate(
        {
          id: selectedCustomer.id,
          data: updatedCustomer,
        },
        {
          onSuccess: () => {
            toast.success(
              "Cliente atualizado",
              "Os dados do cliente foram atualizados com sucesso!"
            );
            setIsEditModalOpen(false);
          },
          onError: (error: any) => {
            toast.error(
              "Erro ao atualizar cliente",
              error?.message ||
                "Não foi possível atualizar os dados do cliente."
            );
          },
        }
      );
    }
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer?.id) {
      deleteCustomerMutation.mutate(selectedCustomer.id, {
        onSuccess: () => {
          toast.success(
            "Cliente excluído",
            "O cliente foi excluído com sucesso!"
          );
          setIsDeleteModalOpen(false);
        },
        onError: (error: any) => {
          toast.error(
            "Erro ao excluir cliente",
            error?.message || "Não foi possível excluir o cliente."
          );
        },
      });
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) {
    toast.error(
      "Erro ao carregar",
      "Não foi possível carregar a lista de clientes."
    );
    return <div>Erro ao carregar clientes</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, documento ou email..."
            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleOpenNewModal}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg shadow-lg transition-transform"
            title="Adicionar novo cliente"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Cliente
          </Button>
        </motion.div>
      </div>

      <div className="rounded-lg shadow-md overflow-hidden border border-gray-700">
        <Table className="table-auto w-full bg-gray-800 text-white">
          <TableHeader>
            <TableRow className="bg-gray-700">
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Nome
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                CPF
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Telefone
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Email
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Data de Cadastro
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-gray-300">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-4 text-gray-400"
                >
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {paginatedCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-700 transition-colors duration-150"
                  >
                    <TableCell className="px-4 py-3">{customer.name}</TableCell>
                    <TableCell className="px-4 py-3">
                      {customer.document}
                    </TableCell>
                    <TableCell className="px-4 py-3">{customer.phone}</TableCell>
                    <TableCell className="px-4 py-3">{customer.email}</TableCell>
                    <TableCell className="px-4 py-3">
                      {formatDate(new Date(customer.createdAt || ""))}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex space-x-2">
                        {customer.receivables && 
                          customer.receivables.some(receivable => 
                            receivable.paymentStatus === "Pendente" || 
                            receivable.paymentStatus === "Atrasado") && (
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              size="sm"
                              className="bg-gray-500 text-white hover:bg-gray-600 px-3 py-1 rounded-md transition"
                              onClick={() => handleOpenPaidMultipleModal(customer)}
                              title="Registrar pagamentos múltiplos"
                            >
                              <CurrencyDollarIcon className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            size="sm"
                            className="bg-gray-700 text-white hover:bg-gray-600 px-3 py-1 rounded-md transition"
                            onClick={() => handleOpenEditModal(customer)}
                            title="Editar cliente"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-500 px-3 py-1 rounded-md transition"
                            onClick={() => handleOpenDeleteModal(customer)}
                            title="Excluir cliente"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      <StandardPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <NewCustomerModal
        isOpen={isNewModalOpen}
        onClose={handleCloseNewModal}
        onAddCustomer={handleAddCustomer}
      />
      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        customer={selectedCustomer}
        onSave={handleUpdateCustomer}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteCustomer}
      />
      <PaidMultipleModal
        isOpen={isPaidMultipleModalOpen}
        onClose={handleClosePaidMultipleModal}
        customer={selectedCustomer}
      />
    </motion.div>
  );
}
