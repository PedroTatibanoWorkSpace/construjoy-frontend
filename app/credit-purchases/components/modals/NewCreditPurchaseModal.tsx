import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  isOpen, onClose, onAddCreditPurchase,
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
    const result = creditPurchaseSchema.safeParse({
      clientId: customerId, value: numericAmount, description,
      validate: new Date(dueDate), purchaseDate: new Date(purchaseDate),
    });
    setIsFormValid(result.success);
  }, [customerId, amount, description, purchaseDate, dueDate]);

  const handleClose = () => {
    setCustomerId(""); setAmount(""); setDescription("");
    setPurchaseDate(""); setDueDate(""); setSearchTerm("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
    const result = creditPurchaseSchema.safeParse({
      clientId: customerId, value: numericAmount, description,
      validate: new Date(dueDate), purchaseDate: new Date(purchaseDate),
    });
    if (!result.success) {
      toast.error("Erro de validação", result.error.errors[0]?.message || "Verifique os campos preenchidos");
      return;
    }
    const newPurchase: CreditPurchase = {
      clientId: customerId, value: numericAmount, description,
      validate: new Date(dueDate), purchaseDate: new Date(purchaseDate),
      client: customers.find((c) => c.id === customerId)!,
    };
    onAddCreditPurchase(newPurchase);
    handleClose();
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Compra a Crédito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-400 mb-1.5 block">Cliente</Label>
              <Select onValueChange={(value) => setCustomerId(value)} value={customerId || "default"}>
                <SelectTrigger className="rounded-xl border-gray-800 bg-gray-900/80 text-white h-10">
                  <SelectValue>
                    {customerId ? customers.find((c) => c.id === customerId)?.name : "Selecione um cliente"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 rounded-xl">
                  <div className="px-2 py-2">
                    <Input
                      placeholder="Pesquisar cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-2"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') e.preventDefault(); }}
                      autoComplete="off"
                    />
                  </div>
                  <SelectItem value="default" disabled className="text-gray-500">Selecione um cliente</SelectItem>
                  {filteredCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id || ""} className="text-gray-200 focus:bg-white/[0.06] focus:text-white">
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm text-gray-400 mb-1.5 block">Valor</Label>
              <CurrencyInput
                intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                value={amount}
                onValueChange={(value) => setAmount(value || "")}
                placeholder="R$ 0,00"
                customInput={Input}
              />
            </div>
            <div>
              <Label className="text-sm text-gray-400 mb-1.5 block">Descrição</Label>
              <Input type="text" placeholder="Material de construção..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-400 mb-1.5 block">Data da Compra</Label>
                <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
              </div>
              <div>
                <Label className="text-sm text-gray-400 mb-1.5 block">Vencimento</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={handleClose} className="text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" disabled={!isFormValid} className="bg-blue-600 text-white hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-40">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCreditPurchaseModal;
