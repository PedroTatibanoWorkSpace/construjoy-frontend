import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditPurchase } from "../../entities/credit-purchase.entity";

interface PaidCreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCreditPurchase: (paymentDate: Date) => void;
  creditPurchase: CreditPurchase | null;
}

const PaidCreditPurchaseModal: React.FC<PaidCreditPurchaseModalProps> = ({
  isOpen,
  onClose,
  onAddCreditPurchase,
  creditPurchase,
}) => {
  const [paymentDate, setPaymentDate] = useState("");

  useEffect(() => {
    if (creditPurchase?.paymentDate) {
      setPaymentDate(new Date(creditPurchase.paymentDate).toISOString().split("T")[0]);
    } else {
      setPaymentDate("");
    }
  }, [creditPurchase]);

  const handleClose = () => {
    setPaymentDate("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (paymentDate) {
      onAddCreditPurchase(new Date(paymentDate)); 
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg bg-gray-900 text-gray-100 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-100">
            Marcar como pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label className="text-sm text-gray-300">Data de Pagamento</Label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
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
                className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 rounded-md"
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

export default PaidCreditPurchaseModal;
