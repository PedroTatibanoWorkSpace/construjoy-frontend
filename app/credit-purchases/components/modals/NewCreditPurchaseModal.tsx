import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomers } from "@/app/customers/service/reactQuery/customer.query";
import CurrencyInput from "react-currency-input-field";
import { creditPurchaseSchema } from "../zod/CreditPurchaseSchema";
import { CreditPurchase } from "../../entities/credit-purchase.entity";

interface NewCreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCreditPurchase: (creditPurchase: CreditPurchase) => void;
}

const NewCreditPurchaseModal: React.FC<NewCreditPurchaseModalProps> = ({
  isOpen,
  onClose,
  onAddCreditPurchase,
}) => {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const customers = useCustomers().data || [];

  useEffect(() => {
    const numericAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
    const purchaseDateObj = new Date(purchaseDate);
    const dueDateObj = new Date(dueDate);

    const result = creditPurchaseSchema.safeParse({
      clientId: customerId,
      value: numericAmount,
      description,
      validate: dueDateObj,
      purchaseDate: purchaseDateObj,
    });

    setIsFormValid(result.success);
  }, [customerId, amount, description, purchaseDate, dueDate]);

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
  
    const numericAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
    const purchaseDateObj = new Date(purchaseDate);
    const dueDateObj = new Date(dueDate);
  
    const result = creditPurchaseSchema.safeParse({
      clientId: customerId, 
      value: numericAmount, 
      description,
      validate: dueDateObj,
      purchaseDate: purchaseDateObj,
    });
  
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Por favor, verifique os campos preenchidos";
      toast.error("Erro de validação", errorMessage);
      return;
    }
  
    const newPurchase: CreditPurchase = {
      clientId: customerId,
      value: numericAmount,
      description,
      validate: dueDateObj,
      purchaseDate: purchaseDateObj,
      client: customers.find((c) => c.id === customerId)!,
    };
  
    onAddCreditPurchase(newPurchase);
    handleClose();
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                      ? customers.find((c) => c.id === customerId)?.name
                      : "Selecione um cliente"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md">
                  <div className="px-2 py-2">
                    <Input
                      placeholder="Pesquisar cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md mb-2"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') {
                          e.preventDefault();
                        }
                      }}
                      autoComplete="off"
                    />
                  </div>
                  <SelectItem
                    value="default"
                    disabled
                    className="text-gray-500"
                  >
                    Selecione um cliente
                  </SelectItem>
                  {filteredCustomers.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id || ""}
                      className={`bg-gray-800 text-gray-100 hover:bg-gray-600 hover:text-gray-100 ${
                        customerId === customer.id ? "bg-gray-600" : ""
                      }`}
                    >
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Valor</Label>
              <CurrencyInput
                intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                value={amount}
                onValueChange={(value) => setAmount(value || "")}
                placeholder="R$ 0,00"
                customInput={Input}
                className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
              />
            </div>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Descrição</Label>
              <Input
                type="text"
                placeholder="Picareta..."
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
                className="bg-blue-600 hover:bg-blue-700 text-gray-9 rounded-md"
                disabled={!isFormValid}
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
