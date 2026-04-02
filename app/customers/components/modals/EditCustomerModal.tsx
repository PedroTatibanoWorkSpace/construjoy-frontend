import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Customer } from "../../entities/customers.entity";
import { customerSchema } from "../zod/CustomerSchema";
import { z } from "zod";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: (updatedCustomer: Omit<Customer, "createdAt" | "status">) => void;
}

export function EditCustomerModal({ isOpen, onClose, customer, onSave }: EditCustomerModalProps) {
  const [formData, setFormData] = useState<Omit<Customer, "createdAt" | "status">>({
    id: "", name: "", email: "", phone: "", document: "",
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id || "", name: customer.name,
        email: customer.email, phone: customer.phone, document: customer.document,
      });
    }
  }, [customer]);

  if (!customer) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const result = customerSchema.safeParse(formData);
    if (!result.success) { setErrors(result.error.issues); return; }
    onSave(formData);
  };

  const getErrorMessage = (field: string) => {
    const error = errors.find((err) => err.path.includes(field));
    return error ? error.message : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-400 mb-1.5 block">Nome</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
            {getErrorMessage("name") && <p className="text-red-400 text-xs mt-1.5">{getErrorMessage("name")}</p>}
          </div>
          <div>
            <Label className="text-sm text-gray-400 mb-1.5 block">Email</Label>
            <Input name="email" value={formData.email} onChange={handleChange} />
            {getErrorMessage("email") && <p className="text-red-400 text-xs mt-1.5">{getErrorMessage("email")}</p>}
          </div>
          <div>
            <Label className="text-sm text-gray-400 mb-1.5 block">Telefone</Label>
            <InputMask
              mask="(99) 99999-9999"
              value={formData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
              className="flex h-10 w-full rounded-xl border border-gray-800 bg-gray-900/80 px-3.5 py-2 text-sm text-white shadow-sm transition-all placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500/40"
            />
            {getErrorMessage("phone") && <p className="text-red-400 text-xs mt-1.5">{getErrorMessage("phone")}</p>}
          </div>
          <div>
            <Label className="text-sm text-gray-400 mb-1.5 block">Documento</Label>
            <InputMask
              mask="999.999.999-99"
              value={formData.document}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, document: e.target.value })}
              className="flex h-10 w-full rounded-xl border border-gray-800 bg-gray-900/80 px-3.5 py-2 text-sm text-white shadow-sm transition-all placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500/40"
            />
            {getErrorMessage("document") && <p className="text-red-400 text-xs mt-1.5">{getErrorMessage("document")}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
