import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-gray-100 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-100">Tem certeza?</DialogTitle>
        </DialogHeader>
        <p className="text-gray-300">Essa ação não pode ser desfeita.</p>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={onClose} className="bg-gray-700 text-gray-100 hover:bg-gray-600 rounded-md">
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-red-600 text-white hover:bg-red-500 rounded-md">
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
