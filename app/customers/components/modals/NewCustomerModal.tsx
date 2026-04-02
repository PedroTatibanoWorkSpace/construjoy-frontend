import React, { useState, useEffect } from "react";
import { customerSchema } from "../zod/CustomerSchema";
import InputMask from "react-input-mask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Customer } from "../../entities/customers.entity";
import { toast } from "@/hooks/use-toast";

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customer: Customer) => void;
}

const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  isOpen,
  onClose,
  onAddCustomer,
}) => {
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const result = customerSchema.safeParse({ name, document, phone, email });
    setIsFormValid(result.success);
  }, [name, document, phone, email]);

  const handleClose = () => {
    setName("");
    setDocument("");
    setPhone("");
    setEmail("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = customerSchema.safeParse({ name, document, phone, email });
    if (!result.success) {
      toast.error("Erro de validação");
      return;
    }

    const newCustomer: Customer = { name, document, phone, email };
    onAddCustomer(newCustomer);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} aria-label="Cadastro de novo cliente">
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer-name" className="text-sm text-gray-400 mb-1.5 block">Nome</Label>
              <Input
                id="customer-name"
                type="text"
                placeholder="Pedro da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-required="true"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-400 mb-1.5 block">Documento</Label>
              <InputMask
                mask="999.999.999-99"
                placeholder="999.999.999-99"
                value={document}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocument(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-gray-800 bg-gray-900/80 px-3.5 py-2 text-sm text-white shadow-sm transition-all placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500/40"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-400 mb-1.5 block">Telefone</Label>
              <InputMask
                mask="(99) 99999-9999"
                placeholder="(99) 99999-9999"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-gray-800 bg-gray-900/80 px-3.5 py-2 text-sm text-white shadow-sm transition-all placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500/40"
              />
            </div>
            <div>
              <Label htmlFor="customer-email" className="text-sm text-gray-400 mb-1.5 block">Email</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="exemplo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-required="true"
              />
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

export default NewCustomerModal;
