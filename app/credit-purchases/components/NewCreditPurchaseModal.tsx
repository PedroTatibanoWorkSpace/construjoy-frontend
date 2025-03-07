import React, { useState } from 'react';
import { z } from 'zod';
import { Customer } from '../../types';

interface NewCreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
}

const creditPurchaseSchema = z.object({
  customerId: z.string().min(1, 'Cliente é obrigatório'),
  amount: z.number().min(1, 'Valor deve ser maior que zero'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  purchaseDate: z.string().min(1, 'Data da compra é obrigatória'),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
});

const NewCreditPurchaseModal: React.FC<NewCreditPurchaseModalProps> = ({ isOpen, onClose, customers }) => {
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleClose = () => {
    setCustomerId('');
    setAmount('');
    setDescription('');
    setPurchaseDate('');
    setDueDate('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = creditPurchaseSchema.safeParse({
      customerId,
      amount: parseFloat(amount),
      description,
      purchaseDate,
      dueDate,
    });
    if (!result.success) {
      alert('Erro: ' + JSON.stringify(result.error.format(), null, 2));
      return;
    }
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-100">Nova Compra a Crédito</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">Cliente</label>
            <select
              className="dark-input block w-full mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            >
              <option value="" disabled>Selecione um cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">Valor</label>
            <input
              type="number"
              placeholder="Digite o valor"
              className="dark-input block w-full mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">Descrição</label>
            <input
              type="text"
              placeholder="Digite a descrição"
              className="dark-input block w-full mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">Data da Compra</label>
            <input
              type="date"
              className="dark-input block w-full mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-500"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">Data de Vencimento</label>
            <input
              type="date"
              className="dark-input block w-full mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-md mr-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCreditPurchaseModal;
