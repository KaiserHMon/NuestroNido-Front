'use client';

import { useState, useEffect } from 'react';
import { Miembro } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import { BaseDialog } from './base-dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EliminarMiembroDialogProps {
  miembro: Miembro | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (nuevoCreadorId?: string) => Promise<void>;
  esUsuarioActual?: boolean;
  miembrosCandidatos?: Miembro[];
}

export function EliminarMiembroDialog({
  miembro,
  open,
  onOpenChange,
  onConfirm,
  esUsuarioActual = false,
  miembrosCandidatos = [],
}: EliminarMiembroDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nuevoCreadorId, setNuevoCreadorId] = useState<string>('');

  const esCreador = miembro?.rolId === 'creador';
  const requiereSucesor = esUsuarioActual && esCreador && miembrosCandidatos.length > 0;

  useEffect(() => {
    if (open) {
      // Pre-seleccionar el miembro más antiguo (el primero de la lista ordenada)
      if (miembrosCandidatos.length > 0) {
        setNuevoCreadorId(miembrosCandidatos[0].id);
      } else {
        setNuevoCreadorId('');
      }
      setError(null);
    }
  }, [open, miembrosCandidatos]);

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (requiereSucesor && !nuevoCreadorId) {
      setError('Debes asignar un nuevo creador antes de salir.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(nuevoCreadorId || undefined);
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
      isSubmitDisabled={requiereSucesor && !nuevoCreadorId}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
          <p className="text-sm text-destructive font-medium">
            {esUsuarioActual
              ? 'Al confirmar, serás removido de la familia'
              : `Al confirmar, ${miembro.nombre} será removido de la familia`}
          </p>
        </div>

        {requiereSucesor && (
          <div className="space-y-2">
            <Label>Asignar nuevo administrador</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Como eres el creador, debes delegar el rol de administrador a otro miembro antes de salir.
            </p>
            <Select value={nuevoCreadorId} onValueChange={setNuevoCreadorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un miembro" />
              </SelectTrigger>
              <SelectContent>
                {miembrosCandidatos.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: m.color.bg }}
                      />
                      {m.nombre}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </BaseDialog>
  );
}
