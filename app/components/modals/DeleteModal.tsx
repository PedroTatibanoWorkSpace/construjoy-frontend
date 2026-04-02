import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
          </div>
          <DialogTitle className="text-center">Tem certeza?</DialogTitle>
          <DialogDescription className="text-center">
            Essa ação não pode ser desfeita. O registro será removido permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-300 hover:text-white hover:bg-white/[0.06] rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-500 rounded-xl shadow-lg shadow-red-600/20"
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
