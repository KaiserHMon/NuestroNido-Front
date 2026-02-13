'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UpdateFamilySchema, UpdateFamilyFormInputs } from '@/lib/validation';
import { useFamily } from '@/hooks/use-family';
import { Family } from '@/lib/types';
import { BaseDialog } from './base-dialog';

interface EditFamilyDialogProps {
  family: Family;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditFamilyDialog({ 
  family, 
  onSuccess, 
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}: EditFamilyDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? externalOnOpenChange! : setInternalOpen;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateName, error } = useFamily();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateFamilyFormInputs>({
    resolver: zodResolver(UpdateFamilySchema),
    defaultValues: {
      newName: family.name,
    },
  });

  const handleFormSubmit = async (data: UpdateFamilyFormInputs) => {
    setIsSubmitting(true);
    try {
      await updateName(family.id, data.newName);
      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error updating family:', error);
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
      trigger={
        trigger === undefined ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            ✏️
          </Button>
        ) : (
          trigger
        )
      }
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit(handleFormSubmit)}
      submitButtonLabel="Guardar"
    >
      <div className="space-y-2">
        <Label htmlFor="newName" className="text-foreground font-medium">
          Nombre de la Familia
        </Label>
        <Input
          id="newName"
          type="text"
          placeholder="Ej: Familia García"
          className="bg-background border-input text-foreground placeholder:text-muted-foreground"
          {...register('newName')}
          disabled={isSubmitting}
        />
        {errors.newName && (
          <p className="text-sm text-destructive">{errors.newName.message}</p>
        )}
      </div>
    </BaseDialog>
  );
}
