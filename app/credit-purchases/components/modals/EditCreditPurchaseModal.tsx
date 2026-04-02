import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectValue, SelectContent, SelectTrigger, SelectItem } from "@/components/ui/select";
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

export function EditCreditPurchaseModal({ isOpen, onClose, creditPurchase, onSave }: EditCreditPurchaseModalProps) {
  const [customerId, setCustomerId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<CreditPurchase>>({
    id: "", clientId: "", value: 0, description: "", validate: new Date(), purchaseDate: new Date(),
  });
  const [displayValue, setDisplayValue] = useState<string>("");
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const customers = useCustomers().data || [];

  useEffect(() => {
    if (creditPurchase) {
      setFormData({
        id: creditPurchase.id || "", clientId: creditPurchase.clientId || "",
        value: creditPurchase.value || 0, description: creditPurchase.description || "",
        validate: creditPurchase.validate instanceof Date ? creditPurchase.validate : new Date(creditPurchase.validate || ''),
        purchaseDate: creditPurchase.purchaseDate instanceof Date ? creditPurchase.purchaseDate : new Date(creditPurchase.purchaseDate || ''),
      });
      setCustomerId(creditPurchase.clientId || "");
      setDisplayValue(creditPurchase.value ? creditPurchase.value.toString() : "");
      setSearchTerm("");
    }
  }, [creditPurchase]);

  const filteredCustomers = customers.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!creditPurchase) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "value" ? parseFloat(value) : value });
  };

  const handleSave = () => {
    const numericValue = displayValue ? parseFloat(displayValue.replace(/\./g, "").replace(",", ".")) : 0;
    const purchaseDate = formData.purchaseDate instanceof Date ? formData.purchaseDate : new Date(formData.purchaseDate || '');
    const validate = formData.validate instanceof Date ? formData.validate : new Date(formData.validate || '');
    const preparedFormData = { ...formData, value: numericValue, purchaseDate, validate };
    const result = creditPurchaseSchema.safeParse(preparedFormData);
    if (!result.success) { setErrors(result.error.issues); return; }
    onSave(preparedFormData);
  };

  const getErrorMessage = (field: string) => {
    const error = errors.find((err) => err.path.includes(field));
    return error ? error.message : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Compra de Crédito</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-400 mb-1.5 block">Cliente</Label>
            <Select onValueChange={(v) => { setCustomerId(v); setFormData({ ...formData, clientId: v }); }} value={customerId || "default"}>
              <SelectTrigger className="rounded-xl border-gray-800 bg-gray-900/80 text-white h-10">
                <SelectValue>{customerId ? customers.find((c) => c.id === customerId)?.name : "Selecione um cliente"}</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 rounded-xl">
                <div className="px-2 py-2">
                  <Input placeholder="Pesquisar cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-2" onClick={(e) => e.stopPropagation()} />
                </div>
                <SelectItem value="default" disabled className="text-gray-500">Selecione um cliente</SelectItem>
                {filteredCustomers.map((c) => (
                  <SelectItem key={c.id} value={c.id || ""} className="text-gray-200 focus:bg-white/[0.06] focus:text-white">{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getErrorMessage("clientId") && <p className="text-red-400 text-xs mt-1.5">{getErrorMessage("clientId")}</p>}
          </div>
          <div>
            <Label className="text-sm text-gray-400 mb-1.5 block">Valor</Label>
            <CurrencyInput intlConfig={{ locale: "pt-BR", currency: "BRL" }} value={displayValue} onValueChange={(v) => setDisplayValue(v || "")} customInput={Input} placeholder="R$ 0,00" decimalsLimit={2} />
            {getErrorMessage("value") && <p className="text-red-400 text-xs mt-1.5">{getErrorMessage("value")}</p>}
          </div>
          <div>
            <Label className="text-sm text-gray-400 mb-1.5 block">Descrição</Label>
            <Input name="description" value={formData.description} onChange={handleChange} />
            {getErrorMessage("description") && <p className="text-red-400 text-xs mt-1.5">{getErrorMessage("description")}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-400 mb-1.5 block">Data da Compra</Label>
              <Input name="purchaseDate" type="date" value={formatDateForEditInput(formData.purchaseDate)} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value ? new Date(e.target.value) : new Date() })} />
              {getErrorMessage("purchaseDate") && <p className="text-red-400 text-xs mt-1.5">{getErrorMessage("purchaseDate")}</p>}
            </div>
            <div>
              <Label className="text-sm text-gray-400 mb-1.5 block">Vencimento</Label>
              <Input name="validate" type="date" value={formatDateForEditInput(formData.validate)} onChange={(e) => setFormData({ ...formData, validate: e.target.value ? new Date(e.target.value) : new Date() })} />
              {getErrorMessage("validate") && <p className="text-red-400 text-xs mt-1.5">{getErrorMessage("validate")}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl">Cancelar</Button>
          <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
