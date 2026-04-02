import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CreditPurchase } from "../../entities/credit-purchase.entity";

interface PaidCreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCreditPurchase: (paymentDate: Date) => void;
  creditPurchase: CreditPurchase | null;
}

const PaidCreditPurchaseModal: React.FC<PaidCreditPurchaseModalProps> = ({
  isOpen, onClose, onAddCreditPurchase, creditPurchase,
}) => {
  const [paymentDate, setPaymentDate] = useState("");

  useEffect(() => {
    if (creditPurchase?.paymentDate) {
      setPaymentDate(new Date(creditPurchase.paymentDate).toISOString().split("T")[0]);
    } else {
      setPaymentDate("");
    }
  }, [creditPurchase]);

  const handleClose = () => { setPaymentDate(""); onClose(); };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (paymentDate) { onAddCreditPurchase(new Date(paymentDate)); handleClose(); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Marcar como Pago</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div>
            <Label className="text-sm text-gray-400 mb-1.5 block">Data de Pagamento</Label>
            <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={handleClose} className="text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" disabled={!paymentDate} className="bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-40">
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaidCreditPurchaseModal;
