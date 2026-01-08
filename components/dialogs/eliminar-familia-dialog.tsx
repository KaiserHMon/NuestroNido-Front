'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFamilia } from '@/hooks/use-familia';
import { Familia } from '@/lib/types';
import { BaseDialog } from './base-dialog';

interface EliminarFamiliaDialogProps {
  familia: Familia;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EliminarFamiliaDialog({
  familia,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: EliminarFamiliaDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { eliminarFamilia, error } = useFamilia();

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;

  const { register, handleSubmit, reset, watch } = useForm<{ confirmacionTexto: string }>({
    defaultValues: {
      confirmacionTexto: '',
    },
  });

  const confirmacionTexto = watch('confirmacionTexto');
  const confirmacionValida = confirmacionTexto === familia.nombre;

  const onSubmit = async () => {
    if (!confirmacionValida) {
      return;
    }

    setIsSubmitting(true);
    try {
      await eliminarFamilia(familia.id);
      setOpen(false);
      reset();

      localStorage.removeItem('familia');
      router.push('/home');
    } catch (error) {
      console.error('Error eliminando familia:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="¿Eliminar Familia?"
      description="Esta acción es irreversible."
      trigger={
        trigger === undefined ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
          >
            🗑️
          </Button>
        ) : (
          trigger
        )
      }
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit(onSubmit)}
      submitButtonLabel="Eliminar Permanentemente"
      submitButtonVariant="destructive"
      isSubmitDisabled={!confirmacionValida}
    >
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
        <div className="text-sm">
          <p className="text-destructive font-medium mb-2">Se eliminarán:</p>
          <ul className="text-destructive/80 space-y-1">
            <li>✓ Todos los miembros</li>
            <li>✓ Todas las notas</li>
            <li>✓ Todas las tareas</li>
            <li>✓ Todas las listas</li>
            <li>✓ El historial</li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmacion" className="text-foreground font-medium">
          Confirma escribiendo: <strong>{familia.nombre}</strong>
        </Label>
        <Input
          id="confirmacion"
          type="text"
          placeholder={`Escribe "${familia.nombre}"`}
          className="bg-background border-input text-foreground placeholder:text-muted-foreground"
          {...register('confirmacionTexto')}
          disabled={isSubmitting}
        />
        {!confirmacionValida && confirmacionTexto && (
          <p className="text-sm text-destructive">El nombre no coincide</p>
        )}
      </div>
    </BaseDialog>
  );
}
