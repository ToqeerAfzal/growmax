
import { useState } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalState {
  isOpen: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export function useModal() {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showSuccess = (title: string, message: string) => {
    setModal({
      isOpen: true,
      type: 'success',
      title,
      message,
    });
  };

  const showError = (title: string, message: string) => {
    setModal({
      isOpen: true,
      type: 'error',
      title,
      message,
    });
  };

  const showInfo = (title: string, message: string) => {
    setModal({
      isOpen: true,
      type: 'info',
      title,
      message,
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const ModalComponent = () => (
    <Dialog open={modal.isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {modal.type === 'success' && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {modal.type === 'error' && (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            {modal.type === 'info' && (
              <AlertCircle className="h-5 w-5 text-blue-500" />
            )}
            {modal.title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {modal.message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={closeModal} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return {
    showSuccess,
    showError,
    showInfo,
    closeModal,
    ModalComponent,
  };
}
