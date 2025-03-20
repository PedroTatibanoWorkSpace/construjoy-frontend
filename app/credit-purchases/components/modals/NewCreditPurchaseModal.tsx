import React, { useState } from "react";
import { z } from "zod";
import { Customer } from "../../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NewCreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
}

const creditPurchaseSchema = z.object({
  customerId: z.string().min(1, "Cliente é obrigatório"),
  amount: z.number().min(1, "Valor deve ser maior que zero"),
  description: z.string().min(1, "Descrição é obrigatória"),
  purchaseDate: z.string().min(1, "Data da compra é obrigatória"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
});

const NewCreditPurchaseModal: React.FC<NewCreditPurchaseModalProps> = ({
  isOpen,
  onClose,
  customers,
}) => {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => {
    setCustomerId("");
    setAmount("");
    setDescription("");
    setPurchaseDate("");
    setDueDate("");
    setSearchTerm("");
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
    handleClose();
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg bg-gray-900 text-gray-100 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-100">
            Nova Compra a Crédito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Cliente</Label>
              <Select
                onValueChange={(value) => setCustomerId(value)}
                value={customerId || "default"}
              >
                <SelectTrigger className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md">
                  <SelectValue>
                    {customerId
                      ? customers.find((c) => c.id === customerId)?.fullName
                      : "Selecione um cliente"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md">
                  <SelectItem value="default" disabled className="text-gray-500">
                    Selecione um cliente
                  </SelectItem>
                  {filteredCustomers.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id}
                      className={`bg-gray-800 text-gray-100 hover:bg-gray-600 hover:text-gray-100 ${
                        customerId === customer.id ? "bg-gray-600" : ""
                      }`}
                    >
                      {customer.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Valor</Label>
              <Input
                type="number"
                placeholder="Digite o valor"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
              />
            </div>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Descrição</Label>
              <Input
                type="text"
                placeholder="Digite a descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
              />
            </div>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Data da Compra</Label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
              />
            </div>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">
                Data de Vencimento
              </Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="mr-2 bg-gray-700 text-gray-100 hover:bg-gray-600 rounded-md"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 rounded-md"
              >
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCreditPurchaseModal;
