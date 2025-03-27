"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    setInitialDate("");
    setFinishDate("");
    setPaymentDate("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customer?.id) {
      toast.error("Erro de validação", "Cliente não selecionado.");
      return;
    }
    
    if (!initialDate || !finishDate || !paymentDate) {
      toast.error("Erro de validação", "Preencha todas as datas obrigatórias.");
      return;
    }
  
    const formatInitialDate = new Date(initialDate);
    formatInitialDate.setHours(0, 0, 0, 0); 
    
    const formatFinishDate = new Date(finishDate);
    formatFinishDate.setHours(23, 59, 59, 999); 
    
    const formatPaymentDate = new Date(paymentDate);
    formatPaymentDate.setHours(23, 59, 59, 999); 
    
    paidMultipleMutation.mutate({
      id: customer.id,
      data: {
        initialDate: formatInitialDate,
        finishDate: formatFinishDate,
        paymentDate: formatPaymentDate
      }
    }, {
      onSuccess: (data) => {
        if (data && data.length > 0) {
          toast.success(
            "Pagamentos registrados", 
            `${data.length} pagamentos foram registrados com sucesso!`
          );
        } else {
          toast.info("Nenhum pagamento registrado", "Não foram encontradas compras no período selecionado.");
        }
        handleClose();
      },
      onError: (error: any) => {
        toast.error(
          "Erro ao registrar pagamentos", 
          error?.message || "Não foi possível registrar os pagamentos."
        );
      }
    });
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg bg-gray-900 text-gray-100 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-100">
            Registrar Pagamentos Múltiplos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Data Inicial</Label>
              <Input
                type="date"
                value={initialDate}
                onChange={(e) => setInitialDate(e.target.value)}
                className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Data Final</Label>
              <Input
                type="date"
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Data de Pagamento</Label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="bg-gray-800 text-gray-100 border border-gray-700 rounded-md"
                required
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
                disabled={paidMultipleMutation.isLoading || !isFormValid}
              >
                {paidMultipleMutation.isLoading ? "Processando..." : "Registrar Pagamentos"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
