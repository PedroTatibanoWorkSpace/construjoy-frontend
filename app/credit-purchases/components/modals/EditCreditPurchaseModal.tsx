import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { CreditPurchase } from "../../entities/credit-purchase.entity";
import { creditPurchaseSchema } from "../zod/CreditPurchaseSchema";
import { z } from "zod";
import CurrencyInput from "react-currency-input-field";
import { useCustomers } from "@/app/customers/service/reactQuery/customer.query";
import { formatDateForEditInput } from "@/app/utils";

interface EditCreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditPurchase: CreditPurchase | null;
  onSave: (updatedCreditPurchase: Partial<CreditPurchase>) => void;
}

export function EditCreditPurchaseModal({
  isOpen,
  onClose,
  creditPurchase,
  onSave,
}: EditCreditPurchaseModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<CreditPurchase>>({
    id: "",
    clientId: "",
    value: 0,
    description: "",
    validate: new Date(),
    purchaseDate: new Date(),
  });
  const [displayValue, setDisplayValue] = useState<string>("");
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const customers = useCustomers().data || [];

  useEffect(() => {
    if (creditPurchase) {
      setFormData({
        id: creditPurchase.id || "",
        clientId: creditPurchase.clientId || "",
        value: creditPurchase.value || 0,
        description: creditPurchase.description || "",
        validate: creditPurchase.validate instanceof Date ? 
          creditPurchase.validate : 
          new Date(creditPurchase.validate || ''),
        purchaseDate: creditPurchase.purchaseDate instanceof Date ? 
          creditPurchase.purchaseDate : 
          new Date(creditPurchase.purchaseDate || ''),
      });

      setCustomerId(creditPurchase.clientId || "");
      setDisplayValue(
        creditPurchase.value ? creditPurchase.value.toString() : ""
      );
      setSearchTerm("");
    }
  }, [creditPurchase]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!creditPurchase) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "value" ? parseFloat(value) : value,
    });
  };

  const handleCustomerChange = (value: string) => {
    setCustomerId(value);
    setFormData({ ...formData, clientId: value });
  };

  const handleSave = () => {
    const numericValue = displayValue
      ? parseFloat(displayValue.replace(/\./g, "").replace(",", "."))
      : 0;

    const purchaseDate = formData.purchaseDate instanceof Date 
      ? formData.purchaseDate 
      : new Date(formData.purchaseDate || '');
    
    const validate = formData.validate instanceof Date 
      ? formData.validate 
      : new Date(formData.validate || '');
    
    const preparedFormData = { 
      ...formData, 
      value: numericValue,
      purchaseDate,
      validate
    };
    
    const result = creditPurchaseSchema.safeParse(preparedFormData);
    if (!result.success) {
      setErrors(result.error.issues);
      return;
    }
    onSave(preparedFormData);
  };

  const getErrorMessage = (field: string) => {
    const error = errors.find((err) => err.path.includes(field));
    return error ? error.message : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-gray-100 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-100">
            Editar Compra de Crédito
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-300">Cliente</Label>
            <Select
              onValueChange={handleCustomerChange}
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
                  />
                </div>
                <SelectItem value="default" disabled className="text-gray-500">
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
            {getErrorMessage("clientId") && (
              <p className="text-red-500 text-xs mt-1">
                {getErrorMessage("clientId")}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-300">Valor</Label>
            <CurrencyInput
              intlConfig={{ locale: "pt-BR", currency: "BRL" }}
              value={displayValue}
              onValueChange={(value) => setDisplayValue(value || "")}
              customInput={Input}
              placeholder="R$ 0,00"
              className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
              decimalsLimit={2}
            />
            {getErrorMessage("value") && (
              <p className="text-red-500 text-xs mt-1">
                {getErrorMessage("value")}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-300">Descrição</Label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
            />
            {getErrorMessage("description") && (
              <p className="text-red-500 text-xs mt-1">
                {getErrorMessage("description")}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-300">Data da Compra</Label>
            <Input
              name="purchaseDate"
              type="date"
              value={formatDateForEditInput(formData.purchaseDate)}
              onChange={(e) => {
                const newDate = e.target.value
                  ? new Date(e.target.value)
                  : new Date();
                setFormData({ ...formData, purchaseDate: newDate });
              }}
              className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
            />
            {getErrorMessage("purchaseDate") && (
              <p className="text-red-500 text-xs mt-1">
                {getErrorMessage("purchaseDate")}
              </p>
            )}
          </div>

          <div>
            <Label className="text-sm text-gray-300">Data de vencimento</Label>
            <Input
              name="validate"
              type="date"
              value={formatDateForEditInput(formData.validate)}
              onChange={(e) => {
                const newDate = e.target.value
                  ? new Date(e.target.value)
                  : new Date();
                setFormData({ ...formData, validate: newDate });
              }}
              className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
            />
            {getErrorMessage("validate") && (
              <p className="text-red-500 text-xs mt-1">
                {getErrorMessage("validate")}
              </p>
            )}
          </div>

        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="bg-gray-700 text-gray-100 hover:bg-gray-600 rounded-md"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 text-white hover:bg-blue-800 rounded-md"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
