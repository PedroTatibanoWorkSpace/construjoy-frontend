import React, { useState, useEffect } from "react";
import { customerSchema } from "../CustomerSchema";
import InputMask from "react-input-mask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer } from "../../entities/customers.entity";

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
    const result = customerSchema.safeParse({
      name,
      document,
      phone,
      email,
    });
    if (!result.success) {
      alert("Erro: " + JSON.stringify(result.error.format(), null, 2));
      return;
    }

    const newCustomer: Customer = {
      name,
      document,
      phone,
      email,
    };

    onAddCustomer(newCustomer);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg bg-gray-900 text-gray-100 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-100">
            Novo Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Nome</Label>
              <Input
                type="text"
                placeholder="Digite o nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
              />
            </div>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Documento</Label>
              <InputMask
                mask="999.999.999-99"
                placeholder="Digite o documento"
                value={document}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDocument(e.target.value)
                }
              >
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
                  />
                )}
              </InputMask>
            </div>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Telefone</Label>
              <InputMask
                mask="(99) 99999-9999"
                placeholder="Digite o telefone"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
              >
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
                  />
                )}
              </InputMask>
            </div>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Email</Label>
              <Input
                type="email"
                placeholder="Digite o email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="bg-blue-600 text-white hover:bg-blue-500 rounded-md"
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

export default NewCustomerModal;
