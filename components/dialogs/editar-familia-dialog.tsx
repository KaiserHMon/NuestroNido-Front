'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActualizarFamiliaSchema, ActualizarFamiliaFormInputs } from '@/lib/validation';
import { useFamilia } from '@/hooks/use-familia';
import { Familia } from '@/lib/types';
import { BaseDialog } from './base-dialog';

interface EditarFamiliaDialogProps {
  familia: Familia;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function EditarFamiliaDialog({ familia, onSuccess, trigger }: EditarFamiliaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { actualizarNombre, error } = useFamilia();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ActualizarFamiliaFormInputs>({
    resolver: zodResolver(ActualizarFamiliaSchema),
    defaultValues: {
      nuevoNombre: familia.nombre,
    },
  });

  const onSubmit = async (data: ActualizarFamiliaFormInputs) => {
    setIsSubmitting(true);
    try {
      await actualizarNombre(familia.id, data.nuevoNombre);
      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error actualizando familia:', error);
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
      title="Editar Nombre de la Familia"
      description="Cambia el nombre de tu familia. Este cambio será visible para todos los miembros."
      trigger={trigger || <Button variant="ghost" size="sm" className="h-8 w-8 p-0">✏️</Button>}
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit(onSubmit)}
      submitButtonLabel="Guardar"
    >
      <div className="space-y-2">
        <Label htmlFor="nuevoNombre" className="text-foreground font-medium">
          Nombre de la Familia
        </Label>
        <Input
          id="nuevoNombre"
          type="text"
          placeholder="Ej: Familia García"
          className="bg-background border-input text-foreground placeholder:text-muted-foreground"
          {...register('nuevoNombre')}
          disabled={isSubmitting}
        />
        {errors.nuevoNombre && (
          <p className="text-sm text-destructive">{errors.nuevoNombre.message}</p>
        )}
      </div>
    </BaseDialog>
  );
}
