'use client';

import { useState, useEffect } from 'react';
import { Miembro } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BaseDialog } from './base-dialog';

const EditarPerfilSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
});

type EditarPerfilInputs = z.infer<typeof EditarPerfilSchema>;

interface EditarPerfilDialogProps {
  miembro: Miembro | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (miembroActualizado: Miembro) => Promise<void>;
}

export function EditarPerfilDialog({
  miembro,
  open,
  onOpenChange,
  onConfirm,
}: EditarPerfilDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditarPerfilInputs>({
    resolver: zodResolver(EditarPerfilSchema),
    defaultValues: {
      nombre: miembro?.nombre || '',
    },
  });

  useEffect(() => {
    if (miembro) {
      reset({
        nombre: miembro.nombre,
      });
    }
  }, [miembro, reset, open]);

  const onSubmit = async (data: EditarPerfilInputs) => {
    if (!miembro) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const miembroActualizado: Miembro = {
        ...miembro,
        nombre: data.nombre,
      };
      await onConfirm(miembroActualizado);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!miembro) return null;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Perfil"
      description="Actualiza la información de tu perfil"
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit(onSubmit)}
      submitButtonLabel="Guardar Cambios"
    >
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-foreground font-medium">
            Nombre
          </Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Tu nombre"
            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register('nombre')}
            disabled={isSubmitting}
          />
          {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
        </div>
      </div>
    </BaseDialog>
  );
}
