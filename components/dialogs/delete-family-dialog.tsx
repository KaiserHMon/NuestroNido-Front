'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFamily } from '@/hooks/use-family';
import { Family } from '@/lib/types';
import { BaseDialog } from './base-dialog';
import { Bird, Loader2 } from 'lucide-react';

interface DeleteFamilyDialogProps {
  family: Family;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteFamilyDialog({
  family,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: DeleteFamilyDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { deleteFamily, error } = useFamily();

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;

  const { register, handleSubmit, reset, watch } = useForm<{ confirmationText: string }>({
    defaultValues: {
      confirmationText: '',
    },
  });

  const confirmationText = watch('confirmationText');
  const isConfirmationValid = confirmationText === family.name;

  const handleFormSubmit = async () => {
    if (!isConfirmationValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteFamily(family.id);
      setOpen(false);
      reset();
      router.push('/home');
    } catch (error) {
      console.error('Error deleting family:', error);
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
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center animate-bounce mb-4">
            <Bird className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">Eliminando Nido...</h3>
            <p className="text-muted-foreground">Estamos borrando todos los datos de forma segura</p>
            <Loader2 className="w-6 h-6 animate-spin mx-auto mt-4 text-destructive" />
          </div>
        </div>
      )}
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
        onSubmit={handleSubmit(handleFormSubmit)}
        submitButtonLabel="Eliminar Permanentemente"
        submitButtonVariant="destructive"
        isSubmitDisabled={!isConfirmationValid}
      >
        <div className="flex flex-col gap-4">
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
              Confirma escribiendo: <strong>{family.name}</strong>
            </Label>
            <Input
              id="confirmacion"
              type="text"
              placeholder={`Escribe "${family.name}"`}
              className="bg-background border-input text-foreground placeholder:text-muted-foreground"
              {...register('confirmationText')}
              disabled={isSubmitting}
            />
            {!isConfirmationValid && confirmationText && (
              <p className="text-sm text-destructive">El nombre no coincide</p>
            )}
          </div>
        </div>
      </BaseDialog>
    </>
  );
}
