'use client';

import { useState, useEffect } from 'react';
import { Member } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BaseDialog } from './base-dialog';

const editProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
});

type EditProfileInputs = z.infer<typeof editProfileSchema>;

interface EditProfileDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (updatedMember: Member) => Promise<void>;
}

export function EditProfileDialog({
  member,
  open,
  onOpenChange,
  onConfirm,
}: EditProfileDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileInputs>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: member?.name || '',
    },
  });

  useEffect(() => {
    if (member) {
      reset({
        name: member.name,
      });
    }
  }, [member, reset, open]);

  const handleFormSubmit = async (data: EditProfileInputs) => {
    if (!member) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const updatedMember: Member = {
        ...member,
        name: data.name,
      };
      await onConfirm(updatedMember);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!member) return null;

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Perfil"
      description="Actualiza la información de tu perfil"
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit(handleFormSubmit)}
      submitButtonLabel="Guardar Cambios"
    >
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground font-medium">
            Nombre
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
            {...register('name')}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
      </div>
    </BaseDialog>
  );
}
