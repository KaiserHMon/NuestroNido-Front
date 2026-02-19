'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const createNoteSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(50, 'Máximo 50 caracteres'),
  content: z.string().min(1, 'El contenido es requerido').max(500, 'Máximo 500 caracteres'),
});

type CreateNoteFormValues = z.infer<typeof createNoteSchema>;

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateNoteFormValues) => void;
  noteToEdit?: CreateNoteFormValues;
}

export function CreateNoteDialog({
  open,
  onOpenChange,
  onSubmit,
  noteToEdit,
}: CreateNoteDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateNoteFormValues>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (noteToEdit) {
        form.reset({
          title: noteToEdit.title,
          content: noteToEdit.content,
        });
      } else {
        form.reset({
          title: '',
          content: '',
        });
      }
    }
  }, [open, noteToEdit, form]);

  const handleFormSubmit = async (data: CreateNoteFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      if (!noteToEdit) {
        form.reset();
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Error al guardar la nota');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogTitle = noteToEdit ? 'Editar Nota' : 'Nueva Nota';
  const submitButtonText = noteToEdit ? 'Guardar Cambios' : 'Crear Nota';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription className="sr-only">
            Formulario para {noteToEdit ? 'editar la' : 'crear una nueva'} nota familiar
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Lista de compras" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe tu nota aquí..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
