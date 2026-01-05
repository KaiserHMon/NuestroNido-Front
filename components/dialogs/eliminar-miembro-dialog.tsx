'use client';

import { useState } from 'react';
import { Miembro } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import { BaseDialog } from './base-dialog';

interface EliminarMiembroDialogProps {
  miembro: Miembro | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  esUsuarioActual?: boolean;
}

export function EliminarMiembroDialog({
  miembro,
  open,
  onOpenChange,
  onConfirm,
  esUsuarioActual = false,
}: EliminarMiembroDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar miembro');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!miembro) return null;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={esUsuarioActual ? '¿Dejar la familia?' : `¿Eliminar a ${miembro.nombre}?`}
      description={
        esUsuarioActual
          ? 'Saldrás de la familia y perderás acceso a datos familiares.'
          : `Se eliminará a ${miembro.nombre} de la familia y perderá acceso a todos los datos.`
      }
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleConfirm}
      submitButtonLabel={esUsuarioActual ? 'Salir de la familia' : 'Eliminar miembro'}
      submitButtonVariant="destructive"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
        <p className="text-sm text-destructive font-medium">
          {esUsuarioActual
            ? 'Al confirmar, serás removido de la familia'
            : `Al confirmar, ${miembro.nombre} será removido de la familia`}
        </p>
      </div>
    </BaseDialog>
  );
}
