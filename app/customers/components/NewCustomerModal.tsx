import React, { useState } from 'react';
import { z } from 'zod';
import InputMask from 'react-input-mask';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const customerSchema = z.object({
  fullName: z.string().min(1, 'Nome completo é obrigatório'),
  cpf: z.string().min(11, 'CPF deve ter no mínimo 11 caracteres'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  phone: z.string().min(10, 'Telefone deve ter no mínimo 10 caracteres'),
  email: z.string().email('Email inválido'),
});

const NewCustomerModal: React.FC<NewCustomerModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleClose = () => {
    setFullName('');
    setCpf('');
    setAddress('');
    setPhone('');
    setEmail('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = customerSchema.safeParse({ fullName, cpf, address, phone, email });
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
        <h2 className="text-2xl font-semibold mb-4 text-gray-100">Novo Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">Nome Completo</label>
            <input
              type="text"
              placeholder="Digite o nome completo"
              className="dark-input block w-full mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">CPF</label>
            <InputMask
              mask="999.999.999-99"
              placeholder="Digite o CPF"
              className="dark-input block w-full mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-500"
              value={cpf}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">Endereço</label>
            <input
              type="text"
              placeholder="Digite o endereço"
              className="dark-input block w-full mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">Telefone</label>
            <InputMask
              mask="(99) 99999-9999"
              placeholder="Digite o telefone"
              className="dark-input block w-full mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-500"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">Email</label>
            <input
              type="email"
              placeholder="Digite o email"
              className="dark-input block w-full mt-1 p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-700 text-gray-100 placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

export default NewCustomerModal;
