"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { usePaidMultipleAccounts } from "@/app/credit-purchases/service/reactQuery/creditPurchase.query";
import { Customer } from "../../entities/customers.entity";
import { toast } from "@/hooks/use-toast";

interface PaidMultipleModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export function PaidMultipleModal({ isOpen, onClose, customer }: PaidMultipleModalProps) {
  const [initialDate, setInitialDate] = useState<string>("");
  const [finishDate, setFinishDate] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);

  const paidMultipleMutation = usePaidMultipleAccounts();

  useEffect(() => {
    setIsFormValid(!!initialDate && !!finishDate && !!paymentDate);
  }, [initialDate, finishDate, paymentDate]);

  const handleClose = () => {
    setInitialDate(""); setFinishDate(""); setPaymentDate("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer?.id) { toast.error("Erro de validação", "Cliente não selecionado."); return; }
    if (!initialDate || !finishDate || !paymentDate) { toast.error("Erro de validação", "Preencha todas as datas obrigatórias."); return; }

    const formatInitialDate = new Date(initialDate); formatInitialDate.setHours(0, 0, 0, 0);
    const formatFinishDate = new Date(finishDate); formatFinishDate.setHours(23, 59, 59, 999);
    const formatPaymentDate = new Date(paymentDate); formatPaymentDate.setHours(23, 59, 59, 999);

    paidMultipleMutation.mutate({
      id: customer.id,
      data: { initialDate: formatInitialDate, finishDate: formatFinishDate, paymentDate: formatPaymentDate }
    }, {
      onSuccess: (data) => {
        if (data && data.length > 0) {
          toast.success("Pagamentos registrados", `${data.length} pagamentos foram registrados com sucesso!`);
        } else {
          toast.info("Nenhum pagamento registrado", "Não foram encontradas compras no período selecionado.");
        }
        handleClose();
      },
      onError: (error: any) => {
        toast.error("Erro ao registrar pagamentos", error?.message || "Não foi possível registrar os pagamentos.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Pagamentos Múltiplos</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-400 mb-1.5 block">Data Inicial</Label>
              <Input type="date" value={initialDate} onChange={(e) => setInitialDate(e.target.value)} required />
            </div>
            <div>
              <Label className="text-sm text-gray-400 mb-1.5 block">Data Final</Label>
              <Input type="date" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} required />
            </div>
            <div>
              <Label className="text-sm text-gray-400 mb-1.5 block">Data de Pagamento</Label>
              <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={handleClose} className="text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" disabled={paidMultipleMutation.isPending || !isFormValid} className="bg-blue-600 text-white hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-40">
              {paidMultipleMutation.isPending ? "Processando..." : "Registrar Pagamentos"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
