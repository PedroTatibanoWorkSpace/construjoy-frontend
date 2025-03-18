import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputMask from "react-input-mask";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Customer } from "../../entities/customers.entity";
import { customerSchema } from "../CustomerSchema";
import { z } from "zod";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: (updatedCustomer: Omit<Customer, "createdAt" | "status">) => void;
}

export function EditCustomerModal({ isOpen, onClose, customer, onSave }: EditCustomerModalProps) {
  const [formData, setFormData] = useState<Omit<Customer, "createdAt" | "status">>({
    id: "",
    name: "",
    email: "",
    phone: "",
    document: "",
  });

  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer.id || "",
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        document: customer.document,
      });
    }
  }, [customer]);

  if (!customer) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const result = customerSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.issues);
      return;
    }
    onSave(formData);
  };

  const getErrorMessage = (field: string) => {
    const error = errors.find((err) => err.path.includes(field));
    return error ? error.message : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-gray-100 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-100">Editar Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-300">Nome</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
            />
            {getErrorMessage("name") && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage("name")}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-300">Email</Label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
            />
            {getErrorMessage("email") && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage("email")}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-300">Telefone</Label>
            <InputMask
              mask="(99) 99999-9999"
              value={formData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            >
              {(inputProps) => (
                <Input
                  {...inputProps}
                  className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
                />
              )}
            </InputMask>
            {getErrorMessage("phone") && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage("phone")}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-300">Documento</Label>
            <InputMask
              mask="999.999.999-99"
              value={formData.document}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, document: e.target.value })
              }
            >
              {(inputProps) => (
                <Input
                  {...inputProps}
                  className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
                />
              )}
            </InputMask>
            {getErrorMessage("document") && (
              <p className="text-red-500 text-xs mt-1">{getErrorMessage("document")}</p>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose} className="bg-gray-700 text-gray-100 hover:bg-gray-600 rounded-md">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-500 rounded-md">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
